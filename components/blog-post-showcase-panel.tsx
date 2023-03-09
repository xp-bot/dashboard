import { isEmpty, isNil } from 'lodash';
import { IBlogPost } from 'models/backend/blog-models';
import Link from 'next/link';
import { FC } from 'react';

import FallBackImage from './fallback-image';

interface BlogPostShowcasePanelProps {
  blogPost: IBlogPost;
}

const BlogPostShowcasePanel: FC<BlogPostShowcasePanelProps> = ({
  blogPost,
}) => (
  <Link
    className="group relative flex h-[220px] shrink grow cursor-pointer flex-col items-end overflow-hidden rounded-md border-black/25 shadow-lg transition-all ease-in-out active:translate-y-1 active:border dark:border-white/25 lg:w-fit lg:hover:-translate-y-1 lg:active:translate-y-0 lg:active:border-none"
    href={`/blog/${blogPost.postID}`}
  >
    <div className="h-[50%] w-full grow">
      <FallBackImage
        className={`${
          isNil(blogPost.content.thumbnail) ||
          isEmpty(blogPost.content.thumbnail)
            ? `origin-center scale-110 blur-sm grayscale`
            : ``
        } h-full w-full bg-input-darkMode object-cover`}
        customFallback={`http://cdn.namespace.media/s/i8kyeDYXHDAY3rR/download/SPLASH_3_EMPTY.png`}
        src={
          blogPost.content.thumbnail ||
          `http://cdn.namespace.media/s/i8kyeDYXHDAY3rR/download/SPLASH_3_EMPTY.png`
        }
        alt={'jeje'}
      />
    </div>
    <div className="z-10 h-fit w-full bg-panelBack p-3 text-center text-darkText transition ease-in-out dark:bg-panelBack-darkMode dark:text-darkText-darkMode md:text-start">
      <h2 className="mb-1 drop-shadow-md">{blogPost.content.title}</h2>
      <h4 className="text-darkText opacity-75 dark:text-darkText-darkMode">
        <p>{blogPost.content.description}</p>
      </h4>
    </div>
  </Link>
);

export default BlogPostShowcasePanel;
