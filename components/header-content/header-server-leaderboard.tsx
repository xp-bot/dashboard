import { isUndefined } from 'lodash';
import { IXPServersPremium } from 'models/backend/xp-models';
import { FC } from 'react';

import FallBackImage from '../fallback-image';
import { guildIconToURL } from '../../utils/discord-utils';

interface HeaderServerLeaderboardProps {
  guild: {
    id: string;
    icon: string | null;
    name: string;
  };
  premium?: IXPServersPremium;
}

const HeaderServerLeaderboard: FC<HeaderServerLeaderboardProps> = ({
  guild,
  premium,
}) => {
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
        <h4>Most active users of {guild.name}.</h4>
      </div>
    </div>
  );
};

export default HeaderServerLeaderboard;
