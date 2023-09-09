export enum BlogPostStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  UNLISTED = "unlisted",
}

export interface IBlogPostContent {
  title: string;
  creator: string;
  body: string;
  description: string;
  thumbnail?: string;
  updated_at?: Date;
  created_at?: Date;
  status: BlogPostStatus;
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
  parentComment?: string;
  childComments?: IBlogPostComment[];
  deleted: boolean;
}
