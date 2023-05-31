import { IsDefined, IsString } from 'class-validator';

export class CreateCommentDTO {
  @IsDefined()
  @IsString()
  comment: string;
}
