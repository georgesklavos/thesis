import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { CreateVideoDTO } from 'src/dtos/video.dto';
import { Comments } from 'src/schemas/comments.schema';
import { Videos } from 'src/schemas/videos.schema';
import { Repository } from 'typeorm';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Videos)
    private readonly VideosRepository: Repository<Videos>,
    @InjectRepository(Comments)
    private readonly CommentsRepository: Repository<Comments>,
  ) {}

  //Function to create a video
  async create(videoData, req: Request): Promise<Videos> {
    const video = await this.VideosRepository.save({
      ...videoData,
      user: {
        id: req.user.id,
      },
    });

    return this.VideosRepository.save(video);
  }

  //Function to get users videos
  async getMyVideos(req: Request): Promise<Videos[]> {
    return await this.VideosRepository.find({
      where: {
        user: {
          id: req.user.id,
        },
      },
    });
  }

  //Fucntion to get video information
  async getVideoInfo(videoId: string): Promise<any> {
    const videoInfo = await this.VideosRepository.createQueryBuilder('video')
      .loadRelationCountAndMap('video.likes', 'video.likes')
      .loadRelationCountAndMap('video.dislikes', 'video.dislikes')
      .leftJoinAndSelect('video.user', 'user')
      .leftJoinAndSelect('video.comments', 'comments')
      .select([
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.image',
        'video',
        'comments',
      ])
      .where('video.id = :id', { id: videoId })
      .getOne();

    return videoInfo;
  }

  //Function to check video visiblity
  async videoVisibility(request, videoId: string) {
    const video = await this.VideosRepository.findOne({
      where: {
        id: videoId,
      },
      relations: ['user'],
    });

    if (video) {
      if (video.public == false && !request.user) {
        throw new ForbiddenException();
      }

      if (video.user.id != request.user.id && video.public == false) {
        throw new ForbiddenException();
      }
    } else {
      throw new NotFoundException();
    }
  }

  //Function to search for videos
  searchVideos(search: string): Promise<Videos[]> {
    return this.VideosRepository.createQueryBuilder('video')
      .select(['id', 'title', 'thumbnail'])
      .where('video.public = true')
      .andWhere(
        '(video.title like :search or video.description like :search)',
        {
          search: `%${search}%`,
        },
      )
      .limit(12)
      .execute();
  }

  //Function to get public videos
  async publicVideos() {
    const videos = await this.VideosRepository.find({
      order: {
        title: 'DESC',
      },
      relations: ['user'],
      select: {
        id: true,
        title: true,
        thumbnail: true,
        createdAt: true,
        user: {
          id: true,
          firstName: true,
          lastName: true,
          image: true,
        },
      },
      where: {
        public: true,
      },
    });

    return videos;
  }

  //Function to video by id
  getById(videoId: string): Promise<Videos> {
    return this.VideosRepository.findOne({
      where: {
        id: videoId,
      },
    });
  }

  //Function to delete video
  delete(videoId: string) {
    return this.VideosRepository.delete({
      id: videoId,
    });
  }
}
