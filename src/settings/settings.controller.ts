import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SettingsService } from './settings.service';
import { DbSettings } from './types/IDbSettings';

@UseGuards(JwtAuthGuard)
@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}
  @Get()
  findAll(): Promise<DbSettings[]> {
    return this.settingsService.findAll();
  }

  @Get(':type')
  getByType(@Param('type') type: string): Promise<DbSettings> {
    return this.settingsService.getByType(type);
  }

  @Patch()
  async saveSettings(
    @Body() body: DbSettings[],
    @Req() req: Request,
  ): Promise<any> {
    return await this.settingsService.saveSettings(body, req);
  }
}
