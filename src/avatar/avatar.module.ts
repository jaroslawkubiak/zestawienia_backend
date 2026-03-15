import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '../clients/clients.entity';
import { ClientsModule } from '../clients/clients.module';
import { ErrorsModule } from '../errors/errors.module';
import { AvatarController } from './avatar.controller';
import { Avatar } from './avatar.entity';
import { AvatarService } from './avatar.service';

@Module({
  imports: [TypeOrmModule.forFeature([Avatar, Client]), ErrorsModule, ClientsModule],
  controllers: [AvatarController],
  providers: [AvatarService],
  exports: [AvatarService],
})
export class AvatarModule {}
