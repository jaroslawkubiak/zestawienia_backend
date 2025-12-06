import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLogin } from './user-login.entity';
import { UserLoginService } from './user-login.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserLogin])],
  providers: [UserLoginService],
  exports: [UserLoginService],
})
export class UserLoginModule {}
