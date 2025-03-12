import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SettingsService } from '../settings/settings.service';
import { NewSetDto } from './dto/NewSet.dto';
import { SetsService } from './sets.service';
import { INewSet } from './types/INewSet';

//TODO add guards
// @UseGuards(JwtAuthGuard)
@Controller('sets')
export class SetsController {
  constructor(
    private setsService: SetsService,
    private settingsService: SettingsService,
  ) {}

  @Get()
  findAll() {
    return this.setsService.findAll();
  }

  @Post('new')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Body() newSet: NewSetDto): Promise<INewSet> {
    const res = await this.setsService.create(newSet);
    if (res.id) {
      this.settingsService.increaseSetNumber();
    }
    return res;
  }
}
