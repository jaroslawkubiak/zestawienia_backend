import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SetsModule } from '../sets/sets.module';
import { ClientLogin } from './client-login.entity';
import { ClientLoginService } from './client-login.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientLogin]),
    forwardRef(() => SetsModule),
  ],
  providers: [ClientLoginService],
  exports: [ClientLoginService],
})
export class ClientLoginModule {}
