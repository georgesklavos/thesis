import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  UploadedFile,
  Response,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { randomUUID } from 'crypto';
import { createReadStream, existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { CreateUserDTO } from 'src/dtos/user.dto';
import { Users } from 'src/schemas/users.schema';
import { UsersService } from './users.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const speakeasy = require('speakeasy');

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  imageFolder = './image-files';

  @Post()
  async createUser(@Body() body: CreateUserDTO) {
    //Function to generate 2fa code
    const secret = speakeasy.generateSecret();
    ////Service function to create a user
    const user = await this.usersService.create({
      ...body,
      secret: secret.base32,
    } as null);

    return {
      ...user,
      optUrl: secret.otpauth_url,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req): Promise<Users> {
    //Service function to retrive user data
    return this.usersService.getOneById(req.user.id);
  }

  @Put('/:userId')
  async editUser(@Body() body, @Param('userId') userId: string) {
    //Service function to edit a user
    return this.usersService.update({
      id: userId,
      ...body,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadProfileImage(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const fileName = `${randomUUID()}.png`;
    //Function to add new user image
    mkdirSync(this.imageFolder, { recursive: true });
    writeFileSync(`${this.imageFolder}/${fileName}`, file.buffer);
    await this.usersService.update({
      id: req.user.id,
      image: fileName,
    });
  }

  @Get('image/:name')
  async getProfileImage(@Param('name') name: string, @Response() res) {
    //Function to retrieve user image
    const filePath = join(process.cwd(), this.imageFolder, name);
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
}
