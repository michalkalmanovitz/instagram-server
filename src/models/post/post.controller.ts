import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CustomLogger } from '../../core/customLogger/customLogger';
import { PostService } from './post.service';
import { User } from '../user/user.entity';

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
  @Patch('/:id/like')
  async LikeToPost(@Param('id') id: string, @Body('user') user: User) {
    this.logger.log('add like to post:', [id, user.name]);
    return await this.postService.like(user, id);
  }
  @Patch('/:id/dislike')
  async dislikeToPost(@Param('id') id: string, @Body('user') user: User) {
    this.logger.log('remove like from post:', [id, user.name]);
    return await this.postService.dislike(user, id);
  }
}
