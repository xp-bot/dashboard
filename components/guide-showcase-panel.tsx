import { FC } from 'react';

import FallBackImage from './fallback-image';

interface GuideShowcasePanelProps {
  title: string;
  subtitle: string;
  image: string;
}

const GuideShowcasePanel: FC<GuideShowcasePanelProps> = ({ image }) => (
  <div className="relative flex w-fit grow flex-col overflow-hidden rounded-md bg-panelBack shadow-lg dark:bg-panelBack-darkMode">
    <div className="h-[100px] w-full overflow-hidden rounded-md">
      <FallBackImage
        className="left-0 top-0 h-full w-full object-cover"
        src={image}
        alt={'jeje'}
      />
    </div>
    <div className="p-3">
      <h3 className="text-darkText dark:text-darkText-darkMode">
        <p>{/* {title} */}Guide: Modules</p>
      </h3>
      <h5 className="text-darkText opacity-75 dark:text-darkText-darkMode">
        <p>{/* {subtitle} */}Learn about how to master Modules</p>
      </h5>
    </div>
  </div>
);

export default GuideShowcasePanel;
