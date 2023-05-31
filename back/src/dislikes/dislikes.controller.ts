import {
  Controller,
  Delete,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { DislikesService } from './dislikes.service';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';

@Controller('dislikes')
@UseGuards(JwtAuthGuard)
export class DislikesController {
  constructor(private readonly disLikesService: DislikesService) {}

  @Post(':videoId')
  async addDisLike(@Param('videoId') videoId: string, @Request() req) {
    //Service function to create a new dislike
    await this.disLikesService.addDisLike(videoId, req);
  }

  @Delete('/:videoId')
  async deleteDisLike(@Param('videoId') videoId: string, @Request() req) {
    //Service function to delete a dislike
    await this.disLikesService.deleteDisLike(videoId, req);
  }
}
