import { Controller, Get, Param } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { Setting } from './settings.entity';

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
