import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { getClientIp } from '../helpers/getClientIp';
import { getFormatedDate } from '../helpers/getFormatedDate';
import { User } from '../user/user.entity';
import { IUserLogs } from './types/IUserLogs';
import { UserLogs } from './user-logs.entity';

@Injectable()
export class UserLogsService {
  constructor(
    @InjectRepository(UserLogs)
    private readonly userLogsRepo: Repository<UserLogs>,
  ) {}

  createLoginEntry(
    user: User | string,
    req: Request,
    success: boolean,
    token: string,
    reject_reason: string | null,
  ) {
    const isString = typeof user === 'string';

    const createEnry: IUserLogs = {
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

    this.userLogsRepo.save(createEnry);
  }

  async setLogoutTimestamp(token: string): Promise<void> {
    await this.userLogsRepo.update(
      { token },
      { logout_at: getFormatedDate(), logout_at_timestamp: Number(Date.now()) },
    );
  }
}
