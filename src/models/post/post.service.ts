import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) // ✅ inject repository
    private postRepository: Repository<Post>,
  ) {}

  async fetchAll(): Promise<Post[]> {
    return await this.postRepository.find();
  }
}