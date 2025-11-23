import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Setting } from './settings.entity';
import { SettingsService } from './settings.service';

@UseGuards(JwtAuthGuard)
@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}
  @Get()
  findAll(): Promise<Setting[]> {
    return this.settingsService.findAll();
  }

  @Get(':type')
  getByType(@Param('type') type: string): Promise<Setting> {
    return this.settingsService.getByType(type);
  }
}
