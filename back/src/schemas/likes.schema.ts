import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Users } from './users.schema';
import { Videos } from './videos.schema';

//Entity database schema definition and relations
@Entity()
export class Likes {
  @PrimaryColumn({ name: 'user_id' })
  @ManyToOne(() => Users, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: string;

  @PrimaryColumn({ name: 'video_id' })
  @ManyToOne(() => Videos, (video) => video.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'video_id' })
  video: string;
}
