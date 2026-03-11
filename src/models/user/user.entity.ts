import {
  Entity,
  Column,
  OneToMany,
  PrimaryColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { Post } from '../post/post.entity';

@Entity({ name: 'user' })
export class User {
  @PrimaryColumn()
  name: string;

  @Column({
    name: 'avatar_src',
    type: 'text',
    default: '',
  })
  avatarSrc: string;

  @OneToMany(() => Post, (post) => post.user)
  myPosts: Post[];

  @ManyToMany(() => Post, (post) => post.likedBy)
  @JoinTable({
    name: 'likes',
    joinColumn: {
      name: 'user_name',
      referencedColumnName: 'name',
    },
    inverseJoinColumn: {
      name: 'post_id',
      referencedColumnName: 'id',
    },
  })
  likedPosts: Post[];
}
