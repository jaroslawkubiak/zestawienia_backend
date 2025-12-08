import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLogs } from './user-logs.entity';
import { UserLogsService } from './user-logs.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserLogs])],
  providers: [UserLogsService],
  exports: [UserLogsService],
})
export class UserLogsModule {}
