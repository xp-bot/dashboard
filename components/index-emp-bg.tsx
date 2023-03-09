import { FC, ReactNode } from 'react';

interface IIndexEmpBGProps {
  children: ReactNode;
  empBG?: boolean;
}

const IndexEmpBG: FC<IIndexEmpBGProps> = ({ children, empBG }) => {
  return (
    <div className="w-full">
      <div
        className={`left-0 h-full w-full ${
          empBG ? `bg-black/5 dark:bg-white/5` : ``
        }`}
      >
        <div className="container h-full">
          <div className="h-full w-full">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default IndexEmpBG;
