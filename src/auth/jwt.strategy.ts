import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      // Czytaj JWT z cookies zamiast z Authorization header
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          console.log(`[JWT Extractor] Attempting to extract JWT from request`);

          // Najpierw spróbuj z Authorization header (dla kompatybilności)
          const bearerToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
          if (bearerToken) {
            console.log(`[JWT Extractor] Found token in Authorization header`);
            return bearerToken;
          }

          // Następnie spróbuj z cookies
          const cookieToken = req.cookies?.jwt;
          console.log(
            `[JWT Extractor] Cookies: ${JSON.stringify(req.cookies)}`,
          );
          console.log(
            `[JWT Extractor] Cookie JWT: ${cookieToken ? 'FOUND' : 'NOT FOUND'}`,
          );
          return cookieToken || null;
        },
      ]),
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
