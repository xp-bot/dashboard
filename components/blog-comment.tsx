import {
  faReply,
  faShareAlt,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { apiRoutes } from "apis/api-helper";
// eslint-disable-next-line import/no-cycle
import { useCommentsSection } from "context/blog-comments-section";
import { useUser } from "context/user-context";
import { motion } from "framer-motion";
import { isEqual, isUndefined, join, map, size, slice, split } from "lodash";
import { IBlogPost, IBlogPostComment } from "models/backend/blog-models";
import { IDiscordUserLookup } from "models/backend/discord-models";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { avatarToURL } from "utils/discord-utils";
import isIdDeveloper from "utils/is-id-developer";
import { shareContent } from "utils/url-utils";

import BlogCreateComment from "./blog-create-comment";
import FallBackImage from "./fallback-image";
import Modal from "./modal";

interface IBlogCommentProps {
  comment: IBlogPostComment;
  removeDelete?: boolean;
  selected?: boolean;
  blogPost: IBlogPost;
  childComments?: IBlogPostComment[];
  childComment?: boolean;
  childLayer?: number;
}

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
  const [replyModal, setReplyModal] = useState<string | undefined>();
  const [author, setAutor] = useState<{
    discordUser: IDiscordUserLookup;
    developer: boolean;
  }>();
  const getAuthor = async () => {
    const res = await apiRoutes.discord.lookupUser(comment.content.creator);

    if (res.success)
      setAutor({
        discordUser: res.body,
        developer: isIdDeveloper(comment.content.creator),
      });
  };
  useEffect(() => {
    getAuthor();
  }, []);

  return (
    <>
      <motion.div
        initial={selected ? { background: "rgb(103, 103, 234)" } : undefined}
        id={comment.commentID}
        className={`flex flex-col`}
      >
        <div
          className={`group relative flex w-full flex-col items-center md:flex-row md:items-start ${
            !childComment ? "gap-5 md:gap-10" : "gap-5"
          } ${selected ? `border-y border-y-xpBlue p-5` : `p-[8px]`}`}
        >
          {!childComment && (
            <div
              className={`aspect-square w-20 shrink-0 grow-0 overflow-hidden rounded-full shadow-rankingAvater dark:shadow-none`}
            >
              <FallBackImage
                className=" h-full w-full "
                src={avatarToURL(author?.discordUser, 512)}
              />
            </div>
          )}
          <div
            className={`flex w-full max-w-full grow flex-col justify-center overflow-hidden ${
              childComment ? "pr-24" : ""
            } font-serif text-darkText dark:text-darkText-darkMode`}
          >
            {!childComment && (
              <h1 className="w-full select-text break-words pr-8 font-serif text-darkText dark:text-darkText-darkMode">
                {join(slice(comment.content.title, 0, 30), ``)}
                {size(comment.content.title) > 30 && `…`}
              </h1>
            )}
            <span
              className={`flex w-full select-text flex-col justify-center whitespace-pre-wrap break-words opacity-75 md:group-hover:opacity-100`}
            >
              {/* {parse(
              fixDiscordMarkdownFormat(
                stripHtml(document, comment.content.body)
              )
            )} */}
              <span>{`${comment.content.body}`}</span>
              {
                <span className="opacity-50">
                  - {author?.discordUser?.username}{" "}
                  <span className="text-xs">
                    {author?.developer && "• XP Developer"}
                  </span>
                </span>
              }
            </span>
          </div>
          {!comment.deleted && (
            <div className="absolute right-[8px] top-[8px] flex flex-row gap-3">
              <button
                onClick={() => {
                  shareContent({
                    text: `${author?.discordUser?.username} commented on ${blogPost.content.title}`,
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
              <button
                onClick={() => {
                  setReplyModal(comment.commentID);
                }}
              >
                <FontAwesomeIcon
                  className="text-darkText dark:text-darkText-darkMode"
                  icon={faReply}
                />
              </button>
            </div>
          )}
        </div>
        {size(childComments) > 0 && (
          <div
            className={`flex flex-col ${
              (childLayer || 0) > 0 ? "pl-2" : "py-2 lg:ml-32 lg:pr-0"
            }`}
          >
            {map(childComments, (child) => (
              <div
                className={`w-full border-l-4 ${
                  isIdDeveloper(child.content.creator) ? "border-xpBlue" : ""
                } `}
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
      <Modal
        customKey={`reply-modal-${replyModal}`}
        isOpen={!isUndefined(replyModal)}
        title={`Reply to ${author?.discordUser?.username}`}
        requestClose={() => {
          setReplyModal(undefined);
        }}
      >
        <div className="min-w-[60vw]">
          <BlogCreateComment
            postedCallback={() => {
              setReplyModal(undefined);
            }}
            parentCommentId={replyModal}
          />
        </div>
      </Modal>
    </>
  );
};

export default BlogComment;
