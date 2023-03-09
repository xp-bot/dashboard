import { HTMLMotionProps } from 'framer-motion';

const MotionListProps: HTMLMotionProps<'div'> = {
  layout: true,
  // initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.8, opacity: 0 },
  transition: { type: 'spring' },
};

export { MotionListProps };
