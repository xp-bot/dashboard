import { AnimatePresence, motion } from 'framer-motion';
import { filter, isEqual, map, size } from 'lodash';
import { FC, ReactNode } from 'react';
import { MotionListProps } from 'utils/animation-utils';

import EmptyPanel from './empty-panel';

interface IAnimatedDivList {
  children: { element: ReactNode; key: string }[];
  emptyMessage: string;
}

const AnimatedDivList: FC<IAnimatedDivList> = ({ children, emptyMessage }) => {
  const list = filter(children, (child) => !isEqual(child.key, ``));
  return (
    <AnimatePresence mode="popLayout">
      {size(list) > 0 ? (
        map(list, (element, idx) => {
          return (
            <motion.div
              layout={'position'}
              {...MotionListProps}
              key={element.key}
              className="flex w-full flex-col items-center gap-5"
            >
              {element.element}
              {!isEqual(idx, size(list) - 1) && (
                <hr className="w-[80%] md:hidden" />
              )}
            </motion.div>
          );
        })
      ) : (
        <motion.div
          key={`motion-div-list-empty`}
          layout={'position'}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring' }}
          className="w-full"
        >
          <EmptyPanel text={emptyMessage} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedDivList;
