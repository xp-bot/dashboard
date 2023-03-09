import Header, { headerGradientTypes } from 'components/header';
import HeaderNavigationAnimator from 'components/header-navigation-animator';
import PageNavigationAnimator from 'components/page-navigation-animator';
import { isNumber, size, split } from 'lodash';
import { useRouter } from 'next/router';
import { createContext, useContext, useState } from 'react';
import { getAverageImageColors } from 'utils/image-utils';

interface ILayoutContextValues {
  changeHeader: (
    state: JSX.Element,
    headerKey: string,
    customImage?: string,
    customBlur?: number,
    customGradient?: typeof headerGradientTypes.premium,
    setImageColorsAsGradient?: boolean
  ) => void;
}

export const LayoutContext = createContext<ILayoutContextValues>({
  changeHeader: () => {},
});

interface ILayoutContextProviderProps {
  children: JSX.Element[] | JSX.Element;
}

export function LayoutContextProvider({
  children,
}: ILayoutContextProviderProps): React.ReactElement {
  const [headerStateKey, setHeaderStateKey] = useState(`home`);
  const [headerState, setHeaderState] = useState(<></>);
  const [headerImage, setHeaderImage] = useState<string>();
  const [headerBlur, setHeaderBlur] = useState<number>();
  const [headerGradient, setHeaderGradient] =
    useState<typeof headerGradientTypes.premium>();

  const router = useRouter();

  const rootRoute = split(router.asPath, `/`)[1];

  const changeHeader = async (
    state: JSX.Element,
    headerKey: string,
    customImage?: string,
    customBlur?: number,
    customGradient?: typeof headerGradientTypes.premium,
    setImageColorsAsGradient?: boolean
  ) => {
    const colors =
      setImageColorsAsGradient && customImage
        ? await getAverageImageColors(customImage)
        : undefined;

    setHeaderState(state);
    setHeaderImage(customImage || undefined);
    setHeaderStateKey(headerKey);
    setHeaderGradient(
      colors && setImageColorsAsGradient && customImage && size(colors) > 1
        ? { bottomLeft: colors[0].hex, topRight: colors[size(colors) - 1].hex }
        : customGradient || undefined
    );

    setHeaderBlur(isNumber(customBlur) ? customBlur : undefined);
  };

  return (
    <LayoutContext.Provider
      value={{
        changeHeader,
      }}
    >
      <Header
        customGradient={headerGradient}
        customBlur={headerBlur}
        customImage={headerImage}
      >
        <HeaderNavigationAnimator headerKey={`header_${headerStateKey}`}>
          {headerState}
        </HeaderNavigationAnimator>
      </Header>

      <PageNavigationAnimator
        customKey={
          rootRoute === `blog`
            ? undefined
            : rootRoute === `servers`
            ? `layout_${rootRoute}_${split(router.asPath, `/`)[2] || ``}`
            : `layout_${rootRoute || `home`}`
        }
      >
        {children}
      </PageNavigationAnimator>
    </LayoutContext.Provider>
  );
}

export const useLayout = (): ILayoutContextValues => useContext(LayoutContext);
