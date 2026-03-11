import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private userService: UserService,
  ) {}

  async fetchAll(): Promise<Post[]> {
    const posts: Post[] = await this.postRepository.find({
      relations: ['user', 'likedBy'],
    });
    posts.forEach((post) => {
      post.likesCount = post.likedBy ? post.likedBy.length : 0;
    });
    return posts;
  }

  async fetchByUser(username: string): Promise<Post[]> {
    const userExists: boolean = await this.userService.findUser(username);
    if (userExists) {
      const posts: Post[] = await this.postRepository.find({
        where: { user: { name: username } },
        relations: ['user', 'likedBy'],
      });
      posts.forEach((post) => {
        post.likesCount = post.likedBy ? post.likedBy.length : 0;
      });
      return posts;
    }
    return [];
  }

  async like(user: User, postId: string): Promise<Post | null> {
    const userExists: boolean = await this.userService.findUser(user.name);
    if (userExists) {
      const post: Post | null = await this.postRepository.findOne({
        where: { id: postId },
        relations: ['user', 'likedBy'],
      });

      if (post) {
        const alreadyLiked = post.likedBy.find(
          (likedUser: User) => likedUser.name === user.name,
        );

        if (!alreadyLiked) {
          post.likedBy.push(user);
        }
        post.likesCount = post.likedBy.length;
        await this.postRepository.save(post);
      }
      return post;
    }
    return null;
  }
}
