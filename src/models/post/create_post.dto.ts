import { Post } from './post.entity';

export class CreatePostDto {
  photoSrc: string;

  userName: string;

  createdAt?: Date;
}



export type PostType = Post & likesCount;

type likesCount = {
  likesCount: number;
};
