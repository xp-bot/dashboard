import { AnimateSharedLayout } from 'framer-motion';
import { map } from 'lodash';
import { FC } from 'react';

import TabButton, { ITabButton, TabButtonTheme } from './tab-button';

interface TabBarProps {
  buttons: ITabButton[];
}

const TabBar: FC<TabBarProps> = ({ buttons }) => {
  return (
    <AnimateSharedLayout>
      <div className="hidden lg:block">
        <div className="container -mt-8 flex w-full max-w-full flex-row items-center justify-center">
          {map(buttons, (button) => (
            <div
              className="flex items-center"
              key={`${button.text}${button.isActive}`}
            >
              {button.marginLeft && (
                <div className="mx-[12px] h-4 w-[1px] bg-darkText opacity-25 dark:bg-darkText-darkMode" />
              )}
              <TabButton
                className="whitespace-nowrap p-[12px]"
                theme={TabButtonTheme.Page}
                button={button}
              />
            </div>
          ))}
        </div>
        <hr className="mt-3 w-full" />
      </div>
    </AnimateSharedLayout>
  );
};

export default TabBar;
