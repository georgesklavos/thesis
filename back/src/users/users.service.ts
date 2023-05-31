import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Users } from '../schemas/users.schema';
import * as bcrypt from 'bcrypt';
import { validate } from 'class-validator';
import { CreateUserDTO } from 'src/dtos/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly UsersRepository: Repository<Users>,
  ) {}

  //Function to find all users
  find(): Promise<Users[]> {
    return this.UsersRepository.find();
  }

  //Function to get user by id
  async getOneById(id: string): Promise<Users> {
    try {
      const user = await this.UsersRepository.findOneOrFail({
        where: {
          id,
        },
      });
      return user;
    } catch (err) {
      throw err;
    }
  }

  //Function to create a new user
  async create(userData: CreateUserDTO): Promise<Users> {
    userData.password = await bcrypt.hash(userData.password, 10);
    const newUsers = await this.UsersRepository.create(userData);

    await validate(newUsers).catch(() => {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Invalid user information',
        },
        HttpStatus.BAD_REQUEST,
      );
    });

    return await this.UsersRepository.save(newUsers);
  }

  //Function to find a user by their email
  async findUser(emailInput: string): Promise<any> {
    const user = await this.UsersRepository.findOne({
      where: {
        email: emailInput,
      },
    });
    return user;
  }

  //Function to update a user
  async update(userData: Partial<Users>) {
    const user = await this.UsersRepository.save(userData);

    return user;
  }
}
