import { isUndefined } from 'lodash';
import { IDiscordPartialGuild } from 'models/backend/discord-models';
import { IXPServersPremium } from 'models/backend/xp-models';
import { FC } from 'react';

import { guildIconToURL } from '../../utils/discord-utils';
import FallBackImage from '../fallback-image';

interface HeaderServerProps {
  guild: IDiscordPartialGuild;
  premium?: IXPServersPremium;
}

const HeaderServer: FC<HeaderServerProps> = ({ guild, premium }) => {
  return (
    <div className="mt-2 flex w-full flex-col items-center justify-center gap-2 lg:flex-row lg:justify-start lg:gap-5">
      {!isUndefined(guild) && (
        <FallBackImage
          src={guildIconToURL(guild, 512)}
          className={`${
            premium?.premium
              ? `border-b-[4px] border-xpBlue-premium drop-shadow-premium`
              : `drop-shadow-lg`
          } aspect-square w-[141px] rounded-md object-cover `}
        />
      )}

      <div className="text-center drop-shadow-sm lg:text-left">
        <h1>{guild.name}</h1>
        <h4>This is the Server Dashboard of {guild.name}.</h4>
      </div>
    </div>
  );
};

export default HeaderServer;
