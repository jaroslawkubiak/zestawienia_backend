import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SendEmailDto } from './dto/email.dto';
import { Email } from './email.entity';
import { EmailService } from './email.service';
import { IEmailsList } from './types/IEmailsList';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  async sendEmail(@Body() body: SendEmailDto) {
    return this.emailService.sendEmail(body);
  }

  @Get()
  findAll() {
    return this.emailService.findAll();
  }

  @Get(':setId')
  findOne(@Param('setId') setId: string): Observable<IEmailsList[]> {
    return this.emailService.findOne(+setId);
  }
}
