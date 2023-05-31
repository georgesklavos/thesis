import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { CreateCommentDTO } from 'src/dtos/comment.dto';
import { CommentsService } from './comments.service';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':videoId')
  async addComment(
    @Param('videoId') videoId: string,
    @Request() req,
    @Body() body: CreateCommentDTO,
  ) {
    //Service function to create a comment
    await this.commentsService.addComment(videoId, req, body);
  }

  @Delete(':commentId')
  async removeComment(@Param('commentId') commentId: string, @Request() req) {
    //Service function to delete a comment
    await this.commentsService.removeComment(commentId, req);
  }
}
