import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  UseInterceptors,
  Header,
  Headers,
  Param,
  Res,
  HttpStatus,
  UploadedFiles,
  Query,
  NotFoundException,
  StreamableFile,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  randomUUID,
} from 'crypto';
import { Response } from 'express';
import {
  createReadStream,
  createWriteStream,
  existsSync,
  mkdirSync,
  readFile,
  renameSync,
  rmSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'fs';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { VideosService } from './videos.service';
import * as ffmpeg from 'fluent-ffmpeg';
import { QueryAuthGuard } from 'src/auth/query.auth.guard';
import { parentPort } from 'worker_threads';
import { join } from 'path';
import { OptionalGuard } from 'src/guards/optional.guard';
import { LikesService } from 'src/likes/likes.service';
import { DislikesService } from 'src/dislikes/dislikes.service';
import { pipeline } from 'stream';
import { CreateVideoDTO } from 'src/dtos/video.dto';
import { UsersService } from 'src/users/users.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const speakeasy = require('speakeasy');

const algorithm = 'aes-256-ctr';
@Controller('videos')
export class VideosController {
  constructor(
    private readonly videosService: VideosService,
    private readonly likesService: LikesService,
    private readonly disLikesService: DislikesService,
    private readonly usersService: UsersService,
  ) {}

  videoFolder = './video-files';
  videoImagesFolder = './video-images-files';
  cipher = createCipheriv(
    algorithm,
    Buffer.from(process.env.AES_KEY),
    process.env.AES_IV,
  );

  //Function to encrypt the private video
  encryptFile(readPath, writePath) {
    const readStreamFinal = createReadStream(readPath);
    const writeStreamFinal = createWriteStream(writePath);
    return new Promise((resolve, reject) => {
      readStreamFinal.pipe(this.cipher).pipe(writeStreamFinal);
      readStreamFinal.on('data', (data) => {
        console.log(data);
      });
      readStreamFinal.on('end', () => {
        console.log('finish read');
        resolve('finish');
      });
      readStreamFinal.on('close', () => {
        console.log('close read');
      });
      writeStreamFinal.on('close', () => {
        console.log('finish write');
      });

      readStreamFinal.on('error', (er) => {
        console.log(er);
      });

      writeStreamFinal.on('error', (er) => {
        console.log(er);
      });
      console.log(writePath);
    });
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'video', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 },
    ]),
  )
  async createVideo(
    @Request() req,
    @Body() body: CreateVideoDTO,
    @UploadedFiles() files,
  ) {
    //Function to upload and save video file
    const user = await this.usersService.getOneById(req.user.id);
    const result = speakeasy.totp.verify({
      secret: user.secret,
      encoding: 'base32',
      token: body.password2FA,
    });

    if (!result) {
      throw new BadRequestException();
    }

    const imagesDirectory = `${this.videoImagesFolder}`;
    mkdirSync(imagesDirectory, { recursive: true });
    const fileName = `${randomUUID()}.png`;
    writeFileSync(`${imagesDirectory}/${fileName}`, files.thumbnail[0].buffer);
    const video = await this.videosService.create(
      {
        ...body,
        thumbnail: fileName,
      },
      req,
    );
    const videosDirectory = `${this.videoFolder}`;
    mkdirSync(videosDirectory, { recursive: true });
    const fileDir = `${videosDirectory}/${video.id}`;
    const tempFilePath = `${fileDir}-temp.mp4`;
    const filePath = `${fileDir}.mp4`;
    writeFileSync(tempFilePath, files.video[0].buffer);

    //Compress public video
    if (video.public) {
      ffmpeg(tempFilePath)
        .fps(30)
        .outputOptions(['-c:v libx264', `-b:v 128k`, '-c:a aac', '-b:a 58k'])
        .on('end', () => {
          unlinkSync(tempFilePath);
        })
        .save(filePath);
    } else {
      //Encrypt private video
      await this.encryptFile(tempFilePath, filePath);
      unlinkSync(tempFilePath);
    }

    return video;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getVideos(@Request() req) {
    //Service function to get users videos
    return await this.videosService.getMyVideos(req);
  }

  @Get('play/:videoId')
  @Header('Accept-Ranges', 'bytes')
  @Header('Content-Type', 'video/mp4')
  async playVideo(
    @Param('videoId') videoId: string,
    @Headers() headers,
    @Res() res: Response,
    @Request() req,
  ) {
    //Function to play video depending if it is private or public video
    const filePath = `${this.videoFolder}/${videoId}.mp4`;
    const { size } = statSync(filePath);
    const videoRange = headers.range;
    const decipher = createDecipheriv(
      algorithm,
      Buffer.from(process.env.AES_KEY),
      process.env.AES_IV,
    );

    const video = await this.videosService.getById(videoId);
    //Stream video file
    if (videoRange) {
      const parts = videoRange.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : size - 1;
      const chunksize = end - start + 1;
      const readStreamfile = createReadStream(filePath, {
        start,
        end,
        highWaterMark: 60,
      });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${size}`,
        'Content-Length': chunksize,
      };
      res.writeHead(HttpStatus.PARTIAL_CONTENT, head);
      if (video.public) {
        readStreamfile.pipe(res);
      } else {
        readStreamfile.pipe(decipher).pipe(res);
      }
    } else {
      const head = {
        'Content-Length': size,
      };
      res.writeHead(HttpStatus.OK, head);
      try {
        if (video.public) {
          createReadStream(filePath).pipe(res);
        } else {
          createReadStream(filePath).pipe(decipher).pipe(res);
        }
      } catch {}
    }
  }

  @Get('/details/:videoId')
  @UseGuards(OptionalGuard)
  async getVideoDetails(@Param('videoId') videoId, @Request() req) {
    //Retun video details like,dislike,comments
    const videoInfo = await this.videosService.getVideoInfo(videoId);

    if (req.user) {
      videoInfo.liked = await this.likesService.likeExists(
        videoId,
        req.user.id,
      );
      videoInfo.disLiked = await this.disLikesService.disLikeExists(
        videoId,
        req.user.id,
      );
    }

    return videoInfo;
  }

  @Get('/search')
  async searchVideos(@Query('search') search) {
    //Service function to return search results
    return await this.videosService.searchVideos(search);
  }

  @Get('public')
  async getPublicVideos() {
    //Service function to return public videos
    return this.videosService.publicVideos();
  }

  @Get('thumbnail/:name')
  getThumbnail(@Param('name') name: string, @Res() res: Response) {
    //Function to return videos thumbnails
    const filePath = join(process.cwd(), this.videoImagesFolder, name);
    if (existsSync(filePath)) {
      const readStream = createReadStream(filePath);
      readStream.on('error', (err) => {
        res.end(err);
      });
      readStream.on('ready', () => {
        readStream.pipe(res);
      });
    } else {
      throw new NotFoundException();
    }
  }

  @Delete('/:videoId')
  async deleteVideo(@Param('videoId') videoId: string) {
    //Function to delete video file
    const filePath = join(process.cwd(), this.videoFolder, `${videoId}.mp4`);
    if (existsSync(filePath)) {
      //Serice function to delete video from databse
      await this.videosService.delete(videoId);
      rmSync(filePath);
    } else {
      throw new NotFoundException();
    }
  }
}
