import { isEqual } from 'lodash';
import { useRouter } from 'next/router';
import { FC } from 'react';

interface WavePageProps {
  children: JSX.Element | JSX.Element[];
}

const WavePage: FC<WavePageProps> = ({ children }) => {
  const router = useRouter();
  return (
    <div className="z-30 h-full">
      <div className="h-full w-full bg-wavePage pb-10 pt-7 dark:bg-wavePage-darkMode">
        <div
          className={`${
            isEqual(router.asPath, `/`) || isEqual(router.asPath, `/premium`)
              ? ``
              : `container lg:px-10`
          } mx-auto -mt-4 box-border`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default WavePage;
