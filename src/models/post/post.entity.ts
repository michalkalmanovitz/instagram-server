import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity({ name: 'post' })
export class Post {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: 'photo_src' })
  photoSrc: string;

  @ManyToOne(() => User, (user) => user.myPosts)
  @JoinColumn({ name: 'user_name' })
  user: User;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @ManyToMany(() => User, (user) => user.likedPosts)
  likedBy: User[];

  likesCount: number;
}
