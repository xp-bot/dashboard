import { AnimatePresence, motion } from 'framer-motion';
import useBreakpoints from 'hooks/use-breakpoints';
import { isEqual, isNumber, isUndefined } from 'lodash';
import { useRouter } from 'next/router';
import { FC, ReactNode } from 'react';

// eslint-disable-next-line import/no-cycle
import DesktopNavBar from './desktop/desktop-nav-bar';
import FallBackImage from './fallback-image';
import { BigIndexWave, DesktopWave, MobileWave } from './svg/waves';

export const headerGradientTypes = {
  premium: { bottomLeft: '#de3a3a', topRight: '#e3ac67' },
};

interface HeaderProps {
  children: ReactNode;
  customImage?: string;
  customBlur?: number;
  customGradient?: typeof headerGradientTypes.premium;
}

const Header: FC<HeaderProps> = ({
  children,
  customImage,
  customBlur,
  customGradient,
}) => {
  const router = useRouter();
  const breakpoints = useBreakpoints();
  const useBigHeader =
    isEqual(router.asPath, `/`) || isEqual(router.asPath, `/premium`);
  return (
    <>
      <motion.header
        initial={{
          height: useBigHeader ? (breakpoints.isLg ? `100vh` : 275) : 275,
        }}
        animate={{
          height: useBigHeader ? (breakpoints.isLg ? `100vh` : 275) : 275,
        }}
        transition={{ duration: 0.5 }}
        className={`relative z-20 w-full overflow-hidden`}
      >
        <DesktopNavBar
          customGradient={customGradient}
          customImage={customImage}
        />
        <div className="absolute top-0 left-0 -z-10 h-full w-full">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.75 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              key={
                isUndefined(customGradient)
                  ? `headerGradient_off`
                  : `headerGradieng_${customGradient}`
              }
              style={
                isUndefined(customGradient)
                  ? undefined
                  : {
                      background: `linear-gradient(30deg, ${customGradient.bottomLeft} 0%, ${customGradient.topRight} 100%)`,
                    }
              }
              // eslint-disable-next-line tailwindcss/no-custom-classname
              className="headerGradient absolute top-0 left-0 z-[-1] h-full w-full"
            />
          </AnimatePresence>
          <div
            style={customBlur ? { filter: `blur(${customBlur}px)` } : undefined}
            className="absolute bottom-0 left-0 z-[-2] h-full w-full transition-all ease-in-out"
          >
            <FallBackImage
              // eslint-disable-next-line tailwindcss/no-custom-classname
              className={`headerImage ${
                isNumber(customBlur) && !isUndefined(customImage)
                  ? `${customBlur === 0 ? `scale-100` : `scale-110`}`
                  : `scale-[1.3] blur-[25px]`
              } absolute bottom-0 left-0 my-auto h-full w-full object-cover transition-all ease-in-out`}
              src={customImage || '/images/header.jpg'}
              alt="gugugaga"
              resolution={1920}
            />
          </div>
        </div>
        <div className="container mx-auto flex h-full flex-col justify-center gap-[14px] pb-[10px] lg:px-10">
          {children}
        </div>
        <MobileWave />
        {useBigHeader ? <BigIndexWave /> : <DesktopWave />}
      </motion.header>
    </>
  );
};

export default Header;
