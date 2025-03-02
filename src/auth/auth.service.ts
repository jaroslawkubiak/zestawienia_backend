import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { Admin } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Admin) private readonly userRepository: Repository<Admin>,
  ) {}

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async validateUser(loginDto: LoginDto) {
    const { username, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { username } });

    const passwordMatched = await this.comparePassword(password, user.password);

    if (!user || !passwordMatched) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return { access_token: this.jwtService.sign({ username }) };
  }

  // dev use only
  // const hashPassword = await this.hashPassword(password);
  // console.log(hashPassword);
  // async hashPassword(password: string): Promise<string> {
  //   const saltRounds = 10; // Ilość rund saltowania
  //   return bcrypt.hash(password, saltRounds);
  // }
}
