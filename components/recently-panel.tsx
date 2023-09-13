import Link from "next/link";
import { FC } from "react";

import { IDiscordPartialGuild } from "../models/backend/discord-models";
import { guildIconToURL } from "../utils/discord-utils";
import FallBackImage from "./fallback-image";

interface RecentlyPanelProps {
  guild: IDiscordPartialGuild;
}

const RecentlyPanel: FC<RecentlyPanelProps> = ({ guild }) => {
  return (
    <Link
      href={`/servers/${guild.id}`}
      className="peer shrink-0 transition-all duration-200 ease-in-out active:scale-90 md:px-4 md:hover:scale-110 md:hover:px-6 md:active:scale-100"
    >
      <div className="mt-4 flex aspect-square w-20 shrink-0 overflow-hidden rounded-md bg-gray-700 drop-shadow-md focus-within:scale-100 sm:mt-2 sm:w-24">
        <FallBackImage
          className={`h-full w-full object-cover`}
          src={guildIconToURL(guild, 256)}
        />
      </div>
    </Link>
  );
};

export default RecentlyPanel;
