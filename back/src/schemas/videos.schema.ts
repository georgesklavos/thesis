import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comments } from './comments.schema';
import { Dislikes } from './dislikes.schema';
import { Likes } from './likes.schema';
import { Users } from './users.schema';

//Entity database schema definition and relations
@Entity()
export class Videos {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: true })
  public: boolean;

  @Column()
  thumbnail: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    name: 'updated_at',
  })
  updatedAt: Date;

  @ManyToOne(() => Users, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @OneToMany(() => Likes, (like) => like.video)
  likes: Likes[];

  @OneToMany(() => Comments, (comment) => comment.video)
  comments: Comments[];

  @OneToMany(() => Dislikes, (dislikes) => dislikes.video)
  dislikes: Dislikes[];
}
