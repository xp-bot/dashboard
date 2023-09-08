import ButtonCluster from "components/button-cluster";
import TabBar from "components/desktop/tab-bar";
import HeadSet from "components/head-set";
import HeaderServer from "components/header-content/header-server";
import PageNavigationAnimator from "components/page-navigation-animator";
import {
  GuildDetailsContextProvider,
  useServerDetails,
} from "context/guild-details-context";
import { useLayout } from "context/layout-context";
import { useUser } from "context/user-context";
import { AnimatePresence, motion } from "framer-motion";
import {
  filter,
  includes,
  isEqual,
  isNil,
  isUndefined,
  keys,
  map,
  replace,
  size,
} from "lodash";
import { IPage } from "models/page";
import { NextPage } from "next";
import { useRouter } from "next/router";
import ServerPageLayout from "page-tabs/server-tabs/server-page-layout";
import { ServerRoutes } from "page-tabs/server-tabs/server-routes";
// eslint-disable-next-line import/no-cycle
import { FC, useEffect } from "react";
import { splitServerArrayByMarginLeft } from "utils/object-utils";

interface ServerTabProps extends IPage {
  tab: keyof typeof ServerRoutes; // Future Mo: Does not work with shallow routing (In TabBar). That's why we're using router.query.tab below.
}

const ContextHeader: FC = () => {
  const guild = useServerDetails();
  const layout = useLayout();
  useEffect(() => {
    if (isUndefined(guild.currentDiscordGuild))
      layout.changeHeader(<h1>We are getting ready...</h1>, `server_loading`);
    else {
      const background = guild.currentBackground;
      layout.changeHeader(
        <HeaderServer
          guild={guild.currentDiscordGuild}
          premium={guild.currentServerPremium}
        />,
        `server_loaded`,
        !isNil(background) && background.enabled ? background.url : undefined,
        isNil(background) || !background.enabled ? undefined : background.blur,
        undefined,
        !isNil(background)
      );
    }
  }, [guild.currentDiscordGuild, guild.currentBackground]);
  return <></>;
};

const MenuContent = () => {
  const router = useRouter();
  const guild = useServerDetails();
  const user = useUser();

  const mixedGuild =
    guild.currentXPGuild &&
    guild.currentDiscordGuild &&
    guild.currentServerPremium
      ? {
          xpGuild: guild.currentXPGuild,
          discordGuild: guild.currentDiscordGuild,
          serverPremium: guild.currentServerPremium,
        }
      : undefined;

  const tabName = router.query.tab ? router.query.tab[0] : null;
  const serverid = (router.query.serverid || `0`) as string;
  const tabData = ServerRoutes[tabName || `settings`];

  const tab = tabName
    ? ((tabData.visible(true, mixedGuild, user.currentUser) &&
      tabData.enabled(true, guild, user.currentUser)
        ? tabName
        : `settings`) as keyof typeof ServerRoutes)
    : null;

  return (
    <>
      <HeadSet
        title={
          guild.currentDiscordGuild?.name
            ? `${tabData.name} - ${guild.currentDiscordGuild?.name}`
            : `Loading...`
        }
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={`guildDetailsGuild${
            !isUndefined(guild.currentXPGuild) ? `Loaded` : `Unloaded`
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {!isUndefined(guild.currentXPGuild) ? (
            <>
              <div className="hidden lg:block">
                <TabBar
                  buttons={[
                    ...map(
                      filter(Object.entries(ServerRoutes), (r) =>
                        r[1].visible(true, mixedGuild, user.currentUser)
                      ),
                      ([
                        tabPath,
                        { name, marginLeft, link, enabled, icon },
                      ]) => {
                        return {
                          text: name,
                          isActive: () => {
                            return isEqual(tabPath, tab);
                          },
                          disabled: !enabled(true, guild, user.currentUser),
                          shallowRouting: true,
                          marginLeft,
                          link: link
                            ? replace(
                                link,
                                `[serverid]`,
                                guild.currentDiscordGuild?.id || ``
                              )
                            : `/servers/${serverid}/${tabPath}`,
                          icon: link ? icon : undefined,
                        };
                      }
                    ),
                  ]}
                />
              </div>
              <PageNavigationAnimator>
                {tab && tabData.element ? (
                  <>
                    <ServerPageLayout>
                      <tabData.element />
                    </ServerPageLayout>
                  </>
                ) : (
                  <ServerPageLayout>
                    <div>
                      <div className="flex flex-col gap-5">
                        {map(
                          splitServerArrayByMarginLeft(
                            filter(Object.entries(ServerRoutes), (r) =>
                              r[1].visible(
                                true, // TODO: Always admin
                                mixedGuild,
                                user.currentUser
                              )
                            )
                          ),
                          (buttons, idx) => (
                            <ButtonCluster
                              key={`server-id-button-cluster-${idx}`}
                              title={buttons[0][1].clusterTitleWhenFirst}
                              buttons={map(
                                buttons,
                                ([tabPath, { name, icon, link, enabled }]) => {
                                  return {
                                    text: name,
                                    disabled: !enabled(
                                      true,
                                      guild,
                                      user.currentUser
                                    ),
                                    isActive: () => false,
                                    link: link
                                      ? replace(
                                          link,
                                          `[serverid]`,
                                          guild.currentDiscordGuild?.id || ``
                                        )
                                      : `/servers/${guild.currentDiscordGuild?.id}/${tabPath}`,
                                    icon,
                                  };
                                }
                              )}
                            />
                          )
                        )}
                      </div>
                    </div>
                  </ServerPageLayout>
                )}
              </PageNavigationAnimator>
            </>
          ) : (
            <div className="flex w-full items-center justify-center"></div>
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
};

const ServerTab: NextPage<ServerTabProps> = () => {
  const router = useRouter();
  const serverid = (router.query.serverid || `0`) as string;
  return (
    <>
      <GuildDetailsContextProvider guildID={serverid}>
        <ContextHeader />
        <MenuContent />
      </GuildDetailsContextProvider>
    </>
  );
};

export const getStaticProps = async (context: {
  params: { serverid: string; tab: string[] };
}) => {
  if (
    !isUndefined(context.params.tab) &&
    (!includes(keys(ServerRoutes), context.params.tab[0]) ||
      size(context.params.tab) > 1 ||
      !ServerRoutes[context.params.tab[0]].element)
  ) {
    return {
      notFound: true,
      revalidate: 1,
    };
  }

  try {
    return {
      props: {
        serverid: context.params.serverid,
        tab: context.params.tab ? context.params.tab[0] : null,
      },
      revalidate: 1,
    };
  } catch (error) {
    return {
      notFound: true,
      revalidate: 1,
    };
  }
};

export const getStaticPaths = async () => {
  const paths = [
    {
      params: {
        serverid: "012345678912345678",
        tab: map(ServerRoutes, (k, v) => v),
      },
    },
  ];

  return { paths, fallback: "blocking" };
};

export default ServerTab;
