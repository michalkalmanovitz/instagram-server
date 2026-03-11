import { User } from '../user/user.entity';

export class CreatePostDto {

  photoSrc: string;

  user: User;

  createdAt: Date;

  likedBy: User[];

  likesCount: number;

}