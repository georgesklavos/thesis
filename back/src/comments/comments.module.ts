import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comments } from 'src/schemas/comments.schema';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

//Module that defines controllers, models, services
@Module({
  imports: [TypeOrmModule.forFeature([Comments])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
