import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity({ name: 'posts' })
export class Post {
  @PrimaryGeneratedColumn("uuid")
  id: number;

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
