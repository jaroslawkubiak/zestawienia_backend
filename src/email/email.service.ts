import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as nodemailer from 'nodemailer';
import { from, Observable } from 'rxjs';
import { IComment } from '../comments/types/IComment';
import { SetsService } from '../sets/sets.service';
import { Repository } from 'typeorm';
import { ErrorDto } from '../errors/dto/error.dto';
import { ErrorsService } from '../errors/errors.service';
import { ErrorsType } from '../errors/types/Errors';
import { getFormatedDate } from '../helpers/getFormatedDate';
import { PositionsService } from '../position/positions.service';
import { CreateIdDto } from '../shared/dto/createId.dto';
import { LogEmailDto } from './dto/logEmail.dto';
import { Email } from './email.entity';
import { createHTMLHeader } from './email.template';
import { IEmailDetails } from './types/IEmailDetails';
import { IEmailLog } from './types/IEmailLog';

interface ICommentList {
  product: string;
  comment: string;
  createdAt: string;
}

@Injectable()
export class EmailService {
  private transporter;

  constructor(
    @InjectRepository(Email)
    private readonly emailRepo: Repository<Email>,
    private readonly errorsService: ErrorsService,
    private readonly setsService: SetsService,
    private readonly positionService: PositionsService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendEmail(emailDetails: IEmailDetails) {
    const { to, subject, content } = emailDetails;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: content,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);

      if (info.response.includes('OK')) {
        // log email in DB
        const newEmailLog: LogEmailDto = {
          ...emailDetails,
          sendAt: getFormatedDate(),
          sendAtTimestamp: Number(Date.now()),
          sendBy: { id: emailDetails.userId } as CreateIdDto,
          setId: { id: emailDetails.setId } as CreateIdDto,
          clientId: emailDetails?.clientId
            ? { id: emailDetails?.clientId }
            : (null as CreateIdDto),
          supplierId: emailDetails?.supplierId
            ? { id: emailDetails?.supplierId }
            : (null as CreateIdDto),
        };

        await this.create(newEmailLog);
      }

      return info;
    } catch (err) {
      const message = emailDetails?.clientId ? 'client' : 'supplier';
      const recipientId = emailDetails?.clientId
        ? emailDetails.clientId
        : emailDetails?.supplierId;

      const newError: ErrorDto = {
        type: ErrorsType.email,
        message: `Failed to send email to ${message}`,
        error: JSON.stringify(err?.message) || 'null',
        setId: emailDetails.setId,
        recipientId,
        recipientEmail: to,
        link: emailDetails.link,
        createdAt: getFormatedDate() || new Date().toISOString(),
        createdAtTimestamp: Number(Date.now()),
      };

      await this.errorsService.prepareError(newError);

      throw new InternalServerErrorException({
        message: `Nie udało się wysłać email na: ${to}`,
        error: err.message,
        details: err,
      });
    }
  }

  async sendEmailAboutNewComments(setId: number, newComments: IComment[]) {
    const set = await this.setsService.findOne(setId);
    const clientFullName = set.clientId.company
      ? set.clientId.company
      : set.clientId.firstName + ' ' + set.clientId.lastName;

    this.positionService.getPositions(setId).subscribe({
      next: (positions) => {
        const commentsList: ICommentList[] = newComments.map((comment) => {
          if (comment.positionId.id) {
            const position = positions.find(
              (item) => item.id === comment.positionId.id,
            );

            return {
              product: position.produkt || '',
              comment: comment.comment,
              createdAt: comment.createdAt,
            };
          }
        });

        const verbComments =
          newComments.length === 1 ? ' komentarza' : ' komentarzy';

        const htmlHeader = `Klient ${clientFullName} zakończył dodawanie ${newComments.length} ${verbComments} do inwestycji: ${set.name}<br /><br />`;
        let htmlcontent = `
          <table align="center" border="1" cellpadding="8" style="width: 100%; border-collapse: collapse; border: 1px solid black;">
          <tr><td>Produkt</td>
          <td>Komentarz</td>
          <td>Data</td></tr>`;

        commentsList.forEach((comment) => {
          let row = `<tr><td>${comment.product}</td>`;
          row += `<td>${comment.comment}</td>`;
          row += `<td>${comment.createdAt}</td></tr>`;

          htmlcontent += row;
        });

        htmlcontent += '</table>';

        const html = createHTMLHeader(htmlHeader, htmlcontent);
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER,
          subject: `Nowe komentarze w inwestycji: ${set.name}`,
          html,
        };

        this.transporter.sendMail(mailOptions);
      },
      error: (err) => console.error(err),
    });
  }

  async create(emailLog: LogEmailDto): Promise<IEmailLog> {
    const newLog = this.emailRepo.create(emailLog);
    return this.emailRepo.save(newLog);
  }

  findAll(): Observable<Email[]> {
    const query = this.emailRepo
      .createQueryBuilder('email')
      .leftJoinAndSelect('email.clientId', 'client')
      .leftJoinAndSelect('email.supplierId', 'supplier')
      .leftJoinAndSelect('email.sendBy', 'user')
      .leftJoinAndSelect('email.setId', 'set')
      .select([
        'email.id',
        'email.link',
        'email.to',
        'email.subject',
        'email.sendAt',
        'email.sendAtTimestamp',
        'email.setId',
        'client.company',
        'client.firstName',
        'client.lastName',
        'supplier.company',
        'user.name',
        'set.id',
        'set.name',
      ])
      .orderBy('email.id', 'DESC');

    return from(query.getMany());
  }

  findOne(setId: number): Observable<Email[]> {
    const query = this.emailRepo
      .createQueryBuilder('email')
      .leftJoinAndSelect('email.clientId', 'client')
      .leftJoinAndSelect('email.supplierId', 'supplier')
      .leftJoinAndSelect('email.sendBy', 'user')
      .select([
        'email.id',
        'email.link',
        'email.sendAt',
        'email.sendAtTimestamp',
        'email.setId',

        'client.id',
        'client.company',
        'client.email',

        'supplier.id',
        'supplier.company',
        'supplier.email',

        'user.id',
        'user.name',
      ])
      .where('email.setId.id = :setId', { setId: setId })
      .orderBy('email.id', 'DESC');

    return from(query.getMany());
  }
}
