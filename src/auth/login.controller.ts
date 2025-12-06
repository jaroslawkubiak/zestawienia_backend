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
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { PasswordChange } from './dto/passwordChange.dto ';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class LoginController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
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

    res.cookie('jwt', loggedUser.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000, // 60 * 60 * 1000 = 1h
    });

    return loggedUser;
  }

  @Post('passwordChange')
  async passwordChange(@Body() newPasswords: PasswordChange) {
    return this.authService.changeUserPassword(newPasswords);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('jwt', '', {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'lax',
      maxAge: 0,
    });
    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req) {
    const token = req.cookies?.jwt;

    if (!token) {
      throw new UnauthorizedException();
    }

    return this.authService.getUserFromToken(token);
  }
}
