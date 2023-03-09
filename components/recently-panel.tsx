import Link from 'next/link';
import { FC } from 'react';

import { IDiscordPartialGuild } from '../models/backend/discord-models';
import { guildIconToURL } from '../utils/discord-utils';
import FallBackImage from './fallback-image';

interface RecentlyPanelProps {
  guild: IDiscordPartialGuild;
}

const RecentlyPanel: FC<RecentlyPanelProps> = ({ guild }) => {
  return (
    <Link
      href={`/servers/${guild.id}`}
      className="group flex aspect-square w-[95px] select-none flex-col gap-3 overflow-hidden rounded-md border bg-panelBack/5 p-1 transition-all ease-in-out hover:-translate-y-1 hover:bg-panelBack/10 focus:translate-y-0 active:translate-y-0"
    >
      <FallBackImage
        className="h-full w-full rounded-md shadow-lg"
        src={guildIconToURL(guild, 256)}
      />
      {/* <h4 className="w-full break-words px-2 text-center hyphens-auto line-clamp-1">
        {guild.name}
      </h4> */}
    </Link>
  );
};

export default RecentlyPanel;
