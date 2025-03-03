import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { LoginController } from './auth/login.controller';
import { AuthModule } from './auth/auth.module';
import { ZestawienieModule } from './zestawienie/zestawienie.module';
import { ProduktyModule } from './produkty/produkty.module';
import { DostawcyModule } from './dostawcy/dostawcy.module';
import { KlienciModule } from './klienci/klienci.module';
import { KomentarzeModule } from './komentarze/komentarze.module';
import { PraceDoWykonaniaModule } from './prace_do_wykonania/prace_do_wykonania.module';
import { PozycjeModule } from './pozycje/pozycje.module';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { Zestawienie } from './zestawienie/zestawienie.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dostawca } from './dostawcy/dostawcy.entity';
import { Klient } from './klienci/klienci.entity';
import { Komentarze } from './komentarze/komentarze.entity';
import { Pozycje } from './pozycje/pozycje.entity';
import { PraceDoWykonania } from './prace_do_wykonania/prace_do_wykonania.entity';
import { Produkt } from './produkty/produkty.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [
          User,
          Zestawienie,
          Dostawca,
          Klient,
          Komentarze,
          Pozycje,
          PraceDoWykonania,
          Produkt,
        ],
        synchronize: true,
      }),
    }),
    AuthModule,
    ZestawienieModule,
    ProduktyModule,
    DostawcyModule,
    KlienciModule,
    KomentarzeModule,
    PraceDoWykonaniaModule,
    PozycjeModule,
    UserModule,
  ],
  controllers: [AppController, LoginController],
  providers: [AppService],
})
export class AppModule {}
