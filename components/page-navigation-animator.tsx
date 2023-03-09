import { AnimatePresence, motion } from 'framer-motion';
import { useMediaQuery } from 'hooks/use-media-query';
import { useRouter } from 'next/router';
import { FC, ReactNode } from 'react';

interface IPageNavigationAnimatorProps {
  children: ReactNode;
  customKey?: string;
}

const PageNavigationAnimator: FC<IPageNavigationAnimatorProps> = ({
  children,
  customKey,
}) => {
  const windowIsSmall = useMediaQuery('(min-width: 900px)');
  const router = useRouter();
  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        key={customKey || `animator_${router.asPath}`}
        variants={{
          hidden: {
            x: !windowIsSmall ? -20 : 0,
            y: !windowIsSmall ? 0 : -20,
            opacity: 0,
          },
          show: { y: 0, x: 0, opacity: 1, transition: { duration: 0.3 } },
          close: {
            x: !windowIsSmall ? 20 : 0,
            y: !windowIsSmall ? 0 : 20,
            opacity: 0,
            transition: { duration: 0.3 },
          },
        }}
        initial="hidden"
        animate="show"
        exit="close"
        transition={{ type: 'just' }}
        className="relative z-20"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageNavigationAnimator;
