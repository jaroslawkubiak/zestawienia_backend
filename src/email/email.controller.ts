import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SendEmailDto } from './dto/sendEmail.dto';
import { EmailService } from './email.service';
import { IEmailPreview } from './types/IEmailPreview';
import { IEmailPreviewDetails } from './types/IEmailPreviewDetails';
import { IEmailTemplateList } from './types/IEmailTemplateList';
import { ISendedEmailsFromDB } from './types/ISendedEmailsFromDB';

@UseGuards(JwtAuthGuard)
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  async sendEmail(@Body() body: SendEmailDto) {
    return this.emailService.sendEmail(body);
  }

  @Get('getEmails')
  findAllEmails(): Observable<ISendedEmailsFromDB[]> {
    return this.emailService.findAllEmails();
  }

  @Get(':setId/getEmailListForSet')
  getEmailListForSet(
    @Param('setId') setId: string,
  ): Observable<ISendedEmailsFromDB[]> {
    return this.emailService.getEmailListForSet(+setId);
  }

  @Post('getEmailPreview')
  getEmailPreview(@Body() body: IEmailPreviewDetails): Promise<IEmailPreview> {
    return this.emailService.getEmailPreview(body);
  }

  @Get('getEmailTemplatesList')
  getEmailTemplatesList(): IEmailTemplateList[] {
    return this.emailService.getEmailTemplatesList();
  }
}
