import { apiRoutes } from "apis/api-helper";
import BlockButton, { BlockButtonVariant } from "components/block-button";
import BlockInput from "components/block-input";
import BlockTextArea from "components/block-text-area";
import BlogMarkdown from "components/blog-markdown";
import HeaderEditBlogPost from "components/header-content/header-edit-blog-post";
import PageTitle from "components/page-title";
import { ToastItemType } from "components/toast-item";
import { useLayout } from "context/layout-context";
import { useToast } from "context/toast-context";
import { useUser } from "context/user-context";
import { isNil, size, startsWith } from "lodash";
import { BlogPostStatus, IBlogPost } from "models/backend/blog-models";
import { IPage } from "models/page";
import { NextPage } from "next";
import { useRouter } from "next/router";
// eslint-disable-next-line import/no-cycle
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface IBlogPostInputs {
  title: string;
  description: string;
  thumbnail: string;
  body: string;
}

interface UserTabProps extends IPage {
  blogPost?: IBlogPost;
}

const BlogEditor: NextPage<UserTabProps> = ({ blogPost }) => {
  const layout = useLayout();
  const user = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<IBlogPostInputs>();

  const currThumnail = watch(
    `thumbnail`,
    blogPost?.content.thumbnail || "undefined"
  );
  const customThumbnail =
    startsWith(currThumnail, `https://cdn.namespace.media/`) ||
    startsWith(currThumnail, `https://qwq.sh/`) ||
    startsWith(currThumnail, `https://cny.sh/`)
      ? currThumnail
      : undefined;

  const handlePostBlogPost = async (
    data: IBlogPostInputs,
    status: BlogPostStatus
  ) => {
    if (!user.currentUser) return;

    const postData = {
      title: data.title,
      body: data.body,
      creator: user.currentUser.discordUser.id,
      description: data.description,
      thumbnail: data.thumbnail,
      status,
    };

    const apiCall = isNil(blogPost)
      ? apiRoutes.blog.createPost(postData)
      : apiRoutes.blog.updatePost(blogPost.postID, postData);

    const res = await apiCall;

    if (res.success) {
      const route =
        status === BlogPostStatus.DRAFT ? "/blog" : `/blog/${res.body.postID}`;
      toast({
        type: ToastItemType.SUCCESS,
        subject: `Blog Post ${isNil(blogPost) ? "Posted" : "Updated"}`,
        text: `Successfully ${
          isNil(blogPost) ? "posted" : "updated"
        } blogpost ${res.body.postID}.`,
      });
      router.push(route);
    } else {
      console.log(res.message);
      toast({
        type: ToastItemType.ERROR,
        text: "Something went wrong. Please try again later.",
      });
    }
  };

  const postPublicBlogPost: SubmitHandler<IBlogPostInputs> = async (data) => {
    handlePostBlogPost(data, BlogPostStatus.PUBLISHED);
  };
  const postPrivateBlogPost: SubmitHandler<IBlogPostInputs> = async (data) => {
    handlePostBlogPost(data, BlogPostStatus.UNLISTED);
  };
  const postDraftBlogPost: SubmitHandler<IBlogPostInputs> = async (data) => {
    handlePostBlogPost(data, BlogPostStatus.DRAFT);
  };

  useEffect(() => {
    if (user.isLoggedIn && !user.currentUser?.developer) {
      router.push(`/blog`);
    } else
      layout.changeHeader(
        <HeaderEditBlogPost
          title={
            isNil(blogPost)
              ? `Create a new Blog Post`
              : `Edit ${blogPost.content.title}`
          }
          subtitle={`You may use MD or even HTML to write the blog post.`}
        />,
        `edit_blogPost`,
        customThumbnail
      );
  }, [customThumbnail]);

  return (
    <div className=" 2xl:-mx-40">
      <div className="mx-auto w-fit">
        <PageTitle
          title={
            isNil(blogPost)
              ? `Create a new Blog Post`
              : `Edit ${blogPost.content.title}`
          }
        />
      </div>
      {user.currentUser?.developer && (
        <div className="relative left-0 grid h-fit w-full grid-cols-1 gap-5 overflow-auto xl:grid-cols-[1fr_1px_1fr]">
          <div>
            <form
              onSubmit={handleSubmit(postPublicBlogPost)}
              className="flex w-full flex-col gap-5"
            >
              <div className="flex w-full flex-row gap-5">
                <BlockInput
                  registerForm={register(`title`, {
                    required: `A Title is required.`,
                    minLength: {
                      message: `The title needs to be at least 10 charactes long.`,
                      value: 10,
                    },
                    maxLength: {
                      message: `The title can be no longer than 30 charcters.`,
                      value: 50,
                    },
                  })}
                  formError={errors.title}
                  value={blogPost?.content.title}
                  placeholder="Blog Post Title"
                />
                <BlockInput
                  registerForm={register(`thumbnail`, {
                    required: `A Thumbnail is required.`,
                    validate: (string) =>
                      !startsWith(string, `https://cdn.namespace.media/`) &&
                      !startsWith(string, `https://qwq.sh/`)
                        ? `The thumbnail must start with "https://cdn.namespace.media/" or "https://qwq.sh/".`
                        : true,
                  })}
                  formError={errors.thumbnail}
                  value={blogPost?.content.thumbnail}
                  placeholder="Thumbnail Link"
                />
              </div>
              <div className="flex w-full flex-row gap-5">
                <BlockInput
                  registerForm={register(`description`, {
                    required: `A Description is required.`,
                    minLength: {
                      message: `The description needs to be at least 30 charactes long.`,
                      value: 30,
                    },
                    maxLength: {
                      message: `The description can be no longer than 150 charcters.`,
                      value: 150,
                    },
                  })}
                  formError={errors.description}
                  value={blogPost?.content.description}
                  placeholder="Description"
                />
              </div>
              <div className="flex flex-col gap-5">
                <BlockTextArea
                  inputProps={{ className: "text-base" }}
                  value={blogPost?.content.body}
                  placeholder="Blog Post Body"
                  formError={errors.body}
                  registerForm={register(`body`, {
                    required: `A Body is required.`,
                    minLength: {
                      message: `The body needs to be at least 1000 charactes long.`,
                      value: 1000,
                    },
                    maxLength: {
                      message: `The body can be no longer than 10000 charcters.`,
                      value: 10000,
                    },
                  })}
                />
              </div>
              <div className="flex flex-row justify-end gap-2">
                <BlockButton
                  variant={BlockButtonVariant.blog}
                  onClick={handleSubmit(postDraftBlogPost)}
                >
                  Save as Draft
                </BlockButton>
                <BlockButton
                  variant={BlockButtonVariant.blog}
                  onClick={handleSubmit(postPrivateBlogPost)}
                >
                  {isNil(blogPost) ? `Post Unlisted` : `Save & Post Unlisted`}
                </BlockButton>
                <BlockButton variant={BlockButtonVariant.blog} type="submit">
                  {isNil(blogPost) ? `Publish` : `Save & Publish`}
                </BlockButton>
              </div>
            </form>
          </div>
          <div className="hidden h-full w-full bg-input-border xl:flex" />
          <div className="flex flex-col gap-10">
            <div>
              <BlogMarkdown
                html
                body={
                  watch(`body`) || `## Waiting for input...\nJust start typing.`
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const getStaticProps = async (context: {
  params: { postID: string[] };
}) => {
  try {
    let blogPost: IBlogPost | undefined;
    if (size(context.params.postID) === 1) {
      const postRes = await apiRoutes.blog.get.specificPost(
        context.params.postID[0]
      );
      if (postRes.success) blogPost = postRes.body;
      else
        return {
          notFound: true,
          revalidate: 1,
        };
    }

    return {
      props: {
        blogPost: blogPost || null,
      },
      revalidate: 1,
    };
  } catch (error) {
    return {
      notFound: true,
      revalidate: 1,
    };
  }
};

export async function getStaticPaths() {
  const paths = [
    {
      params: {
        postID: [
          "contributing_to_user_safety_and_service_guidelines_1657056506533",
        ],
      },
    },
  ];

  return { paths, fallback: "blocking" };
}

export default BlogEditor;
