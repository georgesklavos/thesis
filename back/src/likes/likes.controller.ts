import {
  Controller,
  Delete,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { LikesService } from './likes.service';

@Controller('likes')
@UseGuards(JwtAuthGuard)
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post(':videoId')
  async addLike(@Param('videoId') videoId: string, @Request() req) {
    //Service function to create a like
    await this.likesService.addLike(videoId, req);
  }

  @Delete('/:videoId')
  async deleteLike(@Param('videoId') videoId: string, @Request() req) {
    //Service function to delete a like
    await this.likesService.deleteLike(videoId, req);
  }
}
