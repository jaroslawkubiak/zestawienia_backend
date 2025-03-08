import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { IClient } from './types/IClient';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';

// TODO remove this
// @UseGuards(JwtAuthGuard)
@Controller('clients')
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @Get()
  findAll() {
    return this.clientsService.findAll();
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
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

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Body() createClientDto: CreateClientDto): Promise<IClient> {
    return this.clientsService.create(createClientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.clientsService.remove(+id);
  }
}
