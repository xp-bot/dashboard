import { isEqual } from "lodash";
import { useRouter } from "next/router";
import { FC } from "react";

interface WavePageProps {
  children: JSX.Element | JSX.Element[];
}

const WavePage: FC<WavePageProps> = ({ children }) => {
  const router = useRouter();
  return (
    <div className="z-30 pb-20 lg:pb-0 h-full">
      <div className="h-full w-full pb-10 pt-7">
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
