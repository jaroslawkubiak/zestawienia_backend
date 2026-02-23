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
import { EmailTemplateDetailsList } from './EmailTemplateDetailsList';
import { saveToSentFolder } from './emailSendCopy';
import { TEmailAudience } from './types/EmailAudience.type';
import { ICommentForEmail } from './types/ICommentForEmail';
import { IEmailCommentsNotificationPayload } from './types/IEmailCommentsNotificationPayload';
import { IEmailPreview } from './types/IEmailPreview';
import { IEmailPreviewDetails } from './types/IEmailPreviewDetails';
import { IEmailPreviewFullPayload } from './types/IEmailPreviewFullPayload';
import { IEmailTemplateList } from './types/IEmailTemplateList';
import { ISendedEmailsFromDB } from './types/ISendedEmailsFromDB';
import { ISendEmailAboutNewComments } from './types/ISendEmailAboutNewComments';
import { ISendEmailDetails } from './types/ISendEmailDetails';

@Injectable()
export class EmailService {
  private transporter;
  private APP_URL = 'https://zestawienia.zurawickidesign.pl';
  private ASSETS_URL = 'https://zestawienia.zurawickidesign.pl/assets/images';
  private socialColor: 'accent' | 'black' = 'accent';
  private currentYear = new Date().getFullYear();
  private GDPRClause: string;
  private headerTemplate: handlebars.TemplateDelegate;
  private footerTemplate: handlebars.TemplateDelegate;
  private contentTemplates: Record<string, handlebars.TemplateDelegate> = {};

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
    this.initializeTemplates();
    this.initializeTransporter();
  }

  async onModuleInit() {
    const gdpr = await this.settingsService.getSettingByName('GDPRClause');
    this.GDPRClause = gdpr.value;
  }

  private initializeTemplates() {
    const templatesDir = path.join(__dirname, 'templates');
    const partialsDir = path.join(templatesDir, 'partials');

    const partialFiles = fs.readdirSync(partialsDir);

    partialFiles.forEach((file) => {
      const partialPath = path.join(partialsDir, file);
      const partialName = file.replace('.hbs', '');
      const partialContent = fs.readFileSync(partialPath, 'utf8');

      handlebars.registerPartial(partialName, partialContent);
    });

    const templateFiles = fs
      .readdirSync(templatesDir)
      .filter((file) => file.endsWith('.hbs'));

    templateFiles.forEach((file) => {
      const templatePath = path.join(templatesDir, file);
      const templateName = file.replace('.hbs', '');
      const templateSource = fs.readFileSync(templatePath, 'utf8');

      this.contentTemplates[templateName] = handlebars.compile(templateSource);
    });

    const headerSource = fs.readFileSync(
      path.join(partialsDir, 'header.hbs'),
      'utf8',
    );

    const footerSource = fs.readFileSync(
      path.join(partialsDir, 'footer.hbs'),
      'utf8',
    );

    this.headerTemplate = handlebars.compile(headerSource);
    this.footerTemplate = handlebars.compile(footerSource);
  }

  async getEmailPreview(body: IEmailPreviewDetails): Promise<IEmailPreview> {
    const { type, setId, audienceType, client } = body;

    const set = await this.setsService.findOneSet(setId);
    const setName = set.name;
    const createdAt = set.createdAt;
    const setHash = set.hash;
    const audienceHash = audienceType === 'client' ? set.clientId.hash : '';
    const linkToSet = this.createExternalLink(
      audienceType,
      setHash,
      audienceHash,
    );

    const emailDetails = EmailTemplateDetailsList[type];

    const emailSubject = emailDetails.emailSubject(setName, createdAt);
    const content = emailDetails.message({ client });

    if (!emailDetails) {
      throw new Error(`Unknown email template type: ${type}`);
    }

    const fullPayload: IEmailPreviewFullPayload = {
      HTMLContent: content.replace(/\n/g, '<br/>'),
      ASSETS_URL: this.ASSETS_URL,
      linkToSet,
      HTMLheader: emailDetails.HTMLHeader,
      socialColor: this.socialColor,
      currentYear: this.currentYear,
      GDPRClause: this.GDPRClause,
    };

    const header = this.headerTemplate(fullPayload);
    const footer = this.footerTemplate(fullPayload);

    return {
      header,
      content,
      emailSubject,
      linkToSet,
      footer,
    };
  }

  async sendEmail(emailDetails: ISendEmailDetails) {
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
      ASSETS_URL,
      socialColor,
      currentYear,
      GDPRClause,
    };
    const mainTemplate = this.contentTemplates['main'];

    const html = mainTemplate({
      ...fullPayload,
      contentPartial: 'commentNotificationContent',
    });

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
    const cleanedHtmlContent = minifyHtml(emailLog.content);

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
    const query = this.baseEmailQuery().orderBy('email.id', 'DESC');

    return from(query.getMany()).pipe(
      map((emails) => emails.map(this.mapEmailToDto)),
    );
  }

  getEmailListForSet(setId: number): Observable<ISendedEmailsFromDB[]> {
    const query = this.baseEmailQuery()
      .where('email.setId.id = :setId', { setId })
      .orderBy('email.id', 'DESC');

    return from(query.getMany()).pipe(
      map((emails) => emails.map(this.mapEmailToDto)),
    );
  }

  private baseEmailQuery() {
    return this.emailRepository
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
        'email.subject',
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
      ]);
  }

  private mapEmailToDto(email: Email): ISendedEmailsFromDB {
    return {
      id: email.id,
      link: email.link,
      sendAt: email.sendAt,
      sendAtTimestamp: email.sendAtTimestamp,
      content: email.content,
      subject: email.subject,
      set: email.setId
        ? {
            id: email.setId.id,
            name: email.setId.name,
          }
        : undefined,
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
            email: email.supplierId.email,
            firstName: email.supplierId.firstName,
            lastName: email.supplierId.lastName,
          }
        : undefined,
      sendBy: email.sendBy
        ? {
            id: email.sendBy.id,
            name: email.sendBy.name,
          }
        : undefined,
    };
  }

  createExternalLink(
    type: TEmailAudience,
    setHash: string,
    audienceHash: string,
  ): string {
    return `${this.APP_URL}/open-for-${type}/${setHash}/${audienceHash}`;
  }

  private initializeTransporter() {
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

  getEmailTemplatesList(): IEmailTemplateList[] {
    return Object.values(EmailTemplateDetailsList).map((template) => ({
      templateName: template.templateName,
      HTMLHeader: template.HTMLHeader,
      audience: template.audience,
    }));
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
