import { FC } from 'react';

interface IHeaderBlogListProps {}

const HeaderStatus: FC<IHeaderBlogListProps> = () => {
  return (
    <>
      <div className="flex flex-col items-center gap-3 text-center lg:items-start lg:text-start">
        <div className="flex flex-col">
          <h1>Service Status</h1>
          <h4>Current status of all XP related services.</h4>
        </div>
      </div>
    </>
  );
};

export default HeaderStatus;
