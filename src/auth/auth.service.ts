import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { User } from '../user/user.entity';
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
    };

    return loggedUser;
  }

  // dev use only
  // const hashPassword = await this.hashPassword(password);
  // console.log(hashPassword);
  // async hashPassword(password: string): Promise<string> {
  //   const saltRounds = 10; // Ilość rund saltowania
  //   return bcrypt.hash(password, saltRounds);
  // }
}
