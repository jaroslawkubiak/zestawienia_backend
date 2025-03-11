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
import { SetsService } from './sets.service';
import { NewSetDto } from './dto/NewSet.dto';
import { INewSet } from './types/INewSet';

@Controller('sets')
export class SetsController {
  constructor(private setsService: SetsService) {}

  @Get()
  findAll() {
    return this.setsService.findAll();
  }

  @Post('new')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Body() newSet: NewSetDto): Promise<INewSet> {
    return this.setsService.create(newSet);
  }
}
