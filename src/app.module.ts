import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LoginController } from './auth/login.controller';
import { Bookmark } from './bookmarks/bookmarks.entity';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { Client } from './clients/clients.entity';
import { ClientsModule } from './clients/clients.module';
import { Comment } from './comments/comments.entity';
import { CommentsModule } from './comments/comments.module';
import { Email } from './email/email.entity';
import { EmailModule } from './email/email.module';
import { Errors } from './errors/errors.entity';
import { ErrorsModule } from './errors/errors.module';
import { FilesController } from './files/files.controller';
import { Files } from './files/files.entity';
import { FilesModule } from './files/files.module';
import { ImagesController } from './images/images.controller';
import { ImagesModule } from './images/images.module';
import { ImagesService } from './images/images.service';
import { Position } from './position/positions.entity';
import { PositionsModule } from './position/positions.module';
import { Set } from './sets/sets.entity';
import { SetsModule } from './sets/sets.module';
import { Setting } from './settings/settings.entity';
import { SettingsModule } from './settings/settings.module';
import { Supplier } from './suppliers/suppliers.entity';
import { SuppliersModule } from './suppliers/suppliers.module';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';

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
          Set,
          Supplier,
          Client,
          Comment,
          Position,
          Bookmark,
          Setting,
          Errors,
          Email,
          Files,
        ],
        // logging: ['query', 'error'],
        // logger: 'advanced-console',
        synchronize:
          configService.get<string>('TYPEORM_SYNCHRONIZE') === 'true',
      }),
    }),
    AuthModule,
    SetsModule,
    SuppliersModule,
    ClientsModule,
    CommentsModule,
    PositionsModule,
    UserModule,
    BookmarksModule,
    SettingsModule,
    ErrorsModule,
    ImagesModule,
    EmailModule,
    FilesModule,
  ],
  controllers: [
    AppController,
    LoginController,
    ImagesController,
    FilesController,
  ],
  providers: [AppService, ImagesService],
})
export class AppModule {}
