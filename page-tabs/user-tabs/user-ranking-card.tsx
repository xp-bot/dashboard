// eslint-disable-next-line import/no-cycle

import ModulePanel, { PremiumType } from 'components/module-panel';
import PageTitle from 'components/page-title';
import RankingCard from 'components/ranking-card';
import ValuePanel from 'components/value-panel';
import { useUser } from 'context/user-context';
import { useUserDetails } from 'context/user-details-context';
import { toNumber } from 'lodash';
import { FC, useEffect } from 'react';

interface UserTabSettingsProps {
  tabPath: string;
}

const UserTabRankingCard: FC<UserTabSettingsProps> = () => {
  const user = useUser();
  const userDetails = useUserDetails();

  useEffect(() => {
    userDetails.fetchRankingBackground();
  }, []);

  return (
    <div
    // className={`${
    //   userDetails.rankingBackground !== null
    //     ? ``
    //     : `pointer-events-none opacity-75 saturate-0`
    // }`}
    >
      <PageTitle title="Ranking Card Editor" />
      {userDetails.currentXPUser && (
        <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start">
          <div className="flex w-full grow flex-col gap-6 lg:w-auto">
            <ModulePanel
              premiumLock={PremiumType.UserPremium}
              defaultValue={false}
              checked={
                user.currentUser?.premium.userPremium
                  ? userDetails.currentXPUser.settings.background.canvas
                  : false
              }
              moduleDescription="Enable the Background Canvas"
              moduleName="Canvas"
              disabled={!userDetails.rankingBackground}
              onChange={(v) => {
                if (user.currentUser && userDetails.rankingBackground)
                  userDetails.updateUser({
                    ...user.currentUser.xpUser,
                    settings: {
                      language: ``,
                      background: {
                        ...user.currentUser.xpUser.settings.background,
                        canvas: v,
                      },
                    },
                  });
              }}
            />
            <ValuePanel
              value={userDetails.currentXPUser.settings.background.blur}
              valueDescription="Set the Canvas Blur"
              valueName="Canvas Blur"
              defaultValue={0}
              disabled={!userDetails.rankingBackground}
              premiumLock={PremiumType.UserPremium}
              onChange={(v) => {
                if (user.currentUser && userDetails.rankingBackground)
                  userDetails.updateUser({
                    ...user.currentUser.xpUser,
                    settings: {
                      language: ``,
                      background: {
                        ...user.currentUser.xpUser.settings.background,
                        blur: toNumber(v),
                      },
                    },
                  });
              }}
            />
          </div>
          <RankingCard />
        </div>
      )}
    </div>
  );
};

export default UserTabRankingCard;
