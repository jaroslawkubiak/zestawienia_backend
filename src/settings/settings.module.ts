import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from '../email/email.module';
import { ErrorsModule } from '../errors/errors.module';
import { SettingsController } from './settings.controller';
import { Setting } from './settings.entity';
import { SettingsService } from './settings.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Setting]),
    ErrorsModule,
    forwardRef(() => EmailModule),
  ],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
