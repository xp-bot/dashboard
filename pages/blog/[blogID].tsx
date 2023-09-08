import {
  faCross,
  faPen,
  faShareAlt,
  faWarning,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { apiRoutes } from "apis/api-helper";
import BlogMarkdown from "components/blog-markdown";
import ButtonCluster, { ButtonFeature } from "components/button-cluster";
import HeadSet from "components/head-set";
import HeaderBlogPost from "components/header-content/header-blog-post";
import Modal from "components/modal";
import { BlogCommentsSection } from "context/blog-comments-section";
import { useLayout } from "context/layout-context";
import { useUser } from "context/user-context";
import { find, isEqual, isNil, isUndefined, map, size } from "lodash";
import {
  BlogPostStatus,
  IBlogPost,
  IBlogPostComment,
} from "models/backend/blog-models";
import { IDiscordUserLookup } from "models/backend/discord-models";
import { IPage } from "models/page";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { avatarToURL } from "utils/discord-utils";
import { shareContent } from "utils/url-utils";

interface BlogPostProps extends IPage {
  blogPost: IBlogPost;
  comments: IBlogPostComment[];
}

const BlogPost: NextPage<BlogPostProps> = ({ blogPost, comments }) => {
  const layout = useLayout();
  const router = useRouter();

  const [deletePost, setDeletePost] = useState(false);
  const user = useUser();

  const selectedComment = !isUndefined(router.query.c)
    ? find(comments, (comment) => isEqual(comment.commentID, router.query.c))
    : undefined;
  const [selectedLookup, setSelectedLookup] = useState<IDiscordUserLookup>();

  useEffect(() => {
    layout.changeHeader(
      <HeaderBlogPost blogPost={blogPost} />,
      `blog_post_${blogPost.postID}`,
      blogPost.content.thumbnail,
      !isNil(blogPost.content.thumbnail) ? 0 : undefined
    );
    if (selectedComment)
      apiRoutes.discord
        .lookupUser(selectedComment.content.creator)
        .then((res) => (res.success ? setSelectedLookup(res.body) : undefined));
  }, []);

  const handleDeletePost = async () => {
    const res = await apiRoutes.blog.deletePost(blogPost.postID);
    if (res.success) router.push("/blog");
    else console.log(res.message);

    // TODO: Toast
  };

  return (
    <div>
      {!isUndefined(selectedComment) ? (
        <HeadSet
          title={selectedComment.content.title}
          description={selectedComment.content.body}
          image={avatarToURL(selectedLookup)}
        />
      ) : (
        <HeadSet
          title={`Blog: ${blogPost.content.title}`}
          description={`${blogPost.content.description.slice(0, 250)}${
            size(blogPost.content.description) > 250 ? `…` : ``
          }`}
          bigImage
          image={blogPost.content.thumbnail}
        />
      )}
      <BlogMarkdown html body={blogPost.content.body} />
      <hr className="mb-3 mt-10" />
      <div className="flex flex-col items-center justify-center gap-8 px-3 text-darkText dark:text-darkText-darkMode/50 md:flex-row">
        <button
          className="flex flex-row items-center gap-2 border-b border-b-transparent pb-0.5 opacity-75 transition-all ease-in-out hover:border-y-xpBlue hover:text-xpBlue hover:opacity-100"
          onClick={() => {
            shareContent({
              text: `${blogPost.content.description}`,
              title: `Share ${blogPost.content.title}`,
              url: `https://xp-bot.net/blog/${blogPost.postID}`,
            });
          }}
        >
          <FontAwesomeIcon icon={faShareAlt} />
          Share Post
        </button>
        {user.currentUser?.developer && (
          <>
            <span className="hidden md:flex">•</span>
            <div className="flex h-full flex-row items-center gap-3">
              <span
                className="cursor-pointer border-b border-b-transparent pb-0.5 opacity-75 transition-all ease-in-out hover:border-y-xpBlue hover:text-xpBlue"
                onClick={() => {
                  apiRoutes.blog.publishPostToDiscord(blogPost.postID);
                }}
              >
                Post on Discord
              </span>
            </div>
            <span className="hidden md:flex">•</span>
            <div className="flex h-full cursor-pointer flex-row items-center gap-3">
              <span
                className="flex h-full flex-row items-center gap-3 border-b border-b-transparent pb-0.5 opacity-75 transition-all ease-in-out hover:border-y-red-400 hover:text-red-400"
                onClick={() => {
                  setDeletePost(true);
                }}
              >
                <FontAwesomeIcon icon={faWarning} />
                <span>Delete Post</span>
              </span>
            </div>
            <span className="hidden md:flex">•</span>
            <div className="flex h-full cursor-pointer flex-row items-center gap-3">
              <Link
                href={`/blog/editor/${blogPost.postID}`}
                className="flex h-full flex-row items-center gap-3 border-b border-b-transparent pb-0.5 opacity-75 transition-all ease-in-out hover:border-y-red-400 hover:text-red-400"
              >
                <FontAwesomeIcon icon={faPen} />
                <span>Edit Post</span>
              </Link>
            </div>
          </>
        )}
      </div>
      <hr className="mb-10 mt-3" />
      <BlogCommentsSection
        selectedComment={selectedComment}
        comments={map(comments, (comment) => ({
          ...comment,
          childComments: [
            {
              ...comment,
              childComments: [
                { ...comment, childComments: [{ ...comment }] },
                { ...comment, childComments: [{ ...comment }] },
              ],
            },
          ],
        }))}
        blogPost={blogPost}
      />
      <Modal
        title={`Delete "${blogPost.content.title}"?`}
        isOpen={deletePost}
        requestClose={() => {
          setDeletePost(false);
        }}
      >
        <div className="flex flex-col gap-5">
          <p>This is irreversible!</p>
          <ButtonCluster
            isInPanel
            buttons={[
              {
                text: `Cancel`,
                icon: faCross,
                onClick: () => {
                  setDeletePost(false);
                },
              },
              {
                text: `Yes, i want to permanently delete this blog post!`,
                feature: ButtonFeature.danger,
                onClick: handleDeletePost,
                icon: faWarning,
              },
            ]}
          />
        </div>
      </Modal>
    </div>
  );
};

export async function getStaticProps(context: { params: { blogID: string } }) {
  try {
    const blogPost = await apiRoutes.blog.get.specificPost(
      context.params.blogID
    );
    const blogPostComments = await apiRoutes.blog.get.postComments(
      context.params.blogID
    );

    if (
      !blogPost.success ||
      blogPost.body.content.status === BlogPostStatus.DRAFT
    )
      return {
        notFound: true,
        revalidate: 10,
      };
    return {
      props: {
        blogPost: blogPost.body,
        comments: blogPostComments.success ? blogPostComments.body : [],
      },
      revalidate: 10,
    };
  } catch (error) {
    return {
      notFound: true,
      revalidate: 10,
    };
  }
}

export async function getStaticPaths() {
  return {
    paths: [
      {
        params: { blogID: `guide_announcements_1660342055312` },
      },
    ],
    fallback: "blocking",
  };
}

export default BlogPost;
