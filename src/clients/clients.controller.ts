import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ClientsService } from './clients.service';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';
import { IClient } from './types/IClient';

@UseGuards(JwtAuthGuard)
@Controller('clients')
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @Get()
  findAll() {
    return this.clientsService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
    @Req() req: Request,
  ): Promise<IClient> {
    return this.clientsService.update(+id, updateClientDto, req);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<IClient> {
    return this.clientsService.findOne(+id);
  }

  @Post()
  create(@Body() createClientDto: CreateClientDto): Promise<IClient> {
    return this.clientsService.create(createClientDto);
  }

  @Delete('')
  remove(@Body() body: { ids: number[] }) {
    body.ids.forEach((id) => {
      return this.clientsService.remove(+id);
    });
  }
}
