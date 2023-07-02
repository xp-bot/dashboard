import { faSave } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useMediaQuery } from "hooks/use-media-query";
import { isUndefined, replace, size } from "lodash";
import {
  IDiscordChannel,
  IDiscordGuildsRequest,
  IDiscordRole,
} from "models/backend/discord-models";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { apiRoutes } from "../apis/api-helper";
import {
  IServerSettingsBackground,
  IXPChange,
  IXPDBLog,
  IXPGuild,
  IXPServersPremium,
} from "../models/backend/xp-models";
import { useUser } from "./user-context";

export interface IGuildDetailsContextValues {
  guildID: string;
  currentXPGuild?: IXPGuild;
  currentDiscordGuild?: IDiscordGuildsRequest;
  currentServerPremium?: IXPServersPremium;
  currentBackground?: IServerSettingsBackground;
  currentDiscordChannels?: IDiscordChannel[];
  currentDiscordRoles?: IDiscordRole[];
  currentXPLogs?: IXPDBLog[];
  updateGuild: (
    whatChanged?: { name: string; oldValue: string; newValue: string },
    guild?: IXPGuild,
    background?: IServerSettingsBackground
  ) => Promise<boolean>;
  saveGuild: () => Promise<void>;
  unsavedChanges: boolean;
  savingInProgress: boolean;
}

export const GuildDetailsContext =
  React.createContext<IGuildDetailsContextValues>({
    guildID: "",
    updateGuild: async () => false,
    saveGuild: async () => {},
    unsavedChanges: false,
    savingInProgress: false,
  });

interface IGuildDetailsContextProviderProps {
  children: JSX.Element[] | JSX.Element;
  guildID: string;
}

export function GuildDetailsContextProvider({
  children,
  guildID,
}: IGuildDetailsContextProviderProps): React.ReactElement {
  const router = useRouter();

  const isLg = useMediaQuery("(min-width: 900px)");

  const [currentXPGuild, setCurrentXPGuild] = useState<IXPGuild | undefined>();
  const [currentXPLogs /* , setCurrentXPLogs */] = useState<
    IXPDBLog[] | undefined
  >();
  const [currentBackground, setCurrentBackground] = useState<
    IServerSettingsBackground | undefined
  >();
  const [currentDiscordChannels, setCurrentDiscordChannels] = useState<
    IDiscordChannel[] | undefined
  >();
  const [currentDiscordRoles, setCurrentDiscordRoles] = useState<
    IDiscordRole[] | undefined
  >();
  const [currentDiscordGuild, setCurrentDiscordGuild] = useState<
    IDiscordGuildsRequest | undefined
  >();
  const [currentServerPremium, setCurrentServerPremium] =
    useState<IXPServersPremium>();
  const [savingInProgress, setSavingInProgress] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const [changes, setChanges] = useState<IXPChange[]>([]);
  const user = useUser();

  async function fetchGuild(): Promise<boolean> {
    // Semi Guild
    const semiGuildRes = await apiRoutes.semi.guild.get(guildID);
    if (!semiGuildRes.success) return false;

    // Server Background
    const serverBackgroundRes =
      await apiRoutes.xp.guild.settings.background.get(guildID);
    if (!serverBackgroundRes.success) return false;

    serverBackgroundRes.body.url = replace(
      serverBackgroundRes.body.url,
      `www.no.com`,
      ``
    );

    // Channels & Roles
    const [channels, roles] = await Promise.all([
      apiRoutes.discord.guild.channels(guildID),
      apiRoutes.discord.guild.roles(guildID),
    ]);
    if (!channels.success || !roles.success) return false;

    setCurrentXPGuild(semiGuildRes.body.xpGuild);
    setCurrentServerPremium(semiGuildRes.body.serverPremium);
    setCurrentDiscordGuild(semiGuildRes.body.discordGuild);
    setCurrentBackground(serverBackgroundRes.body);
    setCurrentDiscordRoles(roles.body);
    setCurrentDiscordChannels(channels.body);

    // const serverLogsRes = await apiRoutes.xp.guild.getLogs(guildID, );

    // if (serverLogsRes.success) setCurrentXPLogs(serverLogsRes.body);
    return true;
  }

  async function updateGuild(
    whatChanged?: IXPChange,
    guild?: IXPGuild,
    background?: IServerSettingsBackground
  ): Promise<boolean> {
    if (currentXPGuild) {
      if (!isUndefined(guild)) {
        setCurrentXPGuild(guild);
        setUnsavedChanges(true);
      }

      if (!isUndefined(background)) {
        const res = await apiRoutes.xp.guild.settings.background.post(
          guildID,
          background
        );
        if (res.success) {
          setCurrentBackground(background);
        }
      }

      if (whatChanged) setChanges([...changes, whatChanged]);
      return true;
    }
    return false;
  }

  async function saveGuild() {
    setSavingInProgress(true);
    try {
      if (!isUndefined(currentXPGuild)) {
        const update = await apiRoutes.xp.guild.update(
          guildID,
          currentXPGuild,
          size(changes) > 0 && user.currentUser
            ? { changedBy: user.currentUser?.discordUser.username, changes }
            : undefined
        );
        if (update) setUnsavedChanges(false);

        setSavingInProgress(false);
      }
    } catch {
      setSavingInProgress(false);
    }
  }

  useEffect(() => {
    fetchGuild().then((res) => {
      if (!res) router.push(`/home`);
    });
  }, []);

  return (
    <GuildDetailsContext.Provider
      value={{
        guildID,
        saveGuild,
        savingInProgress,
        updateGuild,
        currentDiscordGuild,
        currentServerPremium,
        currentXPGuild,
        currentBackground,
        unsavedChanges,
        currentDiscordRoles,
        currentDiscordChannels,
        currentXPLogs,
      }}
    >
      <>
        {children}
        <motion.div
          initial={{ y: "4rem", opacity: 0 }}
          animate={
            unsavedChanges
              ? { y: isLg ? "-2rem" : "-8rem", opacity: 1 }
              : { y: "4rem", opacity: 0 }
          }
          className={`pointer-events-none fixed bottom-0 left-0 z-30 flex h-20 w-full justify-center`}
        >
          <div className={`container mx-auto box-border px-10`}>
            <div className={`relative h-full w-full`}>
              <div
                onClick={() => {
                  saveGuild();
                }}
                className="pointer-events-auto absolute bottom-0 right-0 flex h-14 w-14 cursor-pointer items-center justify-center gap-2 rounded-full bg-green-500 p-3 px-5 text-lg text-white ring-green-600/25 drop-shadow-lg transition ease-in-out active:bg-green-600 active:ring lg:right-5 lg:h-10 lg:w-fit lg:text-base lg:hover:-translate-y-1"
              >
                <FontAwesomeIcon icon={faSave} />
                {isLg && ` Save Server`}
              </div>
            </div>
          </div>
        </motion.div>
      </>
    </GuildDetailsContext.Provider>
  );
}

export const useServerDetails = (): IGuildDetailsContextValues =>
  React.useContext(GuildDetailsContext);
