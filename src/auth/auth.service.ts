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
      throw new UnauthorizedException("User don't exists");
    }

    const passwordMatched = await this.comparePassword(password, user.password);

    if (!user || !passwordMatched) {
      throw new UnauthorizedException('Invalid credentials');
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
      throw new UnauthorizedException("User don't exists");
    }

    const passwordMatched = await this.comparePassword(
      currentPassword,
      user.password,
    );

    if (!passwordMatched) {
      throw new UnauthorizedException('Old password is wrong');
    }

    const newHashPassword = await this.hashPassword(newPassword);
    const newUser = { ...user, password: newHashPassword };

    await this.userRepository.update(userId, newUser);

    return 'Password changed succesfully';
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // Ilość rund saltowania
    return bcrypt.hash(password, saltRounds);
  }
}
