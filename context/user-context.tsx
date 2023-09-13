import { XPLoading } from "components/svg/logos";
import { AnimatePresence, motion } from "framer-motion";
import { isEqual, size } from "lodash";
import { IInboxItem } from "models/backend/inbox-interfaces";
import { ISocketIO } from "models/backend/socket-models";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

import { apiRoutes } from "../apis/api-helper";
import { IApiFailure, IApiSuccess } from "../models/api-models";
import { IDiscordGuildsRequest } from "../models/backend/discord-models";
import {
  IXPAPIUser,
  IXPGuild,
  IXPUser,
  IXPUserPremiumServers,
} from "../models/backend/xp-models";

export enum LoginStatus {
  "checking",
  "loggedIn",
  "notLoggedIn",
}

interface IUserContextValues {
  isLoggedIn: boolean;
  loginStatus: LoginStatus;
  currentUser?: IXPAPIUser;
  discordGuilds: IDiscordGuildsRequest[];
  logout: () => void;
  fetchDiscordGuilds: () => Promise<boolean>;
  updateUser: (user: IXPUser) => Promise<boolean>;
  updatePremiumServers: (
    servers: Partial<IXPUserPremiumServers>
  ) => Promise<boolean>;

  socketIO: {
    currentSocket?: ISocketIO<{}>;
  };

  loading: {
    discordGuilds: boolean;
  };

  inbox: {
    inboxItems: IInboxItem[];
    markInboxItemRead: (inboxItem: IInboxItem) => void;
    markAllInboxItemsRead: () => void;
    dismissInboxItem: (inboxItem: IInboxItem) => void;
    dismissAllInboxItems: () => void;
    fetchInbox: () => void;
  };

  guild: {
    fetchXPGuild: (
      guildID: string
    ) => Promise<IApiSuccess<IXPGuild> | IApiFailure>;
    updateXPGuild: (
      guildID: string,
      xpGuild: Partial<IXPGuild>
    ) => Promise<IApiSuccess<{}> | IApiFailure>;
  };

  debug: {
    guildRequests: number;
    meRequests: number;
  };
}

export const UserContext = createContext<IUserContextValues>({
  isLoggedIn: false,
  loginStatus: LoginStatus.checking,
  discordGuilds: [],
  logout: async () => false,
  fetchDiscordGuilds: async () => false,

  updateUser: async () => false,
  updatePremiumServers: async () => false,

  socketIO: {},

  loading: {
    discordGuilds: true,
  },

  inbox: {
    inboxItems: [],
    markInboxItemRead: () => {},
    markAllInboxItemsRead: () => {},
    dismissInboxItem: () => {},
    dismissAllInboxItems: () => {},
    fetchInbox: async () => {},
  },

  guild: {
    fetchXPGuild: async () => ({ message: ``, success: false }) as IApiFailure,
    updateXPGuild: async () => ({ message: ``, success: false }) as IApiFailure,
  },

  debug: {
    guildRequests: 0,
    meRequests: 0,
  },
});

interface IUserContextProviderProps {
  children: JSX.Element[] | JSX.Element;
}

export function UserContextProvider({
  children,
}: IUserContextProviderProps): React.ReactElement {
  const router = useRouter();
  const [loginStatus, setLoginStatus] = useState<LoginStatus>(
    LoginStatus.checking
  );

  const [discordGuilds, setDiscordGuilds] = useState<IDiscordGuildsRequest[]>(
    []
  );
  const [currentUser, setCurrentUser] = useState<IXPAPIUser | undefined>();

  const [inboxItems, setInboxItems] = useState<IInboxItem[]>([]);

  /* SOCKET */
  const [socket, setSocket] = useState<ISocketIO<{}> | undefined>();
  /* SOCKET */

  /* DEBUG */
  const [guildRequests, setGuildRequests] = useState(0);
  const [meRequests, setMeRequests] = useState(0);
  /* DEBUG */

  /* Loading */
  const [isDiscordGuildsLoading, setIsDiscordGuildsLoading] = useState(false);
  const [isMeLoading, setIsMeLoading] = useState(false);
  /* Loading */

  async function logout() {
    router.push(`${process.env.BACKEND_DOMAIN}/discord/logout`);
  }

  async function fetchDiscordGuilds() {
    if (size(discordGuilds) > 0 || isDiscordGuildsLoading) return true;
    setIsDiscordGuildsLoading(true);
    try {
      setGuildRequests(guildRequests + 1);
      const res = await apiRoutes.discord.guilds(false);
      if (!res.success) return false;
      setDiscordGuilds(res.body);
      setIsDiscordGuildsLoading(false);
      return true;
    } catch (error) {
      setIsDiscordGuildsLoading(false);
      return false;
    }
  }

  async function fetchUser() {
    if (isMeLoading) return;
    setIsMeLoading(true);
    try {
      setMeRequests(meRequests + 1);
      const res = await apiRoutes.semi.me();
      if (res.success) {
        setCurrentUser(res.body);
        setLoginStatus(LoginStatus.loggedIn);
      } else if (isEqual(loginStatus, LoginStatus.loggedIn)) logout();
      else setLoginStatus(LoginStatus.notLoggedIn);
    } catch {
      setLoginStatus(LoginStatus.notLoggedIn);
    }
    setIsMeLoading(false);
  }

  async function updateUser(user: IXPUser) {
    if (currentUser) {
      const res = await apiRoutes.xp.me.post(user);
      if (res.success) {
        setCurrentUser({ ...currentUser, xpUser: { ...res.body } });
      }
      return res.success;
    }
    return false;
  }

  async function updatePremiumServers(servers: Partial<IXPUserPremiumServers>) {
    if (currentUser) {
      const res = await apiRoutes.xp.me.premium.postServers(servers);
      if (res.success) {
        setCurrentUser({ ...currentUser, premium: { ...res.body } });
      }
      return res.success;
    }
    return false;
  }

  async function fetchXPGuild(guildID: string) {
    try {
      const res = await apiRoutes.xp.guild.get(guildID);
      return res;
    } catch (error) {
      return {
        message: `Could not be fetched.`,
        success: false,
      } as IApiFailure;
    }
  }

  async function updateXPGuild(guildID: string, body: Partial<IXPGuild>) {
    try {
      const res = await apiRoutes.xp.guild.update(guildID, body);
      return res;
    } catch (error) {
      return {
        message: `Could not be updated.`,
        success: false,
      } as IApiFailure;
    }
  }

  async function fetchInbox() {
    try {
      const res = await apiRoutes.inbox.getInbox();
      if (res.success) setInboxItems(res.body);
    } catch (error) {
      setInboxItems([]);
    }
  }

  const markInboxItemRead = async (inboxItem: IInboxItem) => {
    try {
      // eslint-disable-next-line no-underscore-dangle
      const res = await apiRoutes.inbox.markRead(inboxItem._id);
      if (res.success) fetchInbox();
      // eslint-disable-next-line no-empty
    } catch (error) {}
  };

  const markAllInboxItemsRead = async () => {
    try {
      // eslint-disable-next-line no-underscore-dangle
      const res = await apiRoutes.inbox.markAllRead();
      if (res.success) fetchInbox();
      // eslint-disable-next-line no-empty
    } catch (error) {}
  };

  const dismissInboxItem = async (inboxItem: IInboxItem) => {
    try {
      // eslint-disable-next-line no-underscore-dangle
      const res = await apiRoutes.inbox.dismissItem(inboxItem._id);
      if (res.success) fetchInbox();
      // eslint-disable-next-line no-empty
    } catch (error) {}
  };

  const dismissAllInboxItems = async () => {
    try {
      const res = await apiRoutes.inbox.dismissAllItems();
      if (res.success) fetchInbox();
      // eslint-disable-next-line no-empty
    } catch (error) {}
  };

  useEffect(() => {
    setSocket(io(process.env.BACKEND_DOMAIN || ``, { reconnection: true }));
  }, []);

  useEffect(() => {
    if (socket) fetchUser();
  }, [socket]);

  useEffect(() => {
    if (loginStatus === LoginStatus.loggedIn) {
      if (isEqual(router.asPath, `/`)) router.push(`/home`);
      fetchDiscordGuilds();
      fetchInbox();
    } else if (
      loginStatus === LoginStatus.notLoggedIn &&
      isEqual(router.asPath, `/home`)
    )
      router.push(`/`);
  }, [loginStatus]);

  return (
    <UserContext.Provider
      value={{
        isLoggedIn: isEqual(loginStatus, LoginStatus.loggedIn),
        loginStatus,
        currentUser,
        discordGuilds,
        fetchDiscordGuilds,
        logout,
        debug: { guildRequests, meRequests },
        updateUser,
        updatePremiumServers,
        socketIO: {
          currentSocket: socket,
        },
        guild: {
          fetchXPGuild,
          updateXPGuild,
        },
        loading: {
          discordGuilds: isDiscordGuildsLoading,
        },
        inbox: {
          inboxItems,
          markInboxItemRead,
          markAllInboxItemsRead,
          dismissInboxItem,
          dismissAllInboxItems,
          fetchInbox,
        },
      }}
    >
      <div
        key={`motion-transition-main-page`}
        className={`${
          isEqual(loginStatus, LoginStatus.checking) ? `fixed left-0 top-0` : ``
        }`}
      >
        {children}
      </div>
      <AnimatePresence>
        {isEqual(loginStatus, LoginStatus.checking) && (
          <motion.div
            key={`motion-transition-main-page-loading`}
            animate={"base"}
            exit="exit"
            initial="initial"
            variants={{
              initial: { opacity: 1 },
              exit: { opacity: 0 },
              base: { opacity: 1, transition: { delay: 0.25 } },
            }}
            className={`fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center overflow-hidden bg-wavePage dark:bg-wavePage-darkMode`}
          >
            <motion.div
              variants={{
                base: { opacity: 1 },
                initial: { opacity: 0 },
              }}
            >
              <XPLoading />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </UserContext.Provider>
  );
}

export const useUser = (): IUserContextValues => useContext(UserContext);
