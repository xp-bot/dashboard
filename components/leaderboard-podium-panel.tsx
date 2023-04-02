import { apiRoutes } from 'apis/api-helper';
import { isUndefined } from 'lodash';
import { IDiscordUserLookup } from 'models/backend/discord-models';
import { IXPLeaderboardUser } from 'models/backend/xp-models';
import { FC, useEffect, useState } from 'react';
import { avatarToURL, userBannerToURL } from 'utils/discord-utils';
import { calculateLevel, formatNumber } from 'utils/text-utils';

import FallBackImage from './fallback-image';

interface LeaderboardPodiumPanelProps {
  user: IXPLeaderboardUser;
  rank?: number;
  requestEdit?: () => void;
  hideBanner?: boolean;
  isAdmin?: boolean;
}

export enum BasicPanelVariant {
  inPanel,
}

const variantToStye = (variant?: BasicPanelVariant) => {
  const className = ``;

  switch (variant) {
    default:
      return className;
  }
};

const LeaderboardPodiumPanel: FC<LeaderboardPodiumPanelProps> = ({
  user,
  rank,
  requestEdit,
  hideBanner,
  isAdmin,
}) => {
  const [hovering, setHovering] = useState(false);
  const [fetchedUser, setFetchedUser] = useState<
    IDiscordUserLookup | undefined
  >();

  useEffect(() => {
    const fetch = async () => {
      const res = await apiRoutes.discord.lookupUser(user.id);
      if (!res.success) return;
      setFetchedUser(res.body);
    };
    fetch();
  }, []);

  return (
    <button
      type="button"
      onClick={isAdmin ? requestEdit : undefined}
      onMouseEnter={() => {
        isAdmin && setHovering(true);
      }}
      onMouseLeave={() => {
        isAdmin && setHovering(false);
      }}
      className={`relative flex h-fit ${
        isUndefined(requestEdit)
          ? `cursor-default`
          : `${isAdmin ? `` : `cursor-default`}`
      } ${
        rank === 1
          ? `w-full max-w-full md:w-[726px] xl:w-[353px]`
          : `w-full md:w-[353px]`
      } grow-0 flex-col items-center overflow-hidden rounded-md border bg-panelBack text-darkText shadow-md transition ease-in-out ${
        isAdmin ? `hover:-translate-y-1` : ``
      } dark:bg-panelBack-darkMode dark:text-darkText-darkMode ${variantToStye()}`}
    >
      {!hideBanner && (
        <div
          className={`hidden ${
            rank === 1
              ? `h-40 w-full lg:aspect-[425/200] xl:h-auto`
              : `aspect-[425/200]`
          } z-0 w-full overflow-hidden md:flex`}
        >
          {fetchedUser && (
            <FallBackImage
              src={
                fetchedUser.banner
                  ? userBannerToURL(fetchedUser, undefined, !hovering)
                  : avatarToURL(fetchedUser, 64)
              }
              className={`${
                fetchedUser.banner ? `` : `scale-125 blur-md`
              } h-full w-full object-cover`}
            />
          )}
        </div>
      )}
      <div className="relative flex w-full flex-row flex-wrap justify-center gap-5 p-6">
        <div
          className={`absolute left-0 top-0 hidden h-full w-full scale-110 opacity-25 blur-xl dark:md:flex`}
        >
          {fetchedUser && (
            <FallBackImage
              src={
                fetchedUser.banner
                  ? userBannerToURL(fetchedUser, undefined, !hovering)
                  : avatarToURL(fetchedUser, 64)
              }
              className={`${
                fetchedUser.banner ? `` : `scale-125 blur-md`
              } h-full w-full object-cover`}
            />
          )}
        </div>
        <div
          className={`${
            hideBanner ? `` : `md:mt-[-60px] md:w-[120px]`
          } hidden aspect-square w-[50px] shrink-0 overflow-hidden rounded-full shadow-rankingAvater md:flex `}
        >
          <FallBackImage
            key={`podium-banner-${fetchedUser?.id}`}
            src={avatarToURL(fetchedUser, 256)}
            className="h-full w-full object-cover blur-0"
          />
        </div>

        <div className="z-10 flex w-full shrink-0 flex-col items-center justify-center gap-3 truncate">
          <div
            className={`flex flex-row flex-wrap items-center justify-center gap-5`}
          >
            <div
              className={`aspect-square w-[50px] shrink-0 overflow-hidden rounded-full shadow-md md:mt-[-60px] md:hidden md:w-[120px]`}
            >
              <FallBackImage
                src={avatarToURL(fetchedUser, 256)}
                className="h-full w-full object-cover"
              />
            </div>

            <h2 className="m-0 truncate text-center">
              {rank && <>#{rank} • </>}
              {fetchedUser?.username || user.username}
            </h2>
          </div>
          <hr className="w-4/5 " />
          <div className="grid grid-cols-2 opacity-75">
            <span>Lvl. {formatNumber(calculateLevel(user.xp))}</span>
            <span>{formatNumber(user.xp)} xp</span>
          </div>
        </div>
      </div>
      {/* Floating */}
      {/* <div className="absolute bottom-0 left-0 w-full">
        <div className="my-4 flex flex-row gap-5 bg-white p-6">
          <div className="mt-[-60px] aspect-square w-[120px] shrink-0 overflow-hidden rounded-full shadow-rankingAvater">
            <FallBackImage
              src={avatarToURL(fetchedUser, 256)}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-3 truncate">
            <h2 className="m-0 w-full truncate text-center">{user.username}</h2>
            <div className="grid grid-cols-2 opacity-75">
              <span>Lvl. {formatNumber(calculateLevel(user.xp))}</span>
              <span>{formatNumber(user.xp)} xp</span>
            </div>
          </div>
        </div>
      </div> */}
    </button>
  );
};

export default LeaderboardPodiumPanel;
