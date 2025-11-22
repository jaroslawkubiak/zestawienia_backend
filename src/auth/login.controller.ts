import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { PasswordChange } from './dto/passwordChange.dto ';

@Controller('auth')
export class LoginController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const loggedUser = await this.authService.validateUser(loginDto);

    res.cookie('jwt', loggedUser.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return loggedUser;
  }

  @Post('passwordChange')
  async passwordChange(@Body() newPasswords: PasswordChange) {
    return this.authService.changeUserPassword(newPasswords);
  }

  @Get('me')
  async me(@Req() req) {
    const token = req.cookies['jwt'];
    if (!token) throw new UnauthorizedException();

    return this.authService.getUserFromToken(token);
  }
}
