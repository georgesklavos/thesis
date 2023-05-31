import { IsDefined, IsEmail, IsString } from 'class-validator';

export class loginDto {
  @IsDefined()
  @IsEmail()
  email: string;

  @IsDefined()
  @IsString()
  password: string;
}
