import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { UserLogsService } from '../user-logs/user-logs.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { PasswordChange } from './dto/passwordChange.dto ';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class LoginController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly userLogsService: UserLogsService,
  ) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const loggedUser = await this.authService.validateUser(loginDto, req);

    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';

    // Determine if cookie should be flagged secure — require HTTPS or forwarded proto
    const forwardedProto =
      (req.headers && (req.headers as any)['x-forwarded-proto']) || '';
    const requestIsSecure =
      Boolean((req as any).secure) || forwardedProto === 'https';
    const cookieSecure = isProduction && requestIsSecure;

    res.cookie('jwt', loggedUser.accessToken, {
      httpOnly: true,
      secure: cookieSecure,
      sameSite: cookieSecure ? 'none' : 'lax',
      maxAge: 60 * 60 * 1000, // 60 * 60 * 1000 = 1h
    });

    return loggedUser;
  }

  @Post('passwordChange')
  async passwordChange(@Body() newPasswords: PasswordChange) {
    return this.authService.changeUserPassword(newPasswords);
  }

  @Post('logout')
  async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies?.jwt;

    if (token) {
      await this.userLogsService.setLogoutTimestamp(token);
    }

    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';
    const forwardedProto =
      (req.headers && (req.headers as any)['x-forwarded-proto']) || '';
    const requestIsSecure =
      Boolean((req as any).secure) || forwardedProto === 'https';
    const cookieSecure = isProduction && requestIsSecure;

    res.cookie('jwt', '', {
      httpOnly: true,
      secure: cookieSecure,
      sameSite: cookieSecure ? 'none' : 'lax',
      maxAge: 0,
    });

    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: Request) {
    const token = req.cookies?.jwt;

    if (!token) {
      throw new UnauthorizedException();
    }

    return this.authService.getUserFromToken(token);
  }
}
