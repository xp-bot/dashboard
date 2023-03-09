import { IBlogPost } from 'models/backend/blog-models';
import { FC } from 'react';

interface IHeaderBlogPostProps {
  blogPost: IBlogPost;
}

const HeaderBlogPost: FC<IHeaderBlogPostProps> = ({ blogPost }) => {
  return (
    <>
      <div className="flex flex-col items-center text-center lg:items-start lg:text-start">
        <h1>{blogPost.content.title}</h1>
        <h4>{blogPost.content.description}</h4>
      </div>
    </>
  );
};

export default HeaderBlogPost;
