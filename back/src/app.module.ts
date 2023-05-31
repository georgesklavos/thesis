import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { Users } from './schemas/users.schema';
import { VideosModule } from './videos/videos.module';
import { Videos } from './schemas/videos.schema';
import { Likes } from './schemas/likes.schema';
import { Dislikes } from './schemas/dislikes.schema';
import { Comments } from './schemas/comments.schema';
import { LikesModule } from './likes/likes.module';
import { DislikesModule } from './dislikes/dislikes.module';
import { CommentsModule } from './comments/comments.module';

//Module that imports all the required modules
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'host.docker.internal',
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE_NAME,
      logging: true,
      synchronize: true,
      entities: [Users, Videos, Likes, Dislikes, Comments],
    }),
    UsersModule,
    AuthModule,
    VideosModule,
    LikesModule,
    DislikesModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
