import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Likes } from 'src/schemas/likes.schema';
import { Repository } from 'typeorm';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Likes)
    private readonly LikesRepository: Repository<Likes>,
  ) {}

  //Function to add a like
  async addLike(videoId: string, req: Request) {
    const like = await this.LikesRepository.create({
      user: req.user.id,
      video: videoId,
    });

    await this.LikesRepository.save(like);
  }

  //Function to delete a like
  async deleteLike(videoId: string, req: Request) {
    await this.LikesRepository.delete({
      user: req.user.id,
      video: videoId,
    });
  }

  //Function to check if a like exists
  async likeExists(videoId: string, userId: string): Promise<boolean> {
    const liked = await this.LikesRepository.findOne({
      where: {
        user: userId,
        video: videoId,
      },
    });

    return liked != null;
  }
}
