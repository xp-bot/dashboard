import useWindowSize from './use-window-size';

const screens = {
  tiny: 300,
  sm: 330,
  smm: 450,
  md: 728,
  lg: 900,
  xl: 1180,
};

export default function useBreakpoints() {
  const windowSize = useWindowSize();
  const width = windowSize.width ? windowSize.width : 0;
  const breakpoints = {
    isTiny: width >= screens.tiny,
    isSm: width >= screens.sm,
    isSmm: width >= screens.smm,
    isMd: width >= screens.md,
    isLg: width >= screens.lg,
    isXl: width >= screens.xl,
  };

  return breakpoints;
}
