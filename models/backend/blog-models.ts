export interface IBlogPostContent {
  title: string;
  creator: string;
  body: string;
  description: string;
  thumbnail?: string;
  updated_at?: number;
  created_at?: number;
}

export interface IBlogPost {
  postID: string;
  content: IBlogPostContent;
}

export interface IBlogPostCommentContent {
  title: string;
  creator: string;
  body: string;
}

export interface IBlogPostComment {
  postID: string;
  commentID: string;
  content: IBlogPostCommentContent;
  createdAt: string;
  updatedAt: string;
}
