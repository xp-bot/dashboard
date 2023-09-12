// eslint-disable-next-line import/no-cycle
import Header, { headerGradientTypes } from "components/header";
import HeaderNavigationAnimator from "components/header-navigation-animator";
import InboxItem from "components/inbox-item";
import InboxPopout from "components/inbox-popout";
import PageNavigationAnimator from "components/page-navigation-animator";
import { isNumber, map, size, split } from "lodash";
import { useRouter } from "next/router";
import { createContext, useContext, useState } from "react";
import { getAverageImageColors } from "utils/image-utils";

import { useUser } from "./user-context";

interface ILayoutContextValues {
  changeHeader: (
    state: JSX.Element,
    headerKey: string,
    customImage?: string,
    customBlur?: number,
    customGradient?: typeof headerGradientTypes.premium,
    setImageColorsAsGradient?: boolean
  ) => void;
  toggleInbox: () => void;
}

export const LayoutContext = createContext<ILayoutContextValues>({
  changeHeader: () => {},
  toggleInbox: () => {},
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

  const user = useUser();

  const [inboxOpen, setInboxOpen] = useState(false);

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
        toggleInbox: () => {
          setInboxOpen(!inboxOpen);
        },
      }}
    >
      <div className="flex h-fit min-h-full flex-col overflow-y-auto overflow-x-hidden">
        <Header
          customGradient={headerGradient}
          customBlur={headerBlur}
          customImage={headerImage}
        >
          <HeaderNavigationAnimator headerKey={`header_${headerStateKey}`}>
            {headerState}
          </HeaderNavigationAnimator>
        </Header>

        <div className="grow bg-wavePage dark:bg-wavePage-darkMode">
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
        </div>
      </div>
      <InboxPopout
        inboxOpen={inboxOpen}
        requestClose={() => {
          setInboxOpen(false);
        }}
      />
      <div className="fixed bottom-5 right-5 flex w-80 flex-col gap-5">
        {map(user.inbox.inboxItems, (inboxItem) => (
          <InboxItem inboxItem={inboxItem} />
        ))}
      </div>
    </LayoutContext.Provider>
  );
}

export const useLayout = (): ILayoutContextValues => useContext(LayoutContext);
