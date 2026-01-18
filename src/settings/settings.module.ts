import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorsModule } from '../errors/errors.module';
import { SettingsController } from './settings.controller';
import { Setting } from './settings.entity';
import { SettingsService } from './settings.service';

@Module({
  imports: [TypeOrmModule.forFeature([Setting]), ErrorsModule],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
