import { FC } from 'react';

interface IHeaderEditBlogPostProps {
  title: string;
  subtitle: string;
}

const HeaderEditBlogPost: FC<IHeaderEditBlogPostProps> = ({
  subtitle,
  title,
}) => {
  return (
    <>
      <div className="flex flex-col items-center text-center lg:items-start lg:text-start">
        <h1>{title}</h1>
        <h4>{subtitle}</h4>
      </div>
    </>
  );
};

export default HeaderEditBlogPost;
