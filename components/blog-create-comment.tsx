// eslint-disable-next-line import/no-cycle
import { useCommentsSection } from 'context/blog-comments-section';
import { useUser } from 'context/user-context';
import { FC } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { avatarToURL } from 'utils/discord-utils';

import BlockButton, { BlockButtonVariant } from './block-button';
import BlockInput from './block-input';
import BlockTextArea from './block-text-area';
import FallBackImage from './fallback-image';

interface IBlogCreateCommentProps {}

const BlogCreateComment: FC<IBlogCreateCommentProps> = () => {
  const user = useUser();
  const commentsSection = useCommentsSection();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ title: string; body: string }>();

  const createComment: SubmitHandler<{
    title: string;
    body: string;
  }> = ({ body, title }) => {
    commentsSection.postComment({
      title,
      body,
      creator: user.currentUser?.discordUser.id || ``,
    });
  };

  return (
    <>
      {user.isLoggedIn ? (
        <form
          onSubmit={handleSubmit(createComment)}
          className="flex flex-col items-start gap-5 p-[8px] md:flex-row md:gap-10 md:pr-0"
        >
          <div className="w-20 shrink-0">
            <FallBackImage
              className="aspect-square w-full rounded-full shadow-rankingAvater dark:shadow-none"
              src={avatarToURL(user.currentUser?.discordUser, 512)}
            />
          </div>
          <div className="relative flex min-h-[5rem] w-full max-w-full grow flex-col justify-center gap-2 font-serif text-darkText dark:text-darkText-darkMode">
            <BlockInput
              inputProps={{ maxLength: 30 }}
              placeholder="Title your Comment"
              formError={errors.title}
              registerForm={register('title', {
                required: `A Title is required.`,
                minLength: {
                  value: 5,
                  message: `Please enter at least 5 characters.`,
                },
              })}
            />
            <span>
              <BlockTextArea
                inputProps={{ maxLength: 250 }}
                placeholder="What do you think about the blog post..."
                registerForm={register('body', {
                  required: `A Description is required.`,
                  minLength: {
                    value: 25,
                    message: `Please enter at least 25 characters.`,
                  },
                })}
                formError={errors.body}
              />
              <span className="opacity-50">
                <br />- {user.currentUser?.discordUser.username}
              </span>
            </span>
            <BlockButton
              type="submit"
              variant={BlockButtonVariant.blog}
              className="absolute -bottom-3 right-0"
            >
              Post Comment
            </BlockButton>
          </div>
        </form>
      ) : (
        <p className="text-darkText opacity-25 dark:text-darkText-darkMode">
          You need to be logged in to post a comment.
        </p>
      )}
    </>
  );
};

export default BlogCreateComment;
