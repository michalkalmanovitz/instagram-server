import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { CreatePostDto } from './create_post.dto';
import { CustomLogger } from 'src/core/customLogger/customLogger';
import { options } from 'joi';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private userService: UserService,
    readonly logger: CustomLogger,
  ) {}

  async fetchAll(): Promise<Post[]> {
    const posts = await this.postRepository.find({
      relations: ['user', 'likedBy'],
      order: { createdAt: 'DESC' },
    });
    return posts;
  }

  async fetchByUser(username: string): Promise<Post[]> {
    const user = await this.userService.fetchByName(username);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const posts = await this.postRepository.find({
      where: { user: { name: user.name } },
      relations: ['user', 'likedBy'],
      order: { createdAt: 'DESC' },
    });
    return posts;
  }

  async fetchById(postId: string): Promise<Post|null> {
    const post: Post | null = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['user', 'likedBy'],
    });
    console.log(post);
    return post;
  }

  async savePost(post: Post): Promise<Post> {
    const savedPost = await this.postRepository.save(post);
    return savedPost;
  }

  async createPost(newPost: CreatePostDto, username: string): Promise<Post> {
    const post = await this.postRepository.create({
      photoSrc: newPost.photoSrc,
      user: { name: username },
      createdAt: newPost.createdAt ?? new Date(),
    });
    return post;
  }
}
