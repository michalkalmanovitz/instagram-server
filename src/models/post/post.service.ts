import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { User } from '../user/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) // ✅ inject repository
    private postRepository: Repository<Post>,
  ) {}

  async fetchAll(): Promise<Post[]> {
    const posts: Post[] = await this.postRepository.find({
      relations: ['user'],
    });
    posts.forEach((post) => {
      post.likesCount = post.likedBy ? post.likedBy.length : 0;
    });
    return posts;
  }
}
