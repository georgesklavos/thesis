import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Videos } from 'src/schemas/videos.schema';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { JwtModule } from '@nestjs/jwt';
import { LikesModule } from 'src/likes/likes.module';
import { DislikesModule } from 'src/dislikes/dislikes.module';
import { Comments } from 'src/schemas/comments.schema';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';

//Module that defines controllers, models, services, exports
@Module({
  imports: [
    TypeOrmModule.forFeature([Videos, Comments]),
    JwtModule,
    LikesModule,
    DislikesModule,
    UsersModule,
  ],
  controllers: [VideosController],
  providers: [VideosService],
})
export class VideosModule {}
