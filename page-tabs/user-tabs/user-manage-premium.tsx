// eslint-disable-next-line import/no-cycle

import PageTitle from 'components/page-title';
import Select from 'components/select';
import { useUser } from 'context/user-context';
import { clone, compact, isUndefined, map, uniq } from 'lodash';
import { FC } from 'react';

interface UserTabManagePremiumProps {
  tabPath: string;
}

const UserTabManagePremium: FC<UserTabManagePremiumProps> = () => {
  const user = useUser();

  const updatePremiumServers = (idx: number, value: string) => {
    const servers = clone(user.currentUser?.premium.servers) || [];
    servers[idx] = value;
    user.updatePremiumServers({
      servers: compact(uniq(servers)),
    });
  };

  const updateVoteFreeServers = (idx: number, value: string) => {
    const servers = clone(user.currentUser?.premium.voteFreeServers) || [];
    servers[idx] = value;
    user.updatePremiumServers({
      voteFreeServers: compact(uniq(servers)),
    });
  };

  return (
    <div>
      {user.loading.discordGuilds ? (
        <>
          <PageTitle title="Manage Premium Servers" />
          <div className="w-full rounded-md bg-panelBack p-3 text-darkText opacity-75 dark:bg-panelBack-darkMode dark:text-darkText-darkMode">
            This content is getting prepared...
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <PageTitle title="Manage Premium Servers" />
            <div className="flex flex-col items-center gap-4">
              {map(
                Array.from(Array(user.currentUser?.premium.serverPremium)),
                (_, idx) => (
                  <Select
                    key={`user-premium-selector-${
                      user.currentUser?.premium.servers[idx] || idx
                    }`}
                    className={
                      isUndefined(user.currentUser?.premium.servers[idx])
                        ? `opacity-50 hover:opacity-95`
                        : ``
                    }
                    value={user.currentUser?.premium.servers[idx] || ``}
                    onChange={(value) => updatePremiumServers(idx, value)}
                    options={[
                      { title: `Not Assigned`, id: `` },
                      ...map(user.discordGuilds, (guild) => ({
                        title: guild.name,
                        id: guild.id,
                      })),
                    ]}
                  />
                )
              )}
            </div>
          </div>
          <div>
            <PageTitle disableArrow title="Manage Vote-Free Servers" />
            <div className="flex flex-col items-center gap-4">
              {map(
                Array.from(Array(user.currentUser?.premium.voteFreeCount)),
                (_, idx) => (
                  <Select
                    key={`user-vote-selector-${
                      user.currentUser?.premium.voteFreeServers[idx] || idx
                    }`}
                    className={
                      isUndefined(
                        user.currentUser?.premium.voteFreeServers[idx]
                      )
                        ? `opacity-50 hover:opacity-95`
                        : ``
                    }
                    value={user.currentUser?.premium.voteFreeServers[idx] || ``}
                    onChange={(value) => updateVoteFreeServers(idx, value)}
                    options={[
                      { title: `Not Assigned`, id: `` },
                      ...map(user.discordGuilds, (guild) => ({
                        title: guild.name,
                        id: guild.id,
                      })),
                    ]}
                  />
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTabManagePremium;
