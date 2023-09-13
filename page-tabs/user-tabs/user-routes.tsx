// eslint-disable-next-line import/no-cycle
import {
  faGear,
  faHammer,
  faIdCard,
  faPlusCircle,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { isUndefined } from "lodash";
import { IXPAPIUser } from "models/backend/xp-models";
import dynamic from "next/dynamic";
import { ComponentType } from "react";

export const UserRoutes: {
  [key: string]: {
    clusterTitleWhenFirst: string;
    name: string;
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
    enabled: () => false,
  },
  rankingcard: {
    clusterTitleWhenFirst: `User Dashboard`,
    name: "Ranking Card",
    element: dynamic(() => import(`../user-tabs/user-ranking-card`)),
    icon: faIdCard,
    enabled: () => true,
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
};
