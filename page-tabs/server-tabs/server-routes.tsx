// eslint-disable-next-line import/no-cycle
import { faBarChart } from '@fortawesome/free-regular-svg-icons';
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
} from '@fortawesome/free-solid-svg-icons';
import { IGuildDetailsContextValues } from 'context/guild-details-context';
import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

import { IXPAPIGuild, IXPAPIUser } from '../../models/backend/xp-models';

export const ServerRoutes: {
  [key: string]: {
    clusterTitleWhenFirst: string;
    name: string;
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
  //   enabled: () => true,
  //   visible: (admin, guild, user) =>
  //     !!guild?.serverPremium.premium || user?.developer || false,
  // },
  // access: {
  //   name: 'Access Panel',
  //   element: dynamic(() => import(`../server-tabs/server-modules`)),
  //   icon: faGear,
  //   enabled: () => false,
  // },
  settings: {
    clusterTitleWhenFirst: `Settings`,
    name: 'Settings',
    element: dynamic(() => import(`../server-tabs/server-settings`)),
    icon: faGear,
    enabled: () => true,
    visible: () => true,
  },
  modules: {
    clusterTitleWhenFirst: `Server Dashboard`,
    name: 'Modules',
    element: dynamic(() => import(`../server-tabs/server-modules`)),
    icon: faToggleOn,
    enabled: () => true,
    visible: () => true,
    marginLeft: true,
  },
  values: {
    clusterTitleWhenFirst: `Server Dashboard`,
    name: 'Values',
    element: dynamic(() => import(`../server-tabs/server-values`)),
    icon: faBarChart,
    enabled: () => true,
    visible: () => true,
  },
  loggers: {
    clusterTitleWhenFirst: `Server Dashboard`,
    name: 'Loggers',
    element: dynamic(() => import(`../server-tabs/server-loggers`)),
    icon: faInfoCircle,
    enabled: () => true,
    visible: () => true,
  },
  roles: {
    clusterTitleWhenFirst: `Server Dashboard`,
    name: 'Roles',
    element: dynamic(() => import(`../server-tabs/server-roles`)),
    icon: faPeopleGroup,
    enabled: () => true,
    visible: () => true,
  },
  boosts: {
    clusterTitleWhenFirst: `Server Dashboard`,
    name: 'Boosts',
    element: dynamic(() => import(`../server-tabs/server-boosts`)),
    icon: faFastForward,
    enabled: () => true,
    visible: () => true,
  },
  ignores: {
    clusterTitleWhenFirst: `Server Dashboard`,
    name: 'Ignores',
    element: dynamic(() => import(`../server-tabs/server-ignores`)),
    icon: faStop,
    enabled: () => true,
    visible: () => true,
  },
  announcements: {
    clusterTitleWhenFirst: `Server Dashboard`,
    name: 'Announcements',
    element: dynamic(() => import(`../server-tabs/server-announcements`)),
    icon: faPeopleLine,
    enabled: () => true,
    visible: () => true,
  },
  leaderboard: {
    clusterTitleWhenFirst: `External`,
    name: 'Leaderboard',
    icon: faList12,
    enabled: () => true,
    visible: () => true,
    marginLeft: true,
    link: `/lb/[serverid]`,
  },
};
