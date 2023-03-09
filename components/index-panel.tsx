import useBreakpoints from 'hooks/use-breakpoints';
import { isUndefined } from 'lodash';
import { FC, ReactNode } from 'react';

import FallBackImage from './fallback-image';

interface IIndexPanelProps {
  image?: string;
  title: string;
  description: string | ReactNode;
  rightImage?: boolean;
  requestImageZoom?: (image: string) => void;
}

const IndexHighlight: FC<IIndexPanelProps> = ({
  description,
  image,
  title,
  rightImage,
  requestImageZoom,
}) => {
  const bp = useBreakpoints();
  return (
    <div className="h-full w-full grow text-darkText dark:text-darkText-darkMode">
      <div
        style={{ direction: rightImage && bp.isLg ? 'rtl' : `ltr` }}
        className={`flex flex-col items-center justify-start gap-5 text-center lg:grid lg:text-start ${
          rightImage ? `lg:grid-flow-dense` : ``
        } h-full grid-cols-2 lg:gap-10`}
      >
        {image && (
          <div className="hidden h-full w-full p-8 lg:relative lg:flex lg:aspect-video">
            <FallBackImage
              onClick={() => {
                requestImageZoom && requestImageZoom(image);
              }}
              className={`h-full w-full rounded-md border border-input-border object-cover shadow-md dark:border-input-border-darkMode ${
                requestImageZoom ? `lg:cursor-pointer` : ``
              }`}
              src={image}
            />
          </div>
        )}

        <div
          style={{ direction: 'ltr' }}
          className={` z-10 flex h-full flex-col justify-center p-8 ${
            isUndefined(image) ? `col-span-2 text-center` : ``
          } ${
            rightImage
              ? `${isUndefined(image) ? `text-center` : `lg:text-end`} `
              : ``
          }`}
        >
          <h1 className="text-[5vw] text-darkText dark:text-darkText-darkMode md:text-2xl lg:text-4xl">
            {title}
          </h1>
          <span className="text-[3vw] text-darkText opacity-75 dark:text-darkText-darkMode md:text-lg lg:text-xl">
            {description}
          </span>
        </div>
      </div>
    </div>
  );
};

export default IndexHighlight;
