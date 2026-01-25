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
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SetsService } from '../sets/sets.service';
import { IValidSetForSupplier } from '../sets/types/IValidSetForSupplier';
import { ClientsService } from './clients.service';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';
import { IClient } from './types/IClient';

@Controller('clients')
export class ClientsController {
  constructor(
    private clientsService: ClientsService,
    private setsService: SetsService,
  ) {}

  // external link for clients
  @Get(':setHash/:clientHash')
  validateSetAndHashForClient(
    @Param('setHash') setHash: string,
    @Param('clientHash') clientHash: string,
    @Req() req: Request,
  ): Observable<IValidSetForSupplier> {
    return this.setsService.validateSetAndHashForClient(
      setHash,
      clientHash,
      req,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('getClients')
  findAll() {
    return this.clientsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/saveClient')
  update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ): Promise<IClient> {
    return this.clientsService.update(+id, updateClientDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<IClient> {
    return this.clientsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('addClient')
  create(@Body() createClientDto: CreateClientDto): Promise<IClient> {
    return this.clientsService.create(createClientDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('deleteClient')
  remove(@Body() body: { ids: number[] }) {
    body.ids.forEach((id) => {
      return this.clientsService.remove(+id);
    });
  }
}
