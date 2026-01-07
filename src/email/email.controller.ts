import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SendEmailDto } from './dto/email.dto';
import { EmailService } from './email.service';
import { ISendedEmailsFromDB } from './types/ISendedEmailsFromDB';

@UseGuards(JwtAuthGuard)
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  async sendEmail(@Body() body: SendEmailDto) {
    return this.emailService.sendEmail(body);
  }

  @Get()
  findAll(): Observable<ISendedEmailsFromDB[]> {
    return this.emailService.findAll();
  }

  @Get(':setId')
  findOne(@Param('setId') setId: string): Observable<ISendedEmailsFromDB[]> {
    return this.emailService.findOne(+setId);
  }
}
