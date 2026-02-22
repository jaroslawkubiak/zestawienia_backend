import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ClientsService } from './clients.service';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';
import { IClient } from './types/IClient';

@UseGuards(JwtAuthGuard)
@Controller('clients')
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @Get('getClients')
  getClients() {
    return this.clientsService.getClients();
  }

  @Patch(':id/saveClient')
  update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ): Promise<IClient> {
    return this.clientsService.update(+id, updateClientDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<IClient> {
    return this.clientsService.findOne(+id);
  }

  @Post('addClient')
  create(@Body() createClientDto: CreateClientDto): Promise<IClient> {
    return this.clientsService.create(createClientDto);
  }

  @Delete('deleteClient')
  remove(@Body() body: { ids: number[] }) {
    body.ids.forEach((id) => {
      return this.clientsService.remove(+id);
    });
  }
}
