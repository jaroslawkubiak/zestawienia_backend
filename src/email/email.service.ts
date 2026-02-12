import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
import { firstValueFrom, from, map, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { CommentNotificationLogsService } from '../comment-notification-logs/comment-notification-logs.service';
import { CommentNotificationDto } from '../comment-notification-logs/types/commentNotification.dto';
import { TAuthorType } from '../comments/types/authorType.type';
import { IComment } from '../comments/types/IComment';
import { ErrorDto } from '../errors/dto/error.dto';
import { ErrorsService } from '../errors/errors.service';
import { ErrorsType } from '../errors/types/Errors';
import { extractBodyContent } from '../helpers/extractBodyContent';
import { getFormatedDate } from '../helpers/getFormatedDate';
import { minifyHtml } from '../helpers/minifyHtml';
import { ENotificationDirection } from '../notification-timer/types/notification-direction.enum';
import { PositionsService } from '../position/positions.service';
import { IPosition } from '../position/types/IPosition';
import { SetsService } from '../sets/sets.service';
import { SettingsService } from '../settings/settings.service';
import { CreateIdDto } from '../shared/dto/createId.dto';
import { LogEmailDto } from './dto/logEmail.dto';
import { Email } from './email.entity';
import { saveToSentFolder } from './emailSendCopy';
import { EmailAudience } from './types/EmailAudience.type';
import { ICommentForEmail } from './types/ICommentForEmail';
import { IEmailCommentsNotificationPayload } from './types/IEmailCommentsNotificationPayload';
import { IEmailDetails } from './types/IEmailDetails';
import { IEmailPreviewDetails } from './types/IEmailPreviewDetails';
import { IEmailPreviewFullPayload } from './types/IEmailPreviewFullPayload';
import { ISendedEmailsFromDB } from './types/ISendedEmailsFromDB';
import { ISendEmailAboutNewComments } from './types/ISendEmailAboutNewComments';

@Injectable()
export class EmailService {
  private transporter;
  private APP_URL = 'https://zestawienia.zurawickidesign.pl';
  private GDPRClause: string;
  private ASSETS_URL = 'https://zestawienia.zurawickidesign.pl/assets/images';
  private socialColor: 'accent' | 'black' = 'accent';
  private currentYear = new Date().getFullYear();
  templatePath = path.join(__dirname, 'templates/main.hbs');
  source = fs.readFileSync(this.templatePath, 'utf8');
  template = handlebars.compile(this.source);

  constructor(
    @InjectRepository(Email)
    private readonly emailRepository: Repository<Email>,
    private readonly errorsService: ErrorsService,
    private readonly settingsService: SettingsService,

    @Inject(forwardRef(() => SetsService))
    private readonly setsService: SetsService,

    @Inject(forwardRef(() => PositionsService))
    private readonly positionService: PositionsService,
    private commentNotificationLogsService: CommentNotificationLogsService,
  ) {
    // handlebars setup
    const templatesDir = path.join(__dirname, 'templates');
    const partialsDir = path.join(templatesDir, 'partials');

    const partialFiles = fs.readdirSync(partialsDir);

    partialFiles.forEach((file) => {
      const partialPath = path.join(partialsDir, file);
      const partialName = file.replace('.hbs', '');
      const partialContent = fs.readFileSync(partialPath, 'utf8');

      handlebars.registerPartial(partialName, partialContent);
    });

    const mainPath = path.join(templatesDir, 'main.hbs');
    const source = fs.readFileSync(mainPath, 'utf8');
    this.template = handlebars.compile(source);

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
  }

  async onModuleInit() {
    const gdpr = await this.settingsService.getSettingByName('GDPRClause');
    this.GDPRClause = gdpr.value;
  }

  renderPreview(body: IEmailPreviewDetails): { html: string } {
    const { type, payload } = body;

    const partialMap = {
      clientWelcome: 'clientWelcomeContent',
      clientInfo: 'clientInfoContent',
      supplierOffer: 'supplierOfferContent',
      supplierOrder: 'supplierOrderContent',
    };

    const contentPartial = partialMap[type];

    if (!contentPartial) {
      throw new Error('Unknown template type');
    }

    const fullPayload: IEmailPreviewFullPayload = {
      ...payload,
      contentPartial,
      ASSETS_URL: this.ASSETS_URL,
      socialColor: this.socialColor,
      currentYear: new Date().getFullYear(),
      GDPRClause: this.GDPRClause,
    };

    const html = this.template(fullPayload);

    return { html };
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

        await this.createEmailLog(newEmailLog);

        // send copy email do Sent folder
        await saveToSentFolder(mailOptions);
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

  private async sendEmailAboutNewComments(options: ISendEmailAboutNewComments) {
    const {
      setId,
      newComments,
      needsAttentionComments,
      headerText,
      recipient,
      commentAuthorType,
    } = options;
    // get set and positions
    const set = await this.setsService.findOneSet(setId);
    const positions = await firstValueFrom(
      this.positionService.getPositions(setId, commentAuthorType),
    );

    // match comments with positions
    const newCommentsList = matchCommentToPosition(newComments, positions);
    const needsAttentionCommentsList = matchCommentToPosition(
      needsAttentionComments,
      positions,
    );

    const HTMLheader = 'Nowe komentarze';
    const HTMLContent = `${headerText} ${newComments.length} ${newComments.length === 1 ? ' komentarza' : ' komentarzy'} do Twojej inwestycji: <strong>${set.name}</strong>`;
    const needsAttentionHeader = `Masz także ${needsAttentionCommentsList.length} ${createHeaderNeedsAttentionComments(
      needsAttentionCommentsList.length,
    )}`;
    const linkToSet = this.createExternalLink(
      'client',
      set.hash,
      set.clientId.hash,
    );

    const { ASSETS_URL, socialColor, currentYear, GDPRClause } = this;

    const fullPayload: IEmailCommentsNotificationPayload = {
      HTMLheader,
      linkToSet,
      HTMLContent,
      newCommentsList,
      needsAttentionCommentsList,
      needsAttentionHeader,
      contentPartial: 'commentNotificationContent',
      ASSETS_URL,
      socialColor,
      currentYear,
      GDPRClause,
    };

    const html = this.template(fullPayload);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipient,
      subject: `Nowe komentarze w inwestycji: ${set.name}`,
      html,
    };

    const info = await this.transporter.sendMail(mailOptions);

    if (info.response.includes('OK')) {
      const notificationDirection: ENotificationDirection =
        commentAuthorType === 'client'
          ? ENotificationDirection.CLIENT_TO_OFFICE
          : ENotificationDirection.OFFICE_TO_CLIENT;

      // log email in DB comment-nofitication-logs
      const newCommentNotificationLog: CommentNotificationDto = {
        to: mailOptions.to,
        notificationDirection: notificationDirection,
        content: mailOptions.html,
        unreadComments: newComments.length,
        needsAttentionComments: needsAttentionCommentsList.length,
        sendAt: getFormatedDate(),
        sendAtTimestamp: Number(Date.now()),
        setId: setId,
        clientId: set.clientId.id,
      };

      await this.createCommentNotificationLog(newCommentNotificationLog);
    }
  }

  async sendEmailAboutNewCommentsFromOffice(
    setId: number,
    newComments: IComment[],
    needsAttentionComments: IComment[],
  ) {
    const set = await this.setsService.findOneSet(setId);
    const commentAuthorType: TAuthorType = 'user';

    const options: ISendEmailAboutNewComments = {
      setId,
      newComments,
      needsAttentionComments,
      headerText: `Biuro Żurawicki Design zakończyło dodawanie`,
      recipient: set.clientId.email,
      commentAuthorType,
    };

    return this.sendEmailAboutNewComments(options);
  }

  async sendEmailAboutNewCommentsFromClient(
    setId: number,
    newComments: IComment[],
    needsAttentionComments: IComment[],
  ) {
    const set = await this.setsService.findOneSet(setId);
    const commentAuthorType: TAuthorType = 'client';

    const clientFullName = set.clientId.company
      ? set.clientId.company
      : `${set.clientId.firstName} ${set.clientId.lastName}`;

    const options: ISendEmailAboutNewComments = {
      setId,
      newComments,
      needsAttentionComments,
      headerText: `Klient ${clientFullName} zakończył dodawanie`,
      recipient: process.env.EMAIL_USER,
      commentAuthorType,
    };

    return this.sendEmailAboutNewComments(options);
  }

  async createEmailLog(emailLog: LogEmailDto): Promise<Email> {
    // clean html content - leave only inside <body>, remove tabs, new lines
    const bodyOnly = extractBodyContent(emailLog.content);
    const cleanedHtmlContent = minifyHtml(bodyOnly);

    const newLog = this.emailRepository.create({
      ...emailLog,
      content: cleanedHtmlContent,
    });

    return this.emailRepository.save(newLog);
  }

  async createCommentNotificationLog(
    commentNotificationLog: CommentNotificationDto,
  ): Promise<void> {
    await this.commentNotificationLogsService.saveLog(commentNotificationLog);
  }

  findAllEmails(): Observable<ISendedEmailsFromDB[]> {
    const query = this.emailRepository
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
        'email.content',
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
          content: email.content,
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

  findOneEmail(setId: number): Observable<ISendedEmailsFromDB[]> {
    const query = this.emailRepository
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
          content: email.content,
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

  createExternalLink(
    type: EmailAudience,
    setHash: string,
    hash: string,
  ): string {
    return `${this.APP_URL}/open-for-${type}/${setHash}/${hash}`;
  }
}

function createHeaderNeedsAttentionComments(count: number): string {
  if (count === 1) return 'komentarz oznaczony jako ważny';
  if (count >= 2 && count <= 4) return 'komentarze oznaczone jako ważne';
  return 'komentarzy oznaczonych jako ważne';
}

function matchCommentToPosition(
  newComments: IComment[],
  positions: IPosition[],
): ICommentForEmail[] {
  return newComments.map((comment) => {
    if (!comment.positionId) return;

    const position = positions.find((item) => item.id === comment.positionId);

    return {
      product: position?.produkt || '',
      comment: comment.comment,
      createdAt: comment.createdAt,
    };
  });
}
