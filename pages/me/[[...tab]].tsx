import {
  faHeartPulse,
  faInbox,
  faInfoCircle,
  faPowerOff,
  faUserSecret,
} from "@fortawesome/free-solid-svg-icons";
import changelogs from "changelogs";
import ButtonCluster from "components/button-cluster";
import TabBar from "components/desktop/tab-bar";
import HeadSet from "components/head-set";
import PageNavigationAnimator from "components/page-navigation-animator";
import PageTitle from "components/page-title";
import Select from "components/select";
import { useLayout } from "context/layout-context";
import { useUser } from "context/user-context";
import { UserDetailsContextProvider } from "context/user-details-context";
import { useAccessRestriction } from "hooks/use-access-restriction";
import {
  filter,
  includes,
  isEqual,
  isNil,
  isUndefined,
  keys,
  map,
  size,
} from "lodash";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import UserPageLayout from "page-tabs/user-tabs/user-page-layout";
// eslint-disable-next-line import/no-cycle
import { UserRoutes } from "page-tabs/user-tabs/user-routes";
import { useEffect } from "react";
import { userBannerToURL } from "utils/discord-utils";
import { splitUserArrayByMarginLeft } from "utils/object-utils";

import HeaderUserProfile from "../../components/header-content/header-user-profile";
import { IPage } from "../../models/page";

interface UserTabProps extends IPage {
  tab: keyof typeof UserRoutes; // Future Mo: Does not work with shallow routing (In TabBar). That's why we're using router.query.tab below.
}

const UserTab: NextPage<UserTabProps> = () => {
  const router = useRouter();
  const layout = useLayout();
  const user = useUser();
  const theme = useTheme();
  useAccessRestriction(true, false);

  const tabName = router.query.tab ? router.query.tab[0] : null;
  const tab = tabName
    ? ((UserRoutes[tabName].enabled(user.currentUser)
        ? tabName
        : `settings`) as keyof typeof UserRoutes)
    : null;
  const tabData = UserRoutes[tab || `settings`];

  useEffect(() => {
    user.isLoggedIn &&
      layout.changeHeader(
        <HeaderUserProfile subtitle="This is where you can edit your profile" />,
        `user`,
        !isNil(user.currentUser?.discordUser.banner)
          ? userBannerToURL(user.currentUser?.discordUser, 512)
          : undefined,
        undefined,
        undefined,
        true
      );
  }, [user.isLoggedIn]);

  if (!user.isLoggedIn) return <></>;
  return (
    <>
      <HeadSet title={`${tabData.name}`} />
      <div className="hidden lg:block">
        <TabBar
          layoutId="user-tab-bar"
          buttons={[
            ...map(
              filter(Object.entries(UserRoutes), (r) =>
                r[1].enabled(user.currentUser)
              ),
              ([tabPath, { name, marginLeft }]) => {
                return {
                  text: name,
                  isActive: () => {
                    return isEqual(tabPath, tab);
                  },
                  shallowRouting: true,

                  marginLeft,
                  link: `/me/${tabPath}`,
                };
              }
            ),
          ]}
        />
      </div>
      <UserDetailsContextProvider>
        <PageNavigationAnimator>
          {tab ? (
            <>
              <UserPageLayout>
                <tabData.element />
              </UserPageLayout>
            </>
          ) : (
            <UserPageLayout>
              <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-5">
                  {map(
                    splitUserArrayByMarginLeft(
                      filter(Object.entries(UserRoutes), (r) =>
                        r[1].enabled(user.currentUser)
                      )
                    ),
                    (buttons, idx) => (
                      <ButtonCluster
                        key={`button-cluster-me-tabs-${idx}`}
                        title={buttons[0][1].clusterTitleWhenFirst}
                        buttons={map(buttons, ([tabPath, { name, icon }]) => {
                          return {
                            text: name,
                            isActive: () => false,
                            link: `/me/${tabPath}`,
                            shallowLink: true,
                            icon,
                          };
                        })}
                      />
                    )
                  )}
                  <ButtonCluster
                    title={`Updates`}
                    buttons={[
                      {
                        text: `Inbox`,
                        icon: faInbox,
                        onClick: () => {
                          layout.toggleInbox(true);
                        },
                      },
                      {
                        text: `Changelogs`,
                        link: `/changes`,
                        icon: faInfoCircle,
                      },
                      // ...(window.Notification.permission === `granted`
                      //   ? []
                      //   : [
                      //       {
                      //         text: `Stay Updated`,
                      //         icon: faInfoCircle,
                      //         onClick: () => {
                      //           window.Notification.requestPermission();
                      //         },
                      //       },
                      //     ]),
                    ]}
                  />
                  <ButtonCluster
                    title={`Legal`}
                    buttons={[
                      {
                        text: `Privacy Policy`,
                        link: `/legal/privacy`,
                        icon: faUserSecret,
                      },
                      {
                        text: `Safety Guidelines`,
                        link: `/blog/contributing_to_user_safety_and_service_guidelines_1657056506533`,
                        icon: faHeartPulse,
                      },
                    ]}
                  />
                  <div className="w-full">
                    <PageTitle title={"Appearance"} disableArrow />
                    <Select
                      onChange={(v) => theme.setTheme(v)}
                      options={[
                        {
                          id: "system",
                          title: "Use System Settings",
                          selected: isEqual(theme.theme, `system`),
                        },
                        {
                          id: "light",
                          title: "Light Mode",
                          selected: isEqual(theme.theme, `light`),
                        },
                        {
                          id: "dark",
                          title: "Dark Mode",
                          selected: isEqual(theme.theme, `dark`),
                        },
                      ]}
                    />
                  </div>
                  <ButtonCluster
                    title="System"
                    buttons={[
                      {
                        text: `Log-Out`,
                        link: `${process.env.BACKEND_DOMAIN}/discord/logout`,
                        icon: faPowerOff,
                      },
                    ]}
                  />
                </div>
                <div className="text-center">
                  <h4 className="text-darkText dark:text-darkText-darkMode">
                    XP Dashboard v.{keys(changelogs)[size(changelogs) - 1]}
                  </h4>
                  <h4 className="text-darkText dark:text-darkText-darkMode">
                    ❤️ Made with Love ❤️
                  </h4>
                </div>
              </div>
            </UserPageLayout>
          )}
        </PageNavigationAnimator>
      </UserDetailsContextProvider>
    </>
  );
};

export const getStaticProps = async (context: {
  params: { tab: string[] };
}) => {
  if (
    !isUndefined(context.params.tab) &&
    (!includes(keys(UserRoutes), context.params.tab[0]) ||
      size(context.params.tab) > 1)
  ) {
    return {
      notFound: true,
      revalidate: 1,
    };
  }

  try {
    return {
      props: {
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

export async function getStaticPaths() {
  const paths = [
    {
      params: {
        tab: map(UserRoutes, (k, v) => v),
      },
    },
  ];

  return { paths, fallback: "blocking" };
}

export default UserTab;
