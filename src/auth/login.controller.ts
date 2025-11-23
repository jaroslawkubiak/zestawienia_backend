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
    @Res({ passthrough: true }) res: Response,
  ) {
    const loggedUser = await this.authService.validateUser(loginDto);

    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';

    res.cookie('jwt', loggedUser.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return loggedUser;
  }

  @Post('passwordChange')
  async passwordChange(@Body() newPasswords: PasswordChange) {
    return this.authService.changeUserPassword(newPasswords);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req) {
    console.log(`\n######## GET /auth/me #########`);
    console.log(`Raw headers: ${JSON.stringify(req.headers)}`);
    console.log(`req.cookies: ${JSON.stringify(req.cookies)}`);
    console.log(`req.user (from JwtAuthGuard): ${JSON.stringify(req.user)}`);

    const token = req.cookies?.jwt;
    console.log(`Token from cookies: ${token ? 'FOUND' : 'NOT FOUND'}`);

    if (!token) {
      console.log(`THROWING UNAUTHORIZED - no token found`);
      throw new UnauthorizedException();
    }

    return this.authService.getUserFromToken(token);
  }
}
