import { Controller, Get } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { Setting } from './settings.entity';

@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}
  @Get('number')
  getSetNumber() {
    return this.settingsService.getSetNumber();
  }

  @Get('number/increase')
  increaseSetNumber() {
    return this.settingsService.increaseSetNumber();
  }
}
