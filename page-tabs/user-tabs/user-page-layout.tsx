import { FC, ReactNode } from 'react';

interface IUserPageLayout {
  children: ReactNode;
}

const UserPageLayout: FC<IUserPageLayout> = ({ children }) => {
  return <div className="flex flex-col gap-10">{children}</div>;
};

export default UserPageLayout;
