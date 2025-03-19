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
import { Position } from './position/positions.entity';
import { PositionsModule } from './position/positions.module';
import { Product } from './products/products.entity';
import { ProductsModule } from './products/products.module';
import { Set } from './sets/sets.entity';
import { SetsModule } from './sets/sets.module';
import { Setting } from './settings/settings.entity';
import { SettingsModule } from './settings/settings.module';
import { Supplier } from './suppliers/suppliers.entity';
import { SuppliersModule } from './suppliers/suppliers.module';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import { ErrorsModule } from './errors/errors.module';
import { Errors } from './errors/errors.entity';
import { ImagesService } from './images/images.service';
import { ImagesController } from './images/images.controller';

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
          Product,
          Bookmark,
          Setting,
          Errors,
        ],
        synchronize:
          configService.get<string>('TYPEORM_SYNCHRONIZE') === 'true',
      }),
    }),
    AuthModule,
    SetsModule,
    ProductsModule,
    SuppliersModule,
    ClientsModule,
    CommentsModule,
    PositionsModule,
    UserModule,
    BookmarksModule,
    SettingsModule,
    ErrorsModule,
  ],
  controllers: [AppController, LoginController, ImagesController],
  providers: [AppService, ImagesService],
})
export class AppModule {}
