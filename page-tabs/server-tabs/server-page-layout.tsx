import { FC, ReactNode } from 'react';

interface IServerPageLayout {
  children: ReactNode;
}

const ServerPageLayout: FC<IServerPageLayout> = ({ children }) => {
  return <div className="flex flex-col gap-10">{children}</div>;
};

export default ServerPageLayout;
