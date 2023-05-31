import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Dislikes } from 'src/schemas/dislikes.schema';
import { Repository } from 'typeorm';

@Injectable()
export class DislikesService {
  constructor(
    @InjectRepository(Dislikes)
    private readonly DisLikesRepository: Repository<Dislikes>,
  ) {}

  //Function to add a dislike
  async addDisLike(videoId: string, req: Request) {
    const like = await this.DisLikesRepository.create({
      user: req.user.id,
      video: videoId,
    });

    await this.DisLikesRepository.save(like);
  }

  //Function to delete a dislike
  async deleteDisLike(videoId: string, req: Request) {
    await this.DisLikesRepository.delete({
      user: req.user.id,
      video: videoId,
    });
  }

  //Function to check if a dislike exists
  async disLikeExists(videoId: string, userId: string): Promise<boolean> {
    const disLiked = await this.DisLikesRepository.findOne({
      where: {
        user: userId,
        video: videoId,
      },
    });

    return disLiked != null;
  }
}
