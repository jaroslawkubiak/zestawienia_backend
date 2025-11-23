import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { LoginDto } from './dto/login.dto';
import { PasswordChange } from './dto/passwordChange.dto ';
import { ILoggedUser } from './types/ILoggedUser';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async validateUser(loginDto: LoginDto): Promise<ILoggedUser> {
    const { username, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      throw new UnauthorizedException('Użytkownik nie istnieje');
    }

    const passwordMatched = await this.comparePassword(password, user.password);

    if (!user || !passwordMatched) {
      throw new UnauthorizedException('Nieprawidłowe dane');
    }

    const loggedUser: ILoggedUser = {
      accessToken: this.jwtService.sign({ username }),
      name: user.name,
      id: user.id,
      role: user.role,
    };

    return loggedUser;
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
