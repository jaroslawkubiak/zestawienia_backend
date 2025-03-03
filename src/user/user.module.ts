import { Module } from '@nestjs/common';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Zestawienie } from 'src/zestawienie/zestawienie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Zestawienie])],
})
export class UserModule {}
