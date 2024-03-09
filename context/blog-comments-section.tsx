import { faCancel, faRemove } from "@fortawesome/free-solid-svg-icons";
import { apiRoutes } from "apis/api-helper";
// eslint-disable-next-line import/no-cycle
import BlogComment from "components/blog-comment";
// eslint-disable-next-line import/no-cycle
import BlogCreateComment from "components/blog-create-comment";
import ButtonCluster, { ButtonFeature } from "components/button-cluster";
import Modal from "components/modal";
import { AnimatePresence, motion } from "framer-motion";
import {
  isEqual,
  isUndefined,
  join,
  map,
  noop,
  orderBy,
  size,
  slice,
} from "lodash";
import {
  IBlogPost,
  IBlogPostComment,
  IBlogPostCommentContent,
} from "models/backend/blog-models";
import {
  createContext,
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface IBlogCommentsSectionValues {
  deleteComment: (comment: IBlogPostComment) => void;
  postComment: (
    comment: IBlogPostCommentContent,
    parentCommentId?: string
  ) => void;
}

export const BlogCommentsSectionContext =
  createContext<IBlogCommentsSectionValues>({
    deleteComment: noop,
    postComment: noop,
  });

interface IBlogCommentsContextProviderProps {
  children?: JSX.Element[] | JSX.Element;
  comments: IBlogPostComment[];
  blogPost: IBlogPost;
  selectedComment?: IBlogPostComment | undefined;
}

export function BlogCommentsSection({
  blogPost,
  comments: ogComments,
  children,
  selectedComment,
}: IBlogCommentsContextProviderProps): React.ReactElement {
  const [deleteCommentModal, setDeleteCommentModal] = useState<
    IBlogPostComment | undefined
  >();
  const selectedRef = useRef<HTMLDivElement>(null);
  const [comments, setComments] = useState(ogComments);

  const refetchComments = async () => {
    const res = await apiRoutes.blog.get.postComments(blogPost.postID);
    if (res.success) setComments(res.body);
  };
  const deleteComment = async (comment: IBlogPostComment) => {
    await apiRoutes.blog.deleteComment(blogPost.postID, comment.commentID);
    await refetchComments();
  };
  const postComment = async (
    comment: IBlogPostCommentContent,
    parentCommentId?: string
  ) => {
    await apiRoutes.blog.postComment(
      blogPost.postID,
      {
        ...comment,
        title: join(slice(comment.title, 0, 30), ``),
      },
      parentCommentId
    );
    await refetchComments();
  };

  useEffect(() => {
    const scroll = async () => {
      if (selectedRef.current) {
        // eslint-disable-next-line no-promise-executor-return
        await new Promise((resolve) => setTimeout(resolve, 1000));
        selectedRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };
    scroll();
  }, [selectedComment, selectedRef]);

  if (!blogPost.content.comments_enabled)
    return (
      <p className="text-darkText text-center opacity-25 dark:text-darkText-darkMode">
        Comments have been disabled for this post.
      </p>
    );

  return (
    <BlogCommentsSectionContext.Provider
      value={{
        deleteComment: (comment) => {
          setDeleteCommentModal(comment);
        },
        postComment,
      }}
    >
      <h1 className="text-darkText dark:text-darkText-darkMode">Comments</h1>
      <div className="mt-5 flex flex-col gap-5 sm:px-5">
        <div>
          <BlogCreateComment />
        </div>
        {size(comments) > 0 && <hr />}
        <AnimatePresence initial={false} mode="popLayout">
          {map(
            orderBy(comments, (comment) => comment.updatedAt, "desc"),
            (comment, idx) => (
              <Fragment key={comment.commentID}>
                <motion.div
                  key={`comment_parent_${comment.commentID}`}
                  initial="hidden"
                  exit="hidden"
                  animate="base"
                  variants={{
                    base: { opacity: 1 },
                    hidden: { opacity: 0 },
                  }}
                  id={`c_${comment.commentID}`}
                  ref={
                    isEqual(selectedComment?.commentID, comment.commentID)
                      ? selectedRef
                      : undefined
                  }
                >
                  <BlogComment
                    blogPost={blogPost}
                    selected={isEqual(
                      selectedComment?.commentID,
                      comment.commentID
                    )}
                    comment={comment}
                    key={`comment_${comment.postID}_${comment.commentID}`}
                    childComments={comment.childComments}
                  />
                </motion.div>
                {size(comments) > 0 && !isEqual(idx, size(comments) - 1) && (
                  <hr />
                )}
              </Fragment>
            )
          )}
        </AnimatePresence>
      </div>
      {children}
      <Modal
        requestClose={() => {
          setDeleteCommentModal(undefined);
        }}
        isOpen={!isUndefined(deleteCommentModal)}
        title={`Delete "${deleteCommentModal?.content.title}"?`}
      >
        <div className="flex flex-col gap-5">
          {deleteCommentModal && (
            <div className="rounded-md border bg-input p-3 shadow-md dark:bg-input-darkMode">
              <BlogComment
                blogPost={blogPost}
                removeDelete
                comment={deleteCommentModal}
                key={`comment_modal_${deleteCommentModal.postID}_${deleteCommentModal.commentID}`}
              />
            </div>
          )}
          <ButtonCluster
            isInPanel
            buttons={[
              {
                onClick: () => {
                  setDeleteCommentModal(undefined);
                },
                icon: faCancel,
                text: `Dismiss`,
              },
              {
                onClick: () => {
                  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                  if (deleteCommentModal) {
                    deleteComment(deleteCommentModal);
                    setDeleteCommentModal(undefined);
                  }
                },
                icon: faRemove,
                feature: ButtonFeature.danger,
                text: `Delete`,
              },
            ]}
          />
        </div>
      </Modal>
    </BlogCommentsSectionContext.Provider>
  );
}

export const useCommentsSection = (): IBlogCommentsSectionValues =>
  useContext(BlogCommentsSectionContext);
