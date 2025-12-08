import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SetsModule } from '../sets/sets.module';
import { ClientLogs } from './client-logs.entity';
import { ClientLogsService } from './client-logs.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientLogs]),
    forwardRef(() => SetsModule),
  ],
  providers: [ClientLogsService],
  exports: [ClientLogsService],
})
export class ClientLogsModule {}
