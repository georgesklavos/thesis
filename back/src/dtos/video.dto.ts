import { Transform } from 'class-transformer';
import { IsBoolean, IsDefined, IsOptional, IsString } from 'class-validator';

export class CreateVideoDTO {
  @IsDefined()
  @IsString()
  title: string;

  @IsDefined()
  @IsString()
  description: string;

  @IsDefined()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  public: boolean;

  @IsDefined()
  @IsString()
  password2FA: string;
}
