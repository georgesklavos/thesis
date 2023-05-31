import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Likes } from 'src/schemas/likes.schema';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';

//Module that defines controllers, models, services, exports
@Module({
  imports: [TypeOrmModule.forFeature([Likes])],
  controllers: [LikesController],
  providers: [LikesService],
  exports: [LikesService],
})
export class LikesModule {}
