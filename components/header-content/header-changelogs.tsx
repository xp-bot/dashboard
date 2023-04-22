import { FC } from 'react';

interface IHeaderChangelogsProps {}

const HeaderChangelogs: FC<IHeaderChangelogsProps> = () => {
  return (
    <>
      <div className="flex flex-col items-center text-center lg:items-start lg:text-start">
        <h1>Dashboard Changelogs</h1>
        <h4>
          Stay up-to-date with the latest updates, bug fixes, and feature
          enhancements for your favorite dashboard with our comprehensive
          changelogs.
        </h4>
      </div>
    </>
  );
};

export default HeaderChangelogs;
