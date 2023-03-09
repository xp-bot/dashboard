import useBreakpoints from 'hooks/use-breakpoints';
import { isEqual } from 'lodash';
import { IXPLeaderboardUser } from 'models/backend/xp-models';
import Link from 'next/link';
import { FC, useState } from 'react';
import { avatarToURL } from 'utils/discord-utils';
import { calculateLevel, formatNumber } from 'utils/text-utils';

import BlockButton from './block-button';
import FallBackImage from './fallback-image';
import { ArrowDown, ArrowUp, Neutral } from './svg/arrows';

interface LeaderboardPanelProps {
  user: IXPLeaderboardUser;
  requestEdit?: () => void;
  rank: number;
  isAdmin?: boolean;
}

const getArrowPos = (id: string, arrPos: number, pos: number) => {
  return arrPos < pos ? (
    <ArrowDown />
  ) : arrPos > pos ? (
    <ArrowUp />
  ) : (
    <Neutral />
  );
};

const LeaderboardPanel: FC<LeaderboardPanelProps> = ({
  user,
  rank,
  requestEdit,
  isAdmin,
}) => {
  const [hovering, setHovering] = useState(false);
  const breakpoints = useBreakpoints();
  hovering;
  return (
    <button
      type="button"
      onClick={() => {
        !breakpoints.isMd && requestEdit && requestEdit();
      }}
      onMouseEnter={() => {
        setHovering(true);
      }}
      onMouseLeave={() => {
        setHovering(false);
      }}
      className="flex h-[40px] w-full shrink-0 flex-row gap-3 font-semibold md:cursor-default md:gap-5"
    >
      <div
        className={`relative flex aspect-square h-full w-[40px] shrink-0 grow-0 overflow-hidden rounded-md bg-panelBack p-1 text-darkText shadow-md dark:bg-panelBack-darkMode dark:text-darkText-darkMode`}
      >
        <FallBackImage
          customFallback="https://cdn.namespace.media/s/ofpajSeo5zoymxL/download/LOGO_3_x250.png"
          src={avatarToURL(user, 64)}
          className="h-full w-full rounded-md object-cover"
        />
      </div>
      <div
        className={`relative flex h-full shrink-0 items-center overflow-hidden whitespace-nowrap rounded-md bg-panelBack p-4 text-darkText shadow-md dark:bg-panelBack-darkMode dark:text-darkText-darkMode`}
      >
        #{rank}
      </div>
      <Link
        href={
          breakpoints.isMd
            ? isEqual(user.username, `Unknown Username`)
              ? `/blog/why_does_my_leaderboard_look_weird_1654799084717`
              : `#`
            : `#`
        }
        className={`${
          !isEqual(user.username, `Unknown Username`)
            ? `pointer-events-none`
            : `pointer-events-none md:pointer-events-auto`
        } relative flex aspect-square h-full w-full grow-0 items-center overflow-hidden rounded-md bg-panelBack p-4 pr-2 text-darkText shadow-md dark:bg-panelBack-darkMode dark:text-darkText-darkMode`}
      >
        <span className="truncate">{user.username}</span>
      </Link>

      <div
        className={`relative hidden h-full shrink-0 items-center overflow-hidden whitespace-nowrap rounded-md bg-panelBack p-4 text-darkText shadow-md dark:bg-panelBack-darkMode dark:text-darkText-darkMode md:flex`}
      >
        Lvl. {formatNumber(calculateLevel(user.xp))}
      </div>
      <div
        className={`relative hidden h-full shrink-0 items-center overflow-hidden whitespace-nowrap rounded-md bg-panelBack p-4 text-darkText shadow-md dark:bg-panelBack-darkMode dark:text-darkText-darkMode md:flex`}
      >
        {formatNumber(user.xp)} xp
      </div>
      <div
        className={`relative flex h-full shrink-0 items-center overflow-hidden whitespace-nowrap rounded-md bg-panelBack p-4 text-darkText shadow-md dark:bg-panelBack-darkMode dark:text-darkText-darkMode`}
      >
        {getArrowPos(user.id, user.arrowPos, rank)}
      </div>
      {isAdmin && (
        <BlockButton
          onClick={requestEdit}
          className="hidden h-full !w-fit grow-0 md:pointer-events-auto md:flex"
        >
          Edit
        </BlockButton>
      )}
    </button>
  );
};

export default LeaderboardPanel;
