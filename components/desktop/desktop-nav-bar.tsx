// eslint-disable-next-line import/no-cycle
import { faPeoplePulling } from "@fortawesome/free-solid-svg-icons";
import BasicPanel from "components/basic-panel";
// eslint-disable-next-line import/no-cycle
import { headerGradientTypes } from "components/header";
import InboxItem from "components/inbox-item";
import { AnimatePresence, motion } from "framer-motion";
import { filter, isEqual, isUndefined, map } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { getRouteParts } from "utils/url-utils";

import { useUser } from "../../context/user-context";
import { avatarToURL } from "../../utils/discord-utils";
import FallBackImage from "../fallback-image";
import { XPLogo } from "../svg/logos";
import TabButton, { ITabButton, TabButtonTheme } from "./tab-button";

enum ExecuteFunctions {
  ToggleInbox = 1,
}

const NavigationItems: ITabButton[] = [
  {
    text: `XP`,
    isActive: (path: string[]) => isUndefined(path[0]),
    isVisible: (user, path) => (user && !isEqual(path[0], `home`)) || false,
    link: `/home`,
    element: <XPLogo />,
  },
  {
    text: `XP`,
    isActive: (path: string[]) => isUndefined(path[0]),
    isVisible: (user) => !user || false,
    link: `/`,
    element: <XPLogo />,
  },
  {
    text: `Blog`,
    isActive: (path: string[]) => isEqual(path[0], `blog`),
    link: `/blog`,
  },
  {
    text: `Invite`,
    isActive: () => false,
    link: `https://get.xp-bot.net/`,
  },
  {
    text: `Premium`,
    isActive: (path: string[]) => isEqual(path[0], `premium`),
    isVisible: (user) => isUndefined(user) || !user?.premium.userPremium,
    link: `/premium`,
  },
  {
    text: `Status`,
    isActive: (path: string[]) => isEqual(path[0], `status`),
    link: `/status`,
  },
  {
    text: `Support`,
    isActive: () => false,
    link: `https://discord.xp-bot.net/`,
    icon: faPeoplePulling,
  },
  {
    text: `Servers`,
    isActive: (path: string[]) => isEqual(path[0], `servers`),
    isVisible: (user) => !isUndefined(user),
    link: `/servers`,
    marginLeft: true,
  },
];

interface DesktopNavBarProps {
  customImage?: string;
  customBlur?: number;
  customGradient?: typeof headerGradientTypes.premium;
}

const DesktopNavBar: FC<DesktopNavBarProps> = () => {
  const user = useUser();
  const router = useRouter();
  const currentPath = getRouteParts(router);
  const useBigHeader =
    isEqual(router.asPath, `/`) || isEqual(router.asPath, `/premium`);

  const [showInbox, setShowInbox] = useState(false);

  const [additionalLinks, setAdditionalLinks] = useState<ITabButton[]>([
    {
      text: `Inbox (1)`,
      isVisible: (u) => !isUndefined(u),
      marginLeft: true,
      executeFunction: ExecuteFunctions.ToggleInbox,
    },
  ]);

  const executeFunction = (functionNumber: ExecuteFunctions) => {
    switch (functionNumber) {
      case ExecuteFunctions.ToggleInbox:
        setShowInbox(!showInbox);
        break;
      default:
        break;
    }
  };

  useEffect(() => {}, [router.asPath]);

  return (
    <div className="relative z-10 -mb-2 hidden h-fit w-full justify-center lg:flex">
      <motion.div
        key={"header"}
        animate={{
          position: "absolute",
          padding: `0px 2.5rem`,
          backdropFilter: "blur(0px)",
          justifyContent: useBigHeader ? `center` : `end`,
        }}
        className={`container top-[27px] z-20 flex w-full flex-row items-center rounded-md border-opacity-[.25] font-normal`}
      >
        {map(
          filter(
            [...NavigationItems, ...additionalLinks],
            (item) =>
              isUndefined(item.isVisible) ||
              item.isVisible(user.currentUser, currentPath)
          ),
          (item) => (
            <div
              className="relative z-30 flex h-fit items-center"
              key={`${item.text}${item.isActive}`}
            >
              {item.marginLeft && (
                <div className="h-6 w-[1px] bg-white opacity-25" />
              )}
              <button
                onClick={
                  item.executeFunction
                    ? () =>
                        item.executeFunction &&
                        executeFunction(item.executeFunction)
                    : undefined
                }
              >
                <TabButton
                  theme={TabButtonTheme.Title}
                  className="p-[12px]"
                  button={{
                    ...item,
                    link: item.executeFunction ? undefined : item.link,
                  }}
                />
              </button>
              {item.executeFunction === ExecuteFunctions.ToggleInbox && (
                <AnimatePresence>
                  {showInbox && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-[calc(100%+20px)] h-full"
                    >
                      <BasicPanel title="Inbox">
                        <div className="flex flex-col gap-2">
                          {map(user.inbox.inboxItems, (inboxItem) => (
                            <InboxItem inboxItem={inboxItem} />
                          ))}
                        </div>
                      </BasicPanel>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          )
        )}

        {user.isLoggedIn ? (
          <Link
            href={
              !user.isLoggedIn
                ? `${process.env.BACKEND_DOMAIN}/discord/login`
                : `/me`
            }
          >
            <div className="ml-3 drop-shadow-md transition ease-in-out hover:scale-95 active:scale-90">
              <FallBackImage
                src={avatarToURL(user.currentUser?.discordUser)}
                className={"aspect-square w-[37px] rounded-full object-cover"}
              />
            </div>
          </Link>
        ) : (
          <>
            <div className="h-6 w-[1px] bg-white opacity-25" />
            <div className="flex items-center" key={`Sign Infalse`}>
              <TabButton
                theme={TabButtonTheme.Title}
                className="p-[12px]"
                button={{
                  text: `Sign In`,
                  link: `${process.env.BACKEND_DOMAIN}/discord/login`,
                }}
              />
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default DesktopNavBar;
