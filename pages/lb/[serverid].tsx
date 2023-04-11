import { faEdit, faRemove } from '@fortawesome/free-solid-svg-icons';
import { apiRoutes } from 'apis/api-helper';
import BasicPanel from 'components/basic-panel';
import ButtonCluster, { ButtonFeature } from 'components/button-cluster';
import HeadSet from 'components/head-set';
import HeaderServerLeaderboard from 'components/header-content/header-server-leaderboard';
import LeaderboardPanel from 'components/leaderboard-panel';
import LeaderboardPodiumPanel from 'components/leaderboard-podium-panel';
import Modal from 'components/modal';
import PageTitle from 'components/page-title';
import PanelInput from 'components/panel-input';
import { useLayout } from 'context/layout-context';
import { useUser } from 'context/user-context';
import { ceil, isNil, map, size, slice } from 'lodash';
import { IXPLeaderboard, IXPLeaderboardUser } from 'models/backend/xp-models';
import { IPage } from 'models/page';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
// eslint-disable-next-line import/no-cycle
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { guildIconToURL } from 'utils/discord-utils';

interface ServerTabProps extends IPage {
  serverid: string;
  lbContent: IXPLeaderboard;
}

interface ModifyUserInputs {
  xp: number;
}

const LeaderboardPage: NextPage<ServerTabProps> = ({ serverid, lbContent }) => {
  const router = useRouter();
  const layout = useLayout();
  const user = useUser();
  const [modifyUser, setModifyUserState] = useState<
    IXPLeaderboardUser | undefined
  >();
  const pages = ceil(size(lbContent.leaderboard.pageContent) / 25);
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ModifyUserInputs>();

  const setModifyUser = (u?: IXPLeaderboardUser) => {
    setValue(`xp`, u ? u.xp : 0);
    setModifyUserState(u);
  };

  const modifyUserSettings = async (data: ModifyUserInputs) => {
    if (!modifyUser) return;
    const res = await apiRoutes.xp.guild.guildMember.setGuildMembersXP(
      serverid,
      modifyUser.id,
      data.xp
    );
    if (!res.success) return;
    // TODO: Add toast
    router.reload();
  };

  const onModifyUser: SubmitHandler<ModifyUserInputs> = async (data) => {
    modifyUserSettings(data);
  };

  const page = router.query.page
    ? parseInt(`${router.query.page}`, 10) > 0
      ? parseInt(`${router.query.page}`, 10)
      : 1
    : 1;

  useEffect(() => {
    layout.changeHeader(<h1>We are getting ready...</h1>, `server_loading`);
    const getLBPage = async () => {
      const background = await apiRoutes.xp.guild.settings.background.get(
        serverid
      );
      const loggedInLB = await apiRoutes.xp.leaderboard.getPage(
        `${router.query.serverid}`,
        1
      );
      if (loggedInLB.success)
        setIsAdmin(
          loggedInLB.body.isUserAdmin || user.currentUser?.developer || false
        );

      layout.changeHeader(
        <HeaderServerLeaderboard
          guild={lbContent.discordGuild}
          premium={{ premium: lbContent.isServerPremium, voteFree: false }}
        />,
        `server_loaded`,
        background.success &&
          background.body.enabled &&
          !isNil(background.body.url)
          ? background.body.url
          : undefined,
        !background.success ||
          !background.body.enabled ||
          isNil(background.body.blur)
          ? undefined
          : background.body.blur,
        undefined,
        true
      );
    };
    getLBPage();
  }, []);

  const currentPageContent = slice(
    lbContent.leaderboard.pageContent,
    0 + 25 * (page - 1),
    25 + 25 * (page - 1)
  );

  const podium =
    page === 1 ? slice(lbContent.leaderboard.pageContent, 0, 3) : [];
  const pageList =
    page === 1 ? slice(currentPageContent, 3) : currentPageContent;

  return (
    <>
      <HeadSet
        title={`Leaderboard of ${lbContent.discordGuild.name}`}
        description={`Rise to the Top: Keep Track of Your Progress in ${lbContent.discordGuild.name}.`}
        image={
          lbContent.discordGuild.icon
            ? guildIconToURL(lbContent.discordGuild)
            : undefined
        }
      />
      <div className="flex flex-col gap-5">
        {!size(lbContent.leaderboard.pageContent) && (
          <div className="mx-auto w-fit text-center opacity-75">
            <BasicPanel>
              <p className="text-darkText dark:text-darkText-darkMode">
                It still feels quite empty on here..
                <br />
                Gain some xp on {lbContent.discordGuild.name} to fill this page
                and get ranked.
              </p>
            </BasicPanel>
          </div>
        )}
        {size(podium) > 0 && (
          <div className="mt-6">
            <div className="flex flex-col gap-10">
              <div className="flex flex-row flex-wrap justify-center gap-5">
                {map(podium, (u, idx) => (
                  <LeaderboardPodiumPanel
                    requestEdit={() => {
                      setModifyUser(u);
                    }}
                    isAdmin={isAdmin}
                    key={`LBPodium-${u.id}-${idx}-${page}`}
                    rank={idx + 1 + 25 * (page - 1)}
                    user={u}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        {size(pageList) > 0 && (
          <div className="mt-5 flex flex-col gap-10 md:mt-0">
            <div className="flex flex-col gap-5">
              <PageTitle disableArrow title={`Page ${page} of ${pages}`} />
              {map(pageList, (u, idx) => (
                <LeaderboardPanel
                  requestEdit={() => {
                    setModifyUser(u);
                  }}
                  isAdmin={isAdmin}
                  key={`LBRegular-${u.id}-${idx}-${page}`}
                  rank={idx + size(podium) + 1 + 25 * (page - 1)}
                  user={u}
                />
              ))}
            </div>
            <div className="w-full">
              <ButtonCluster
                buttons={[
                  {
                    text: 'Previous Page',
                    link: `/lb/${serverid}/?page=${page > 1 ? page - 1 : page}`,
                    disabled: page <= 1,
                    shallowLink: true,
                  },
                  {
                    text: 'Next Page',
                    link: `/lb/${serverid}/?page=${
                      page === pages ? page : page + 1
                    }`,
                    disabled: page === pages,
                    shallowLink: true,
                  },
                ]}
              />
            </div>
          </div>
        )}
      </div>
      {isAdmin && (
        <Modal
          isOpen={!!modifyUser}
          requestClose={() => {
            setModifyUser(undefined);
          }}
          customKey={modifyUser?.id}
          title={`Modify ${modifyUser?.username}`}
        >
          {modifyUser && (
            <form
              onSubmit={handleSubmit(onModifyUser)}
              className="flex flex-col gap-8"
            >
              <div className="flex w-full flex-wrap gap-5">
                <div className="grow">
                  <PanelInput
                    registerForm={register(`xp`, {
                      required: 'This Input is required!',
                      min: {
                        value: 0,
                        message: `You can't set a negative amount of xp.`,
                      },
                      max: {
                        value: 2147483647,
                        message: `You can't set more than 2.147.483.647 xp.`,
                      },
                    })}
                    label="XP"
                    inputProps={{ max: 2147483647, min: 0 }}
                    value={modifyUser.xp}
                    type={'number'}
                    formError={errors.xp}
                  />
                </div>
              </div>
              <div>
                <h2>Preview</h2>
                <div className="flex w-full justify-center">
                  <LeaderboardPodiumPanel
                    hideBanner
                    key={`modify-LBPodium-${modifyUser.id}`}
                    user={{ ...modifyUser, xp: watch('xp') || modifyUser.xp }}
                  />
                </div>
              </div>
              <div className="w-full">
                <ButtonCluster
                  isInPanel
                  buttons={[
                    {
                      icon: faRemove,
                      text: `Reset User`,
                      onClick: () => {
                        onModifyUser({ xp: 0 });
                      },
                      feature: ButtonFeature.danger,
                    },
                    {
                      submitType: true,
                      icon: faEdit,
                      text: `Save User`,
                    },
                  ]}
                />
              </div>
            </form>
          )}
        </Modal>
      )}
    </>
  );
};

export const getStaticProps = async (context: {
  params: { serverid: string };
}) => {
  try {
    const res = await apiRoutes.xp.leaderboard.getPage(
      context.params.serverid,
      1
    );
    if (!res.success)
      return {
        notFound: true,
      };

    return {
      props: {
        serverid: context.params.serverid,
        lbContent: res.body,
      },
      revalidate: 5,
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

export const getStaticPaths = async () => {
  const paths = [
    {
      params: {
        serverid: '012345678912345678',
      },
    },
  ];

  return { paths, fallback: 'blocking' };
};

export default LeaderboardPage;
