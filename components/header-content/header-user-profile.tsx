import { map } from 'lodash';
import Link from 'next/link';
import { FC } from 'react';
import { getXPBadge } from 'utils/xp-variable-images-utils';

import { useUser } from '../../context/user-context';
import { avatarToURL } from '../../utils/discord-utils';
import FallBackImage from '../fallback-image';

interface HeaderHomeProps {
  subtitle: string;
}

const HeaderUserProfile: FC<HeaderHomeProps> = ({ subtitle }) => {
  const user = useUser();
  return (
    <div className="mt-2 flex w-full flex-col items-center justify-center gap-2 lg:flex-row lg:justify-start lg:gap-5">
      <FallBackImage
        src={avatarToURL(user.currentUser?.discordUser, 512)}
        className={
          'aspect-square w-[141px] rounded-full object-cover shadow-rankingAvater'
        }
      />
      <div className="flex flex-col gap-2">
        <div className="text-center drop-shadow-sm lg:text-left">
          <h1>Hey {user.currentUser?.discordUser?.username}</h1>
          <h4>{subtitle}</h4>
        </div>
        <div className="hidden w-full flex-row justify-between text-center drop-shadow-sm md:flex lg:text-left">
          {map(user.currentUser?.xpUser.badges, (badge) => (
            <Link
              key={`header-user-profile-badge-${badge}`}
              href={'/blog/getting_to_know_badges_1654567517739'}
            >
              <FallBackImage
                className="aspect-square w-5 transition ease-in-out hover:-translate-y-1"
                src={getXPBadge(badge)}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeaderUserProfile;
