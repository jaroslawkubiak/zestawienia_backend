import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as nodemailer from 'nodemailer';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { ErrorDto } from '../errors/dto/error.dto';
import { ErrorsService } from '../errors/errors.service';
import { ErrorsType } from '../errors/types/Errors';
import { getFormatedDate } from '../helpers/getFormatedDate';
import { CreateIdDto } from '../shared/dto/createId.dto';
import { LogEmailDto } from './dto/logEmail.dto';
import { Email } from './email.entity';
import { IEmailDetails } from './types/IEmailDetails';
import { IEmailLog } from './types/IEmailLog';

@Injectable()
export class EmailService {
  private transporter;

  constructor(
    @InjectRepository(Email)
    private readonly emailRepo: Repository<Email>,
    private readonly errorsService: ErrorsService,
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
        'client.firma',
        'supplier.firma',
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
        'client.firma',
        'client.email',

        'supplier.id',
        'supplier.firma',
        'supplier.email',

        'user.id',
        'user.name',
      ])
      .where('email.setId.id = :setId', { setId: setId })
      .orderBy('email.id', 'DESC');

    return from(query.getMany());
  }
}
