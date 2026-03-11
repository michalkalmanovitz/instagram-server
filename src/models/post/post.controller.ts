import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CustomLogger } from '../../core/customLogger/customLogger';
import { PostService } from './post.service';
import { User } from '../user/user.entity';
import { CreatePostDto } from './create_post.dto';

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
  @Patch('/:id/user/:username/like')
  async LikeToPost(@Param('id') id: string, @Param('username') username: string) {
    this.logger.log('add like to post:', [id, username]);
    return await this.postService.like(username, id);
  }
  @Patch('/:id/user/:username/dislike')
  async dislikeToPost(@Param('id') id: string, @Param('username') username: string) {
    this.logger.log('remove like from post:', [id, username]);
    return await this.postService.dislike(username, id);
  }
  @Post('/new')
  async createPost(@Body() post: CreatePostDto) {
    this.logger.log('create new post');
    return await this.postService.create(post);
  }
}
