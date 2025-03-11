import { Module } from '@nestjs/common';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Set } from '../sets/sets.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Set])],
})
export class UserModule {}
