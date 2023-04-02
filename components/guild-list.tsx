import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { map, size } from 'lodash';
import Link from 'next/link';
import { FC, MouseEventHandler, useState } from 'react';

import { IDiscordGuildsRequest } from '../models/backend/discord-models';
import { guildIconToURL } from '../utils/discord-utils';
import FallBackImage from './fallback-image';

interface IMobileGuildListItem {
  guild: IDiscordGuildsRequest;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export enum ButtonFeature {
  'danger' = 'bg-button-red text-lightText',
}

interface GuildListProps {
  buttons: IMobileGuildListItem[];
  title?: string;
}

const GuildList: FC<GuildListProps> = ({ buttons, title }) => {
  const [hover, setHover] = useState<string | undefined>();

  return (
    <div>
      {title && <h2 className="mb-4 mt-2">{title}</h2>}
      <div className="flex flex-col items-end overflow-hidden rounded-xl bg-panelBack text-darkText shadow-md dark:bg-panelBack-darkMode dark:text-darkText-darkMode dark:shadow-none md:hidden">
        {map(buttons, ({ guild, onClick }, idx) => (
          <div key={`guild-list-item-${guild.id}-${idx}`} className="w-full">
            <Link
              className="w-full"
              href={
                guild.xpInvited
                  ? `/servers/${guild.id}`
                  : `https://discord.com/oauth2/authorize?client_id=706935674800177193&permissions=395607140544&scope=bot%20applications.commands&guild_id=${guild.id}`
              }
            >
              <button
                onClick={onClick}
                className={`relative flex w-full flex-row items-center py-[11px] text-left active:bg-button-state-pressed active:dark:bg-button-state-pressed-darkMode`}
              >
                <div className="mx-4 hidden h-[60px] w-[60px] shrink-0 tiny:flex">
                  <FallBackImage
                    className=" aspect-square w-[60px] rounded-full object-cover shadow-lg "
                    src={guildIconToURL(guild, 256)}
                  />
                </div>
                <div className="ml-4 flex flex-col overflow-hidden break-words tiny:ml-0">
                  <span className="-mb-1 font-montserrat text-[20px] line-clamp-1">
                    {guild.name}
                  </span>
                  <h4 className="text-darkText dark:text-darkText-darkMode">
                    {guild.xpInvited ? `Invited` : `Not Invited`}
                    {guild.premium.premium && ` • Premium`}
                  </h4>
                </div>
                <div className="min-w-[30px] shrink-0"></div>

                <FontAwesomeIcon
                  className={`absolute right-4 text-button-arrow`}
                  icon={faAngleRight}
                />
              </button>
            </Link>
            {idx < size(buttons) - 1 && (
              <hr className="relative left-[90px] w-full border-[.5px]" />
            )}
          </div>
        ))}
      </div>
      <div className="hidden w-full grid-cols-2 items-end gap-10 text-darkText dark:text-darkText-darkMode md:grid xl:grid-cols-3">
        {map(buttons, ({ guild, onClick }, idx) => (
          <div
            key={`guild-list-item-desktop-${guild.id}-${idx}`}
            onMouseEnter={() => {
              setHover(guild.id);
            }}
            onMouseLeave={() => {
              setHover(undefined);
            }}
            className="group relative shrink-0 grow"
          >
            <Link
              className=" relative shrink-0 grow"
              href={
                guild.xpInvited
                  ? `/servers/${guild.id}`
                  : `https://discord.com/oauth2/authorize?client_id=706935674800177193&permissions=395607140544&scope=bot%20applications.commands&guild_id=${guild.id}`
              }
            >
              <button
                onClick={onClick}
                className={`relative z-10 my-6 flex w-full flex-row items-center rounded-lg border bg-panelBack py-[11px] text-left transition ease-in-out active:bg-button-state-pressed group-focus-within:translate-x-2 group-hover:translate-x-1 group-active:translate-x-2 dark:bg-panelBack-darkMode active:dark:bg-button-state-pressed-darkMode`}
              >
                <div className="absolute -left-1 top-0 mx-4 flex aspect-square h-[100%] shrink-0 scale-150 overflow-hidden rounded-md bg-gray-700 drop-shadow-md transition-all ease-in-out">
                  <FallBackImage
                    className={`h-full w-full object-cover`}
                    src={guildIconToURL(guild, 256)}
                  />
                </div>
                <div className="ml-4 flex shrink grow flex-col overflow-hidden break-words pl-28 tiny:ml-0">
                  <span className="-mb-1 font-montserrat text-[20px] line-clamp-1">
                    {guild.name}
                  </span>
                  <h4 className="truncate text-darkText dark:text-darkText-darkMode">
                    {guild.xpInvited ? `Invited` : `Not Invited`}
                    {guild.premium.premium && ` • Premium`}
                  </h4>
                </div>
                <div className="min-w-[30px] shrink-0"></div>

                <FontAwesomeIcon
                  className={`absolute right-4 text-button-arrow`}
                  icon={faAngleRight}
                />
              </button>
            </Link>
            {guild.xpInvited && (
              <Link href={`/lb/${guild.id}`}>
                <button
                  onClick={onClick}
                  className={`${
                    hover === guild.id ? `` : `-translate-y-10`
                  } absolute left-[112px] mb-6 mt-[-35px] flex w-fit flex-row items-center rounded-b-lg border bg-panelBack py-[11px] pt-5 text-left transition-all ease-in-out hover:mt-[-30px] active:bg-button-state-pressed group-focus-within:translate-x-2 group-hover:translate-x-1 group-active:translate-x-2 dark:bg-panelBack-darkMode active:dark:bg-button-state-pressed-darkMode`}
                >
                  <div className="flex shrink grow flex-col overflow-hidden break-words pl-4">
                    <h4 className="text-darkText dark:text-darkText-darkMode">
                      Leaderboard
                    </h4>
                  </div>
                  <div className="min-w-[30px] shrink-0"></div>

                  <FontAwesomeIcon
                    className={`absolute right-4 text-button-arrow`}
                    icon={faAngleRight}
                  />
                </button>
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuildList;
