import { FC } from 'react';

import { useUser } from '../../context/user-context';
import { avatarToURL } from '../../utils/discord-utils';
import FallBackImage from '../fallback-image';

interface IHeaderServerListProps {
  subtitle: string;
}

const HeaderServerList: FC<IHeaderServerListProps> = ({ subtitle }) => {
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
      </div>
    </div>
  );
};

export default HeaderServerList;
