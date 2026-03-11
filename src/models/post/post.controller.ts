import { Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CustomLogger } from '../../core/customLogger/customLogger';
import { PostService } from './post.service';
import { Post as postEntity } from './post.entity';

@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly logger: CustomLogger,
  ) {}

  @Get()
  async getAllPosts() {
    this.logger.log('get all posts');
    return await this.postService.fetchAll();
  }  

  @Get('/user/:username')
  async getPostsByUser(@Param('username') username: string) {
    this.logger.log('get posts by user:', username);
    return await this.postService.fetchByUser(username);
  }

}
