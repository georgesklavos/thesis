import { Type } from 'class-transformer';
import { IsDate, IsDefined, IsEmail, IsString } from 'class-validator';

export class CreateUserDTO {
  @IsDefined()
  @IsString()
  firstName: string;

  @IsDefined()
  @IsString()
  lastName: string;

  @IsDefined()
  @Type(() => Date)
  @IsDate()
  dateOfBirth: Date;

  @IsDefined()
  @IsEmail()
  email: string;

  @IsDefined()
  @IsString()
  password: string;
}
