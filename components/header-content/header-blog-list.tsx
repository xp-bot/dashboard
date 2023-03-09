import { FC } from 'react';

interface IHeaderBlogListProps {}

const HeaderBlogList: FC<IHeaderBlogListProps> = () => {
  return (
    <>
      <div className="flex flex-col items-center text-center lg:items-start lg:text-start">
        <h1>Official XP Blog</h1>
        <h4>
          An outlet for any thoughts from the XP dev team, XP updates or for
          information related to XP in general.
        </h4>
      </div>
    </>
  );
};

export default HeaderBlogList;
