import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CustomLogger } from '../../core/customLogger/customLogger';
import { PostService } from './post.service';

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
}