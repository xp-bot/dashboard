// eslint-disable-next-line import/no-cycle
import {
  faGear,
  faHammer,
  faIdCard,
  faPlusCircle,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { constant, isUndefined } from "lodash";
import { IXPAPIUser } from "models/backend/xp-models";
import dynamic from "next/dynamic";
import { ComponentType } from "react";

export const UserRoutes: {
  [key: string]: {
    clusterTitleWhenFirst: string;
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    element: ComponentType<any>;
    icon?: IconDefinition;
    enabled: (user?: IXPAPIUser) => boolean;
    marginLeft?: boolean;
  };
} = {
  settings: {
    clusterTitleWhenFirst: `User Dashboard`,
    name: "Settings",
    element: dynamic(() => import(`../user-tabs/user-settings`)),
    icon: faGear,
    enabled: constant(false),
  },
  rankingcard: {
    clusterTitleWhenFirst: `User Dashboard`,
    name: "Ranking Card",
    element: dynamic(() => import(`../user-tabs/user-ranking-card`)),
    icon: faIdCard,
    enabled: constant(true),
  },
  premium: {
    clusterTitleWhenFirst: `User Dashboard`,
    name: "Manage Premium",
    element: dynamic(() => import(`../user-tabs/user-manage-premium`)),
    icon: faPlusCircle,
    enabled: (user) =>
      isUndefined(user)
        ? false
        : user.premium.voteFreeCount > 0 || user.premium.serverPremium > 0,
  },
  bans: {
    clusterTitleWhenFirst: `Administration`,
    name: "Ban System",
    element: dynamic(() => import(`../user-tabs/user-bans`)),
    icon: faHammer,
    marginLeft: true,
    enabled: (user) => user?.developer || false,
  },
  incidents: {
    clusterTitleWhenFirst: `Administration`,
    name: "Incidents",
    element: dynamic(() => import(`../user-tabs/user-incidents`)),
    icon: faHammer,
    enabled: (user) => user?.developer || false,
  },
  messages: {
    clusterTitleWhenFirst: `Debugging`,
    name: "Test Messaging",
    element: dynamic(() => import(`../user-tabs/user-test-messaging`)),
    icon: faHammer,
    enabled: (user) => user?.developer || false,
  },
};
