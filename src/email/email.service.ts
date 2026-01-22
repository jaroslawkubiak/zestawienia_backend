import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as nodemailer from 'nodemailer';
import { async, from, map, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { IComment } from '../comments/types/IComment';
import { ErrorDto } from '../errors/dto/error.dto';
import { ErrorsService } from '../errors/errors.service';
import { ErrorsType } from '../errors/types/Errors';
import { getFormatedDate } from '../helpers/getFormatedDate';
import { PositionsService } from '../position/positions.service';
import { SetsService } from '../sets/sets.service';
import { CreateIdDto } from '../shared/dto/createId.dto';
import { LogEmailDto } from './dto/logEmail.dto';
import { Email } from './email.entity';
import { createCommentsTable, createHTML } from './email.template';
import { saveToSentFolder } from './emailSendCopy';
import { ICommentList } from './types/ICommentList';
import { IEmailDetails } from './types/IEmailDetails';
import { IEmailLog } from './types/IEmailLog';
import { ISendedEmailsFromDB } from './types/ISendedEmailsFromDB';
import { info } from 'console';
import { create } from 'domain';
import { query } from 'express';

@Injectable()
export class EmailService {
  private transporter;
  private APP_URL = 'https://zestawienia.zurawickidesign.pl';

  private getImapConfig() {
    return {
      user: process.env.EMAIL_USER,
      password: process.env.EMAIL_PASS,
      host: process.env.EMAIL_IMAP_HOST,
      port: Number(process.env.EMAIL_IMAP_PORT),
      tls: true,
    };
  }

  constructor(
    @InjectRepository(Email)
    private readonly emailRepo: Repository<Email>,
    private readonly errorsService: ErrorsService,
    @Inject(forwardRef(() => SetsService))
    private readonly setsService: SetsService,
    @Inject(forwardRef(() => PositionsService))
    private readonly positionService: PositionsService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    // }
  }

  // bcc: 'admin@zurawickidesign.pl',
  async sendEmail(emailDetails: IEmailDetails) {
    const { to, subject, content } = emailDetails;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: content,
    };

    try {
      // testIMAP();
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

        // send copy email do Sent folder
        // await saveToSentFolder(this.getImapConfig(), mailOptions);
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
        message: `Nie udało się wysłać email na adres: ${to}`,
        error: err.message,
        details: err,
      });
    }
  }

  private async sendEmailAboutNewComments(options: {
    setId: number;
    newComments: IComment[];
    headerText: string;
    link: string;
    recipient: string;
  }) {
    const { setId, newComments, headerText, recipient, link } = options;

    const set = await this.setsService.findOne(setId);

    this.positionService.getPositions(setId).subscribe({
      next: (positions) => {
        const commentsList: ICommentList[] = newComments.map((comment) => {
          if (!comment.positionId?.id) return;

          const position = positions.find(
            (item) => item.id === comment.positionId.id,
          );

          return {
            product: position?.produkt || '',
            comment: comment.comment,
            createdAt: comment.createdAt,
          };
        });

        const verbComments =
          newComments.length === 1 ? ' komentarza' : ' komentarzy';

        const HTMLheader = `${headerText} ${newComments.length} ${verbComments} do inwestycji: ${set.name}<br /><br />`;

        const html = createHTML(
          HTMLheader,
          createCommentsTable(commentsList),
          link,
        );

        let sender = process.env.EMAIL_USER;
        if (process.env.GMAIL_USE === 'true') {
          sender = process.env.GMAIL_USER;
        }

        const mailOptions = {
          from: sender,
          to: recipient,
          subject: `Nowe komentarze w inwestycji: ${set.name}`,
          html,
        };

        this.transporter.sendMail(mailOptions);
      },
      error: (err) => console.error(err),
    });
  }

  async sendEmailAboutNewCommentsFromOffice(
    setId: number,
    newComments: IComment[],
  ) {
    const set = await this.setsService.findOne(setId);

    const link = `
      <tr>
        <td style="padding: 20px" colspan="2">
          <a href="${this.APP_URL}/${set.id}/${set.hash}" target="_blank" 
          style="color: #3bbfa1; font-size: 24px; font-weight: bold; text-decoration: none">Link do zestawienia</a>
          </p>
        </td>
      </tr>`;

    return this.sendEmailAboutNewComments({
      setId,
      newComments,
      headerText: `Biuro Żurawicki Design zakończyło dodawanie`,
      link,
      recipient: set.clientId.email,
    });
  }

  async sendEmailAboutNewCommentsFromClient(
    setId: number,
    newComments: IComment[],
  ) {
    const set = await this.setsService.findOne(setId);
    const link = `
      <tr>
        <td style="padding: 20px" colspan="2">
          <a href="${this.APP_URL}" target="_blank" 
          style="color: #3bbfa1; font-size: 24px; font-weight: bold; text-decoration: none">Panel zestawień</a>
          </p>
        </td>
      </tr>`;

    const clientFullName = set.clientId.company
      ? set.clientId.company
      : `${set.clientId.firstName} ${set.clientId.lastName}`;

    return this.sendEmailAboutNewComments({
      setId,
      newComments,
      headerText: `Klient ${clientFullName} zakończył dodawanie`,
      link,
      recipient:
        process.env.GMAIL_USE === 'true'
          ? process.env.GMAIL_USER
          : process.env.EMAIL_USER,
    });
  }

  async create(emailLog: LogEmailDto): Promise<IEmailLog> {
    const newLog = this.emailRepo.create(emailLog);
    return this.emailRepo.save(newLog);
  }

  findAll(): Observable<ISendedEmailsFromDB[]> {
    const query = this.emailRepo
      .createQueryBuilder('email')
      .leftJoinAndSelect('email.clientId', 'client')
      .leftJoinAndSelect('email.supplierId', 'supplier')
      .leftJoinAndSelect('email.sendBy', 'user')
      .leftJoinAndSelect('email.setId', 'set')
      .select([
        'email.id',
        'email.link',
        'email.sendAt',
        'email.sendAtTimestamp',
        'client.id',
        'client.company',
        'client.email',
        'client.firstName',
        'client.lastName',
        'supplier.id',
        'supplier.company',
        'supplier.email',
        'supplier.firstName',
        'supplier.lastName',
        'user.id',
        'user.name',
        'set.id',
        'set.name',
      ])
      .orderBy('email.id', 'DESC');

    return from(query.getMany()).pipe(
      map((emails) =>
        emails.map((email) => ({
          id: email.id,
          link: email.link,
          sendAt: email.sendAt,
          sendAtTimestamp: email.sendAtTimestamp,
          set: {
            id: email.setId.id,
            name: email.setId.name,
          },
          client: email.clientId
            ? {
                id: email.clientId.id,
                company: email.clientId.company,
                email: email.clientId.email,
                firstName: email.clientId.firstName,
                lastName: email.clientId.lastName,
              }
            : undefined,
          supplier: email.supplierId
            ? {
                id: email.supplierId.id,
                company: email.supplierId.company,
                firstName: email.supplierId.firstName,
                lastName: email.supplierId.lastName,
                email: email.supplierId.email,
              }
            : undefined,
          sendBy: {
            id: email.sendBy.id,
            name: email.sendBy.name,
          },
        })),
      ),
    );
  }

  findOne(setId: number): Observable<ISendedEmailsFromDB[]> {
    const query = this.emailRepo
      .createQueryBuilder('email')
      .leftJoinAndSelect('email.clientId', 'client')
      .leftJoinAndSelect('email.supplierId', 'supplier')
      .leftJoinAndSelect('email.sendBy', 'user')
      .leftJoinAndSelect('email.setId', 'set')
      .select([
        'email.id',
        'email.link',
        'email.sendAt',
        'email.sendAtTimestamp',
        'client.id',
        'client.company',
        'client.email',
        'client.firstName',
        'client.lastName',
        'supplier.id',
        'supplier.company',
        'supplier.email',
        'supplier.firstName',
        'supplier.lastName',
        'user.id',
        'user.name',
        'set.id',
        'set.name',
      ])
      .where('email.setId.id = :setId', { setId: setId })
      .orderBy('email.id', 'DESC');

    return from(query.getMany()).pipe(
      map((emails) =>
        emails.map((email) => ({
          id: email.id,
          link: email.link,
          sendAt: email.sendAt,
          sendAtTimestamp: email.sendAtTimestamp,
          client: email.clientId
            ? {
                id: email.clientId.id,
                company: email.clientId.company,
                firstName: email.clientId.firstName,
                lastName: email.clientId.lastName,
                email: email.clientId.email,
              }
            : undefined,
          supplier: email.supplierId
            ? {
                id: email.supplierId.id,
                company: email.supplierId.company,
                firstName: email.supplierId.firstName,
                lastName: email.supplierId.lastName,
                email: email.supplierId.email,
              }
            : undefined,
          set: {
            id: email.setId.id,
            name: email.setId.name,
          },
          sendBy: {
            id: email.sendBy.id,
            name: email.sendBy.name,
          },
        })),
      ),
    );
  }
}
