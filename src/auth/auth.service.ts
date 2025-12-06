import { Injectable, Request, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserLoginService } from '../user-login/user-login.service';
import { User } from '../user/user.entity';
import { LoginDto } from './dto/login.dto';
import { PasswordChange } from './dto/passwordChange.dto ';
import { ILoggedUser } from './types/ILoggedUser';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userLoginService: UserLoginService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async validateUser(loginDto: LoginDto, @Request() req): Promise<ILoggedUser> {
    const { username, password } = loginDto;
    const accessToken = this.jwtService.sign({ username });

    const user = await this.userRepository.findOne({ where: { username } });

    // No user
    if (!user) {
      await this.userLoginService.createLoginEntry(
        username,
        req,
        false,
        accessToken,
        'user not found',
      );

      throw new UnauthorizedException('Użytkownik nie istnieje');
    }

    const passwordMatched = await this.comparePassword(password, user.password);

    // passwords don't matched
    if (!passwordMatched) {
      await this.userLoginService.createLoginEntry(
        user,
        req,
        false,
        accessToken,
        'password not matched',
      );

      throw new UnauthorizedException('Nieprawidłowe dane');
    }

    // login success
    await this.userLoginService.createLoginEntry(
      user,
      req,
      true,
      accessToken,
      null,
    );

    return {
      accessToken,
      name: user.name,
      id: user.id,
      role: user.role,
    };
  }

  async changeUserPassword(newPasswords: PasswordChange) {
    const { userId, currentPassword, newPassword } = newPasswords;

    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new UnauthorizedException('Użytkownik nie istnieje');
    }

    const passwordMatched = await this.comparePassword(
      currentPassword,
      user.password,
    );

    if (!passwordMatched) {
      throw new UnauthorizedException('Aktualne hasło nie jest poprawne');
    }

    const newHashPassword = await this.hashPassword(newPassword);
    const newUser = { ...user, password: newHashPassword };

    await this.userRepository.update(userId, newUser);

    return { message: 'Hasło zmieniono poprawnie' };
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // Ilość rund saltowania
    return bcrypt.hash(password, saltRounds);
  }

  async getUserFromToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userRepository.findOne({
        where: { username: payload.username },
      });
      if (!user) throw new UnauthorizedException();
      return {
        id: user.id,
        name: user.name,
        role: user.role,
        accessToken: this.jwtService.sign({ username: user.username }),
      };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
