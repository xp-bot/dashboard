import { AnimatePresence, motion } from 'framer-motion';
import { FC, ReactNode } from 'react';

interface IHeaderNavigationAnimatorProps {
  children: ReactNode;
  headerKey: string;
}

const HeaderNavigationAnimator: FC<IHeaderNavigationAnimatorProps> = ({
  children,
  headerKey,
}) => {
  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        key={headerKey}
        variants={{
          hidden: {
            opacity: 0,
          },
          show: { opacity: 1, transition: { duration: 0.3 } },
          close: {
            opacity: 0,
            transition: { duration: 0.3 },
          },
        }}
        initial="hidden"
        animate="show"
        exit="close"
        transition={{ type: 'just' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default HeaderNavigationAnimator;
