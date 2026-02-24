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
  updateClient(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ): Promise<IClient> {
    return this.clientsService.updateClient(+id, updateClientDto);
  }

  @Post('addClient')
  addClient(@Body() createClientDto: CreateClientDto): Promise<IClient> {
    return this.clientsService.addClient(createClientDto);
  }

  @Delete('deleteClient')
  deleteClient(@Body() body: { ids: number[] }) {
    body.ids.forEach((id) => {
      return this.clientsService.deleteClient(+id);
    });
  }
}
