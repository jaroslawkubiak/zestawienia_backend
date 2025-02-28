import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // test route
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('/protect')
  getProtected(): string {
    return this.appService.getProtected();
  }
}
