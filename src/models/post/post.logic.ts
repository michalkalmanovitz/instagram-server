import { Injectable } from '@nestjs/common';
import { PostService } from './post.service';
import { Post } from './post.entity';
import { ResponseWrapper } from 'src/core/utils/ResponseWrapper';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { CreatePostDto } from './create_post.dto';

@Injectable()
export class PostLogic {
  constructor(
    private postService: PostService,
    private userService: UserService,
  ) {}

  async getAll(): Promise<ResponseWrapper<Post[]>> {
    const posts: Post[] = await this.postService.fetchAll();

    posts.forEach((post) => {
      post.likesCount = post.likedBy ? post.likedBy.length : 0;
    });

    return new ResponseWrapper(posts);
  }

  async getByUser(username: string): Promise<ResponseWrapper<Post[]>> {
    const posts: Post[] = await this.postService.fetchByUser(username);

    posts.forEach((post) => {
      post.likesCount = post.likedBy ? post.likedBy.length : 0;
    });

    return new ResponseWrapper(posts);
  }

  like(post: Post, user: User): void {
    post.likedBy.push(user);
  }

  dislike(post: Post, user: User): void {
    post.likedBy = post.likedBy.filter(
      (likedUser) => likedUser.name !== user.name,
    );
  }

  async changeLikeStatus(
    username: string,
    postId: string,
    changingLogic: (post: Post, user: User) => void,
  ): Promise<ResponseWrapper<Post>> {
    const user = await this.userService.fetchByName(username);
    const post = await this.postService.fetchById(postId);

    const alreadyLiked = post.likedBy.some(
      (likedUser) => likedUser.name === username,
    );

    if (
      (changingLogic === this.like && !alreadyLiked) ||
      (changingLogic === this.dislike && alreadyLiked)
    ) {
      changingLogic(post, user);
    }

    post.likesCount = post.likedBy.length;

    await this.postService.savePost(post);

    return new ResponseWrapper(post);
  }

  async createPost(newPost: CreatePostDto): Promise<ResponseWrapper<Post>> {
    const user = await this.userService.fetchByName(newPost.userName);
    const post = await this.postService.createPost(newPost, user);
    const savedPost = await this.postService.savePost(post);

    return new ResponseWrapper(savedPost);
  }
}
