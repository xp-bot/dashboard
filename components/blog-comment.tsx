import { faShareAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { apiRoutes } from "apis/api-helper";
// eslint-disable-next-line import/no-cycle
import { useCommentsSection } from "context/blog-comments-section";
import { useUser } from "context/user-context";
import { motion } from "framer-motion";
import { isEqual, join, map, size, slice, split } from "lodash";
import { IBlogPost, IBlogPostComment } from "models/backend/blog-models";
import { IDiscordUserLookup } from "models/backend/discord-models";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { avatarToURL } from "utils/discord-utils";
import { shareContent } from "utils/url-utils";

import FallBackImage from "./fallback-image";

interface IBlogCommentProps {
  comment: IBlogPostComment;
  removeDelete?: boolean;
  selected?: boolean;
  blogPost: IBlogPost;
  childComments?: IBlogPostComment[];
  childComment?: boolean;
  childLayer?: number;
}

const layerColors = [
  "#FEE2E2",
  "#FED7D7",
  "#FEB2B2",
  "#FC8181",
  "#F56565",
  "#E53E3E",
  "#C53030",
  "#9B2C2C",
  "#742A2A",
  "#521B1B",
];

const BlogComment: FC<IBlogCommentProps> = ({
  comment,
  removeDelete,
  selected,
  blogPost,
  childComments,
  childComment,
  childLayer,
}) => {
  const user = useUser();
  const router = useRouter();
  const commentSection = useCommentsSection();
  const [author, setAutor] = useState<IDiscordUserLookup>();
  const getAuthor = async () => {
    const res = await apiRoutes.discord.lookupUser(comment.content.creator);
    if (res.success) setAutor(res.body);
  };
  useEffect(() => {
    getAuthor();
  }, []);

  console.log(childComments);

  return (
    <>
      <motion.div
        initial={selected ? { background: "rgb(103, 103, 234)" } : undefined}
        id={comment.commentID}
        className="flex flex-col gap-2"
      >
        <div
          className={`relative flex w-full flex-col items-start gap-5 md:flex-row md:items-start md:gap-10 ${
            selected ? `border-y border-y-xpBlue p-5` : `p-[8px]`
          }`}
        >
          {!childComment && (
            <div className="w-20 shrink-0">
              <FallBackImage
                className="aspect-square w-full rounded-full shadow-rankingAvater dark:shadow-none"
                src={avatarToURL(author, 512)}
              />
            </div>
          )}
          <div className="flex w-full max-w-full grow  flex-col justify-center overflow-hidden font-serif text-darkText dark:text-darkText-darkMode">
            {!childComment && (
              <h1 className="w-full select-text break-words pr-8 font-serif text-darkText dark:text-darkText-darkMode">
                {join(slice(comment.content.title, 0, 30), ``)}
                {size(comment.content.title) > 30 && `…`}
              </h1>
            )}
            <span
              className={`flex w-full select-text flex-col justify-center whitespace-pre-wrap break-words opacity-75 ${
                childComment ? "mb-1.5" : ""
              } `}
            >
              {/* {parse(
              fixDiscordMarkdownFormat(
                stripHtml(document, comment.content.body)
              )
            )} */}
              {childComment && (
                <span className="opacity-50">
                  {author?.username} commented:
                </span>
              )}
              <span>{`${comment.content.body}`}</span>
              {!childComment && (
                <span className="opacity-50">- {author?.username}</span>
              )}
            </span>
          </div>
          <div className="absolute right-[8px] top-[8px] flex flex-row gap-3">
            <button
              onClick={() => {
                shareContent({
                  text: `${author?.username} commented on ${blogPost.content.title}`,
                  title: `Share ${comment.content.title}`,
                  url: `https://xp-bot.net${split(router.asPath, `?`)[0]}?c=${
                    comment.commentID
                  }`,
                });
              }}
            >
              <FontAwesomeIcon
                className="text-darkText dark:text-darkText-darkMode"
                icon={faShareAlt}
              />
            </button>
            {!removeDelete &&
              (isEqual(
                user.currentUser?.discordUser.id,
                comment.content.creator
              ) ||
                user.currentUser?.developer) && (
                <button
                  onClick={() => {
                    commentSection.deleteComment(comment);
                  }}
                >
                  <FontAwesomeIcon
                    className="text-darkText dark:text-darkText-darkMode"
                    icon={faTrash}
                  />
                </button>
              )}
          </div>
        </div>
        {size(childComments) > 0 && (
          <div className={`${(childLayer || 0) > 0 ? "pl-1" : "pl-32"} `}>
            {map(childComments, (child) => (
              <div
                style={{ borderColor: layerColors[(childLayer || 0) * 4] }}
                className="w-full border-l-2 pl-1"
              >
                <BlogComment
                  childLayer={(childLayer || 0) + 1}
                  childComment
                  childComments={child.childComments}
                  comment={child}
                  blogPost={blogPost}
                />
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </>
  );
};

export default BlogComment;
