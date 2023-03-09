import { apiRoutes } from 'apis/api-helper';
import { IDiscordUserLookup } from 'models/backend/discord-models';
import { IXPDBUserBan } from 'models/backend/xp-models';
import { FC, useEffect, useState } from 'react';
import { avatarToURL } from 'utils/discord-utils';

import BasicPanel from './basic-panel';
import BlockButton, { BlockButtonVariant } from './block-button';
import ButtonCluster from './button-cluster';
import FallBackImage from './fallback-image';

interface BansListPanelProps {
  ban: IXPDBUserBan;
  requestModify?: () => void;
}

const BansListPanel: FC<BansListPanelProps> = ({ ban, requestModify }) => {
  const [user, setUser] = useState<IDiscordUserLookup | undefined>();
  useEffect(() => {
    const lookupUser = async () => {
      const res = await apiRoutes.discord.lookupUser(ban.userID);
      if (!res.success) return;
      setUser(res.body);
    };
    lookupUser();
  }, []);
  return (
    <BasicPanel>
      <div className="relative flex flex-col gap-4 text-center text-darkText dark:text-darkText-darkMode md:text-start">
        <div className="flex flex-row items-center  justify-center gap-3 md:justify-start">
          <div className="aspect-square w-5 overflow-hidden rounded-full">
            <FallBackImage src={avatarToURL(user, 32)} />
          </div>
          <p className="select-text">
            {user ? (
              <>
                {user?.username}#{user?.discriminator} •{' '}
                <i className="select-text opacity-50">{user?.id}</i>
              </>
            ) : (
              <>
                Deleted Discord Account •{' '}
                <i className="select-text opacity-50">{ban.userID}</i>
              </>
            )}
          </p>
        </div>
        <hr className="w-full" />
        <div>
          <h2 className="mt-0">Information</h2>
          <p className="opacity-75 md:border-l-2 md:pl-2 md:pr-24">
            {ban.content.notes || `None provided`}
          </p>
        </div>
        <div className="absolute right-0 bottom-0 hidden w-fit md:flex">
          <BlockButton
            onClick={requestModify}
            variant={BlockButtonVariant.inPanel}
          >
            Modify
          </BlockButton>
        </div>
        <div className="md:hidden">
          <ButtonCluster
            isInPanel
            buttons={[{ text: `Modify`, onClick: requestModify }]}
          />
        </div>
      </div>
    </BasicPanel>
  );
};

export default BansListPanel;
