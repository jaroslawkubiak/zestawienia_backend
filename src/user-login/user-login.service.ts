import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { getClientIp } from './getClientIp';
import { UserLogin } from './user-login.entity';

@Injectable()
export class UserLoginService {
  constructor(
    @InjectRepository(UserLogin)
    private readonly userLoginRepo: Repository<UserLogin>,
  ) {}

  createLoginEntry(
    user: User | string,
    req: Request,
    success: boolean,
    token: string,
    reason: string | null,
  ) {
    const isString = typeof user === 'string';

    this.userLoginRepo.save({
      login: isString ? user : user.name,
      success,
      user: isString ? null : user,
      token,
      reason,
      ip_address: getClientIp(req),
      user_agent: req.headers['user-agent'] ?? null,
    });
  }

  async setLogoutTimestamp(token: string): Promise<void> {
    await this.userLoginRepo.update({ token }, { logout_at: new Date() });
  }
}
