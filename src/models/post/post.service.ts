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
    return await this.postRepository.find({
      relations: ['user', 'likedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async fetchByUser(username: string): Promise<Post[]> {
    const user = await this.userService.fetchByName(username);

    return await this.postRepository.find({
      where: { user: { name: user.name } },
      relations: ['user', 'likedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async fetchById(postId: string): Promise<Post> {
    const post: Post | null = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['user', 'likedBy'],
    });
    console.log(post);
    if (post == null) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    return post;
  }

  async savePost(post: Post): Promise<Post> {
    return await this.postRepository.save(post);
  }

  async createPost(newPost: CreatePostDto, user: User): Promise<Post> {
    return await this.postRepository.create({
      photoSrc: newPost.photoSrc,
      user: user,
      createdAt: newPost.createdAt ?? new Date(),
    });
  }
}
