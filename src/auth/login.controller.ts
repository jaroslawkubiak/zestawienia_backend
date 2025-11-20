import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { PasswordChange } from './dto/passwordChange.dto ';

@Controller('auth')
export class LoginController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.validateUser(loginDto);
  }

  @Post('passwordChange')
  async passwordChange(@Body() newPasswords: PasswordChange) {
    return this.authService.changeUserPassword(newPasswords);
  }
}
