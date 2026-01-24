import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
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

  @Get(':name')
  getSettingByName(@Param('name') name: string): Promise<DbSettings> {
    return this.settingsService.getSettingByName(name);
  }

  @Post('/getSettingByNames')
  getSettingsByNames(@Body() names: string[]): Promise<DbSettings[]> {
    return this.settingsService.getSettingsByNames(names);
  }

  @Patch()
  async saveSettings(
    @Body() body: DbSettings[],
    @Req() req: Request,
  ): Promise<any> {
    return await this.settingsService.saveSettings(body, req);
  }
}
