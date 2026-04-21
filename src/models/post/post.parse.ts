import { Post } from 'src/models/post/post.entity';
import { PostType } from './create_post.dto';

export const parsePosts = (posts: Post[]): PostType[] => {
  const parsedPosts = posts.map((post) => ({
    ...post,
    likesCount: post.likedBy ? post.likedBy.length : 0,
  }));
  return parsedPosts;
};

export const parsePost = (post: Post): PostType => {
  const parsedPost = {
    ...post,
    likesCount: post.likedBy ? post.likedBy.length : 0,
  };
  return parsedPost;
};