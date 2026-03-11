import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { CreatePostDto } from './create_post.dto';

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
  async dislike(user: User, postId: string): Promise<Post | null> {
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

        if (alreadyLiked) {
          post.likedBy = post.likedBy.filter(
            (likedUser: User) => likedUser.name !== user.name,
          );
        }
        post.likesCount = post.likedBy.length;
        await this.postRepository.save(post);
      }
      return post;
    }
    return null;
  }

  async create(newPost: CreatePostDto): Promise<Post | null> {
    const user = await this.userService.fetchUser(newPost.userName);
    if (user) {
      const post = this.postRepository.create({
        photoSrc: newPost.photoSrc,
        user,
        createdAt: newPost.createdAt ?? new Date(),
      });

      return this.postRepository.save(post);
    }
    return null;
  }
}
