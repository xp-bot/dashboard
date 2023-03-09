import HeaderServerList from 'components/header-content/header-server-list';
import PageTitle from 'components/page-title';
import { XPLoading } from 'components/svg/logos';
import { useLayout } from 'context/layout-context';
import { useAccessRestriction } from 'hooks/use-access-restriction';
import { filter, map, orderBy, size } from 'lodash';
import type { NextPage } from 'next';
import { useEffect } from 'react';

import GuildList from '../../components/guild-list';
import HeadSet from '../../components/head-set';
import { useUser } from '../../context/user-context';
import { IPage } from '../../models/page';

interface UserProps extends IPage {}

const User: NextPage<UserProps> = () => {
  const layout = useLayout();
  useAccessRestriction(true, false);

  const user = useUser();
  useEffect(() => {
    user.isLoggedIn &&
      layout.changeHeader(
        <HeaderServerList subtitle="These are all the servers you're permitted to edit XP on." />,
        `server_list`
      );
  }, [user.isLoggedIn]);

  if (!user.isLoggedIn) return <></>;

  return (
    <>
      <HeadSet title="Your Servers" />
      <div className="flex flex-col gap-[3rem]">
        {!user.loading.discordGuilds ? (
          <>
            <GuildList
              title="Premium Servers"
              buttons={
                size(
                  filter(user.discordGuilds, (guild) => guild.premium.premium)
                ) > 0
                  ? map(
                      filter(
                        orderBy(user.discordGuilds, ['xpInvited'], 'desc'),
                        (guild) => guild.premium.premium
                      ),
                      (guild) => {
                        return {
                          guild,
                        };
                      }
                    )
                  : []
              }
            />
            <hr className="mx-auto hidden w-4/5 md:block" />
            <GuildList
              title="Regular Servers"
              buttons={
                size(
                  filter(user.discordGuilds, (guild) => !guild.premium.premium)
                )
                  ? map(
                      filter(
                        orderBy(user.discordGuilds, ['xpInvited'], 'desc'),
                        (guild) => !guild.premium.premium
                      ),
                      (guild) => {
                        return {
                          guild,
                        };
                      }
                    )
                  : []
              }
            />
          </>
        ) : (
          <>
            <PageTitle title="Your Servers" />
            <div className="flex w-full items-center justify-center">
              <XPLoading />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default User;
