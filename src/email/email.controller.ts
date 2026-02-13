import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SendEmailDto } from './dto/email.dto';
import { EmailService } from './email.service';
import { IEmailPreviewDetails } from './types/IEmailPreviewDetails';
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

  @Post('preview')
  renderPreview(@Body() body: IEmailPreviewDetails): { html: string } {
    return this.emailService.renderPreview(body);
  }
}
