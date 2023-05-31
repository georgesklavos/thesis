import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { CreateCommentDTO } from 'src/dtos/comment.dto';
import { Comments } from 'src/schemas/comments.schema';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private readonly CommentsRepository: Repository<Comments>,
  ) {}

  //Function to create a new comment
  async addComment(videoId: string, req: Request, body: CreateCommentDTO) {
    const like = await this.CommentsRepository.create({
      user: req.user.id,
      video: videoId,
      comment: body.comment,
    });

    await this.CommentsRepository.save(like);
  }

  //Function to edit a comment
  async editComment(id: string, req: Request, text: string) {
    return this.CommentsRepository.update(
      {
        id,
        user: req.user.id,
      },
      { comment: text },
    );
  }

  //Function to delete a comment
  async removeComment(commentId: string, req: Request) {
    await this.CommentsRepository.delete({
      user: req.user.id,
      comment: commentId,
    });
  }
}
