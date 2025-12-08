import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { Bookmark } from './bookmarks/bookmarks.entity';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { ClientLogs } from './client-logs/client-logs.entity';
import { ClientLogsModule } from './client-logs/client-logs.module';
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
import { HashModule } from './hash/hash.module';
import { ImagesController } from './images/images.controller';
import { ImagesModule } from './images/images.module';
import { ImagesService } from './images/images.service';
import { Position } from './position/positions.entity';
import { PositionsModule } from './position/positions.module';
import { Set } from './sets/sets.entity';
import { SetsModule } from './sets/sets.module';
import { Setting } from './settings/settings.entity';
import { SettingsModule } from './settings/settings.module';
import { SupplierLogs } from './supplier-logs/supplier-logs.entity';
import { SupplierLogsModule } from './supplier-logs/supplier-logs.module';
import { Supplier } from './suppliers/suppliers.entity';
import { SuppliersModule } from './suppliers/suppliers.module';
import { UserLogs } from './user-logs/user-logs.entity';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';

if (!(global as any).crypto) {
  (global as any).crypto = crypto;
}
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: {
        setHeaders: (res, filePath) => {
          // Automatyczne ustawienie Content-Type
          const mime = require('mime-types');
          const type = mime.lookup(filePath);
          if (type) res.setHeader('Content-Type', type);
        },
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'mysql',
          host: config.get<string>('APP_DB_HOST'),
          port: Number(config.get('APP_DB_PORT')),
          username: config.get<string>('APP_DB_USER'),
          password: config.get<string>('APP_DB_PASSWORD'),
          database: config.get<string>('APP_DB_NAME'),
          entities: [
            Bookmark,
            ClientLogs,
            Client,
            Comment,
            Email,
            Errors,
            Files,
            Position,
            Set,
            Setting,
            SupplierLogs,
            Supplier,
            UserLogs,
            User,
          ],
          synchronize: config.get<string>('TYPEORM_SYNCHRONIZE') === 'true',
        };
      },
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
    ClientLogsModule,
    SupplierLogsModule,
    HashModule,
  ],
  controllers: [AppController, ImagesController, FilesController],
  providers: [AppService, ImagesService],
})
export class AppModule {}
