// eslint-disable-next-line import/no-cycle
import { faBarChart } from "@fortawesome/free-regular-svg-icons";
import {
  faFastForward,
  faGear,
  faInfoCircle,
  faList12,
  faPeopleGroup,
  faPeopleLine,
  faStop,
  faToggleOn,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { IGuildDetailsContextValues } from "context/guild-details-context";
import { constant } from "lodash";
import dynamic from "next/dynamic";
import { ComponentType } from "react";

import { IXPAPIGuild, IXPAPIUser } from "../../models/backend/xp-models";

export const ServerRoutes: {
  [key: string]: {
    clusterTitleWhenFirst: string;
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    element?: ComponentType<any>;
    icon?: IconDefinition;
    visible: (
      serverAdmin: boolean,
      guild?: IXPAPIGuild,
      user?: IXPAPIUser
    ) => boolean;
    enabled: (
      serverAdmin: boolean,
      guild?: IGuildDetailsContextValues,
      user?: IXPAPIUser
    ) => boolean;
    marginLeft?: boolean;
    link?: string;
  };
} = {
  // logs: {
  //   clusterTitleWhenFirst: `Settings`,
  //   name: 'Logs',
  //   element: dynamic(() => import(`../server-tabs/server-logs`)),
  //   icon: faNewspaper,
  //   // enabled: (admin, guild) => !!guild?.currentXPLogs,
  //   enabled: constant(true),
  //   visible: (admin, guild, user) =>
  //     !!guild?.serverPremium.premium || user?.developer || false,
  // },
  // access: {
  //   name: 'Access Panel',
  //   element: dynamic(() => import(`../server-tabs/server-modules`)),
  //   icon: faGear,
  //   enabled: constant(false),
  // },
  settings: {
    clusterTitleWhenFirst: `Settings`,
    name: "Settings",
    element: dynamic(() => import(`../server-tabs/server-settings`)),
    icon: faGear,
    enabled: constant(true),
    visible: constant(true),
  },
  modules: {
    clusterTitleWhenFirst: `Server Dashboard`,
    name: "Modules",
    element: dynamic(() => import(`../server-tabs/server-modules`)),
    icon: faToggleOn,
    enabled: constant(true),
    visible: constant(true),
    marginLeft: true,
  },
  values: {
    clusterTitleWhenFirst: `Server Dashboard`,
    name: "Values",
    element: dynamic(() => import(`../server-tabs/server-values`)),
    icon: faBarChart,
    enabled: constant(true),
    visible: constant(true),
  },
  loggers: {
    clusterTitleWhenFirst: `Server Dashboard`,
    name: "Loggers",
    element: dynamic(() => import(`../server-tabs/server-loggers`)),
    icon: faInfoCircle,
    enabled: constant(true),
    visible: constant(true),
  },
  roles: {
    clusterTitleWhenFirst: `Server Dashboard`,
    name: "Roles",
    element: dynamic(() => import(`../server-tabs/server-roles`)),
    icon: faPeopleGroup,
    enabled: constant(true),
    visible: constant(true),
  },
  boosts: {
    clusterTitleWhenFirst: `Server Dashboard`,
    name: "Boosts",
    element: dynamic(() => import(`../server-tabs/server-boosts`)),
    icon: faFastForward,
    enabled: constant(true),
    visible: constant(true),
  },
  ignores: {
    clusterTitleWhenFirst: `Server Dashboard`,
    name: "Ignores",
    element: dynamic(() => import(`../server-tabs/server-ignores`)),
    icon: faStop,
    enabled: constant(true),
    visible: constant(true),
  },
  announcements: {
    clusterTitleWhenFirst: `Server Dashboard`,
    name: "Announcements",
    element: dynamic(() => import(`../server-tabs/server-announcements`)),
    icon: faPeopleLine,
    enabled: constant(true),
    visible: constant(true),
  },
  leaderboard: {
    clusterTitleWhenFirst: `External`,
    name: "Leaderboard",
    icon: faList12,
    enabled: constant(true),
    visible: constant(true),
    marginLeft: true,
    link: `/lb/[serverid]`,
  },
};
