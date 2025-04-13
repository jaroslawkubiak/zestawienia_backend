import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SendEmailDto } from './dto/email.dto';
import { Email } from './email.entity';
import { EmailService } from './email.service';
import { IEmailsToSet } from './types/IEmailsToSet';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  async sendEmail(@Body() body: SendEmailDto) {
    return this.emailService.sendEmail(body);
  }

  @Get()
  findAll(): Observable<IEmailsToSet[]> {
    return this.emailService.findAll();
  }

  @Get(':setId')
  findOne(@Param('setId') setId: string): Observable<IEmailsToSet[]> {
    return this.emailService.findOne(+setId);
  }
}
