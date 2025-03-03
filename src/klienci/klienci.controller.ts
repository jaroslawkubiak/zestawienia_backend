import { Controller, Get, UseGuards } from '@nestjs/common';
import { KlienciService } from './klienci.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

// TODO remove this
// @UseGuards(JwtAuthGuard)
@Controller('klienci')
export class KlienciController {
  constructor(private clientService: KlienciService) {}

 
  @Get()
  getClients() {
    return this.clientService.getClients();
  }
}
