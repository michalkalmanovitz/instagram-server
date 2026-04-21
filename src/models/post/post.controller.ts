import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CustomLogger } from '../../core/customLogger/customLogger';
import { PostService } from './post.service';
import { PostLogic } from './post.logic';
import { User } from '../user/user.entity';
import { CreatePostDto } from './create_post.dto';

@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly postLogic: PostLogic,
    private readonly logger: CustomLogger,
  ) {}

  @Get()
  async getAllPosts() {
    this.logger.log('get all posts');
    const posts = await this.postLogic.getAll();
    return posts;
  }

  @Get('/user/:username')
  async getPostsByUser(@Param('username') username: string) {
    this.logger.log('get posts by user:', username);
    return await this.postLogic.getByUser(username);
  }

  @Patch('/:id/user/:username/like')
  async LikePost(@Param('id') id: string, @Param('username') username: string) {
    this.logger.log('add like to post:', [id, username]);
    const result = await this.postLogic.changeLikeStatus(username, id, this.postLogic.like);
    return result;
  }

  @Patch('/:id/user/:username/dislike')
  async dislikePost(
    @Param('id') id: string,
    @Param('username') username: string,
  ) {
    this.logger.log('remove like from post:', [id, username]);
    const result = await this.postLogic.changeLikeStatus(
      username,
      id,
      this.postLogic.dislike,
    );
    return result;
  }

  @Post('/new')
  async createPost(@Body() post: CreatePostDto) {
    this.logger.log('create new post');
    const newPost = await this.postLogic.createPost(post);
    return newPost;
  }
}
