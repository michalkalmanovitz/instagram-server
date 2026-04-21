import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PostService } from './post.service';
import { ResponseWrapper } from 'src/core/utils/ResponseWrapper';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { CreatePostDto, PostType } from './create_post.dto';
import { parsePost, parsePosts } from 'src/models/post/post.parse';

@Injectable()
export class PostLogic {
  constructor(
    private postService: PostService,
    private userService: UserService,
  ) {}

  async getAll(): Promise<ResponseWrapper<PostType[]>> {
    const posts = parsePosts(await this.postService.fetchAll());

    posts.forEach((post) => {
      post.likesCount = post.likedBy ? post.likedBy.length : 0;
    });
    const response = new ResponseWrapper(posts);
    return response;
  }

  async getByUser(username: string): Promise<ResponseWrapper<PostType[]>> {
    const posts = parsePosts(await this.postService.fetchByUser(username));

    posts.forEach((post) => {
      post.likesCount = post.likedBy ? post.likedBy.length : 0;
    });

    const response = new ResponseWrapper(posts);
    return response;
  }

  like(post: PostType, user: User): void {
    post.likedBy.push(user);
  }

  dislike(post: PostType, user: User): void {
    post.likedBy = post.likedBy.filter(
      (likedUser) => likedUser.name !== user.name,
    );
  }

  async changeLikeStatus(
    username: string,
    postId: string,
    changingLogic: (post: PostType, user: User) => void,
  ): Promise<ResponseWrapper<PostType>> {
    const user = await this.userService.fetchByName(username);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    
    const post = await this.postService.fetchById(postId);
    
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    
    const parsedPost = parsePost(post);


    const alreadyLiked = parsedPost.likedBy.some(
      (likedUser) => likedUser.name === username,
    );

    if (
      (changingLogic === this.like && !alreadyLiked) ||
      (changingLogic === this.dislike && alreadyLiked)
    ) {
      changingLogic(parsedPost, user);
    }

    parsedPost.likesCount = parsedPost.likedBy.length;

    await this.postService.savePost(parsedPost);

    const response = new ResponseWrapper(parsedPost);
    return response;
  }

  async createPost(newPost: CreatePostDto): Promise<ResponseWrapper<PostType>> {
    const user = await this.userService.fetchByName(newPost.userName);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    
    const post = await this.postService.createPost(newPost, user.name);
    const savedPost = parsePost(await this.postService.savePost(post));

    const response = new ResponseWrapper(savedPost);
    return response;
  }
}
