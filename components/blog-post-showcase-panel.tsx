import { useUser } from "context/user-context";
import { capitalize, isEmpty, isNil } from "lodash";
import { BlogPostStatus, IBlogPost } from "models/backend/blog-models";
import Link from "next/link";
import { FC } from "react";

import FallBackImage from "./fallback-image";

interface BlogPostShowcasePanelProps {
  blogPost: IBlogPost;
}

const blogStatusIcons = {
  [BlogPostStatus.DRAFT]: `📝`,
  [BlogPostStatus.PUBLISHED]: `📰`,
  [BlogPostStatus.UNLISTED]: `🔒`,
};

const BlogPostShowcaseGridPanel: FC<BlogPostShowcasePanelProps> = ({
  blogPost,
}) => {
  const user = useUser();
  return (
    <div className="group relative flex h-[220px] w-full shrink grow cursor-pointer flex-col items-end overflow-hidden rounded-md border-black/25 shadow-lg transition-all ease-in-out active:translate-y-1 active:border dark:border-white/25 lg:hover:-translate-y-1 lg:active:translate-y-0 lg:active:border-none">
      <div className="relative h-[50%] w-full grow">
        {user.currentUser?.developer &&
          blogPost.content.status !== BlogPostStatus.PUBLISHED && (
            <div className="absolute right-2 top-2 z-10 w-fit rounded-bl-md rounded-tr-md bg-panelBack p-3 py-2 text-sm text-darkText shadow-md dark:bg-panelBack-darkMode dark:text-darkText-darkMode">
              {blogStatusIcons[blogPost.content.status]}{" "}
              {capitalize(blogPost.content.status)}
            </div>
          )}
        <FallBackImage
          className={`${
            isNil(blogPost.content.thumbnail) ||
            isEmpty(blogPost.content.thumbnail)
              ? `origin-center scale-110 blur-sm grayscale`
              : ``
          } h-full w-full bg-input-darkMode object-cover`}
          customFallback="http://cdn.namespace.media/s/i8kyeDYXHDAY3rR/download/SPLASH_3_EMPTY.png"
          src={
            blogPost.content.thumbnail ||
            `http://cdn.namespace.media/s/i8kyeDYXHDAY3rR/download/SPLASH_3_EMPTY.png`
          }
          alt="jeje"
        />
      </div>
      <div className="z-10 h-fit w-full  bg-panelBack p-3 text-center text-darkText transition ease-in-out dark:bg-panelBack-darkMode dark:text-darkText-darkMode md:text-start">
        <h2 className="mb-1 truncate">{blogPost.content.title}</h2>
        <p className="line-clamp-2 text-xs text-darkText opacity-75 dark:text-darkText-darkMode">
          {blogPost.content.description}
        </p>
      </div>
    </div>
  );
};

const BlogPostShowcasePanel: FC<BlogPostShowcasePanelProps> = ({
  blogPost,
}) => (
  <Link
    href={
      blogPost.content.status === BlogPostStatus.DRAFT
        ? `/blog/editor/${blogPost.postID}`
        : `/blog/${blogPost.postID}`
    }
  >
    <BlogPostShowcaseGridPanel blogPost={blogPost} />
  </Link>
);

export default BlogPostShowcasePanel;
