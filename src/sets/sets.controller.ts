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
import { setsService } from './sets.service';

@Controller('sets')
export class SetsController {
  constructor(private setsService: setsService) {}

  @Get()
  findAll() {
    return this.setsService.findAll();
  }
}
