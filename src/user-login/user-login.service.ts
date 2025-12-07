import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { getClientIp } from '../helpers/getClientIp';
import { getFormatedDate } from '../helpers/getFormatedDate';
import { User } from '../user/user.entity';
import { IUserLogin } from './types/IUserLogin';
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
    reject_reason: string | null,
  ) {
    const isString = typeof user === 'string';

    const createEnry: IUserLogin = {
      login: isString ? user : user.username,
      success,
      user: isString ? null : user,
      token,
      reject_reason,
      ip_address: getClientIp(req),
      user_agent: req.headers['user-agent'] ?? null,
      login_at: getFormatedDate(),
      login_at_timestamp: Number(Date.now()),
    };

    this.userLoginRepo.save(createEnry);
  }

  async setLogoutTimestamp(token: string): Promise<void> {
    await this.userLoginRepo.update(
      { token },
      { logout_at: getFormatedDate(), logout_at_timestamp: Number(Date.now()) },
    );
  }
}
