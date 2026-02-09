import { Module } from '@nestjs/common';
import { CommentsModule } from '../comments/comments.module';
import { SetsModule } from '../sets/sets.module';
import { ExternalController } from './external.controller';
import { ExternalService } from './external.service';

@Module({
  imports: [SetsModule, CommentsModule],
  providers: [ExternalService],
  controllers: [ExternalController],
  exports: [ExternalService],
})
export class ExternalModule {}
