import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LoginController } from './auth/login.controller';
import { Client } from './clients/clients.entity';
import { ClientsModule } from './clients/clients.module';
import { Komentarze } from './komentarze/komentarze.entity';
import { KomentarzeModule } from './komentarze/komentarze.module';
import { Pozycje } from './pozycje/pozycje.entity';
import { PozycjeModule } from './pozycje/pozycje.module';
import { PraceDoWykonania } from './prace_do_wykonania/prace_do_wykonania.entity';
import { PraceDoWykonaniaModule } from './prace_do_wykonania/prace_do_wykonania.module';
import { Produkt } from './produkty/produkty.entity';
import { ProduktyModule } from './produkty/produkty.module';
import { Supplier } from './suppliers/suppliers.entity';
import { SuppliersModule } from './suppliers/suppliers.module';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import { Zestawienie } from './zestawienie/zestawienie.entity';
import { ZestawienieModule } from './zestawienie/zestawienie.module';

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
          Supplier,
          Client,
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
    SuppliersModule,
    ClientsModule,
    KomentarzeModule,
    PraceDoWykonaniaModule,
    PozycjeModule,
    UserModule,
  ],
  controllers: [AppController, LoginController],
  providers: [AppService],
})
export class AppModule {}
