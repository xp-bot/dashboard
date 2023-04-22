// eslint-disable-next-line import/no-cycle
import { faAdd, faRemove } from '@fortawesome/free-solid-svg-icons';
import AnimatedDivList from 'components/animated-div-list';
import BoostPanel from 'components/boost-panel';
import ButtonCluster, { ButtonFeature } from 'components/button-cluster';
import Modal from 'components/modal';
import PageTitle from 'components/page-title';
import PanelInput from 'components/panel-input';
import Select from 'components/select';
import { useServerDetails } from 'context/guild-details-context';
import {
  cloneDeep,
  filter,
  find,
  floor,
  isEqual,
  isNil,
  isUndefined,
  map,
  partition,
  size,
  slice,
  sortBy,
  upperFirst,
} from 'lodash';
import { IDiscordChannel, IDiscordRole } from 'models/backend/discord-models';
import { FC, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { DiscordChannelType } from 'utils/discord-utils';

interface AddInputs {
  percentage: number;
  entity: string;
}

const typeToPrefix = (type?: 'Role' | 'TextChannel' | 'VoiceChannel') => {
  switch (type) {
    case 'TextChannel':
      return `# `;

    case `Role`:
      return `@ `;
    default:
      return '';
  }
};

interface ServerTabBoostsProps {}

const ServerTabBoosts: FC<ServerTabBoostsProps> = () => {
  const [addBoostModal, setAddBoostModal] = useState<{
    type: `Role` | `TextChannel` | `VoiceChannel`;
  }>();
  const [deleteBoostModal, setDeleteBoostModal] = useState<{
    type: `roles` | `channels`;
    name: string;
    id: string;
  }>();
  const guild = useServerDetails();

  const getTypeSpecificDiscordEntires = (
    type: 'Role' | 'TextChannel' | 'VoiceChannel'
  ): IDiscordRole[] | IDiscordChannel[] => {
    switch (type) {
      case 'Role':
        return slice(guild.currentDiscordRoles, 1);
      case 'TextChannel':
        return filter(guild.currentDiscordChannels, (channel) =>
          isEqual(channel.type, DiscordChannelType.text)
        ) as IDiscordChannel[];
      case 'VoiceChannel':
        return filter(guild.currentDiscordChannels, (channel) =>
          isEqual(channel.type, DiscordChannelType.voice)
        ) as IDiscordChannel[];
      default:
        return [];
    }
  };

  const addDisabled = !isUndefined(addBoostModal)
    ? isEqual(addBoostModal.type, `TextChannel`) ||
      isEqual(addBoostModal.type, `VoiceChannel`)
      ? size(guild.currentXPGuild?.boosts.channels) >= 100
      : isEqual(addBoostModal.type, `Role`)
      ? size(guild.currentXPGuild?.boosts.roles) >= 100
      : true
    : false;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<AddInputs>();

  const addBoost = (
    data: AddInputs & { isRole?: boolean; oldEntityID?: string }
  ) => {
    if (!guild.currentXPGuild) return;
    const g = cloneDeep(guild.currentXPGuild);
    const isRole = data.isRole || isEqual(addBoostModal?.type, `Role`);
    const current = partition(
      isRole ? g.boosts.roles : guild.currentXPGuild.boosts.channels,
      (entity) => isEqual(entity.id, data.oldEntityID || data.entity)
    );

    const newEntities = [
      { id: data.entity, percentage: data.percentage },
      ...current[1],
    ];

    isRole ? (g.boosts.roles = newEntities) : (g.boosts.channels = newEntities);

    guild.updateGuild(
      {
        name: `${
          isNil(data.isRole)
            ? data.isRole
              ? `Role`
              : `Channel`
            : addBoostModal?.type
        } Boost - ${data.entity}`,
        oldValue:
          `${
            find(isRole ? g.boosts.roles : g.boosts.channels, (entity) =>
              isEqual(entity.id, data.entity)
            )?.percentage
          }` || `Not Set`,
        newValue: `${data.percentage}`,
      },
      g
    );
    setAddBoostModal(undefined);
  };

  const onAddBoost: SubmitHandler<AddInputs> = (data) => {
    addBoost(data);
  };

  const editBoostPercentage = (data: {
    entityID: string;
    newBoostPercentage: number;
    type: `roles` | `channels`;
  }) => {
    if (!guild.currentXPGuild) return;
    const g = cloneDeep(guild.currentXPGuild);
    const isRole = isEqual(data.type, `roles`);

    const current = partition(
      isRole
        ? filter(g.boosts.roles, (role) => !isEqual(role.id, data.entityID))
        : filter(
            guild.currentXPGuild.boosts.channels,
            (channel) => !isEqual(channel.id, data.entityID)
          ),
      (entity) => isEqual(entity.id, data.entityID)
    );

    const newEntities = [
      { id: data.entityID, percentage: data.newBoostPercentage },
      ...current[1],
    ];

    isRole ? (g.boosts.roles = newEntities) : (g.boosts.channels = newEntities);

    guild.updateGuild(
      {
        name: `${data.type} Boost - ${data.entityID}`,
        oldValue: `${current[0][0]?.percentage}` || `Not Set`,
        newValue: `${data.newBoostPercentage}`,
      },
      g
    );
    setAddBoostModal(undefined);
  };

  const onDeleteBoost = (type: `roles` | `channels`, id: string) => {
    if (!guild.currentXPGuild) return;
    const g = cloneDeep(guild.currentXPGuild);
    g.boosts[type] = filter(
      g.boosts[type],
      (entity) => !isEqual(entity.id, id)
    );

    guild.updateGuild(
      {
        name: `${upperFirst(type)} Boost - ${id}`,
        oldValue: `${
          find(guild.currentXPGuild.boosts[type], (entity) =>
            isEqual(entity.id, id)
          )?.percentage || `Not Set`
        }`,
        newValue: `Not Set`,
      },
      g
    );
  };

  return (
    <>
      <div>
        <PageTitle
          title="Boosted Roles"
          tooltipText="Boosted Roles allow you make users with specified roles progress faster than others. (100% = Double XP)"
        />
        <div className="flex flex-wrap gap-10">
          <div className="flex w-full flex-wrap gap-5">
            <AnimatedDivList emptyMessage="You did not boost any Roles yet.">
              {map(
                sortBy(
                  guild.currentXPGuild?.boosts.roles,
                  (role) => role.percentage
                ),
                (boostedRole, idx) => {
                  const role = find(
                    guild.currentDiscordRoles,
                    (r) => r.id === boostedRole.id
                  );

                  if (role)
                    return {
                      key: `IgnoredRole-Motion-${role.id}`,
                      element: (
                        <div
                          key={`role${role.id}${idx}`}
                          className="flex w-full flex-col items-center gap-5"
                        >
                          <BoostPanel
                            availableEntities={getTypeSpecificDiscordEntires(
                              'Role'
                            )}
                            requestChangeDetails={(
                              newEntity,
                              newPercentage
                            ) => {
                              if (newEntity)
                                addBoost({
                                  entity: newEntity,
                                  oldEntityID: role.id,
                                  percentage: boostedRole.percentage,
                                  isRole: true,
                                });
                              else if (newPercentage)
                                editBoostPercentage({
                                  entityID: role.id,
                                  newBoostPercentage: newPercentage,
                                  type: 'roles',
                                });
                            }}
                            prefix="@"
                            requestRemove={(id) => {
                              setDeleteBoostModal({
                                type: `roles`,
                                id,
                                name: `@ ${role.name}`,
                              });
                            }}
                            percentage={boostedRole.percentage}
                            entity={role}
                          />
                        </div>
                      ),
                    };
                  return { element: <></>, key: '' };
                }
              )}
            </AnimatedDivList>
          </div>
          <div className="w-full">
            <ButtonCluster
              buttons={[
                {
                  text: `Add Boosted Role`,
                  icon: faAdd,
                  onClick: () => {
                    setAddBoostModal({ type: `Role` });
                  },
                },
              ]}
            />
          </div>
        </div>
      </div>
      <hr className=" mx-auto mt-1 w-4/5 md:-mb-4" />
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div>
          <PageTitle
            disableArrow
            title="Boosted TextChannels"
            tooltipText="Boosted TextChannels allow you make messages reward more xp in specified text channels than in others. (100% = Double XP)"
          />
          <div className="flex flex-wrap gap-10">
            <div className="flex w-full flex-wrap gap-5">
              <AnimatedDivList emptyMessage="You did not boost any TextChannels yet.">
                {map(
                  sortBy(
                    guild.currentXPGuild?.boosts.channels,
                    (channel) => channel.percentage
                  ),
                  (boostedChannel, idx) => {
                    const channel = find(
                      filter(guild.currentDiscordChannels, (c) =>
                        isEqual(c.type, DiscordChannelType.text)
                      ),
                      (r) => r.id === boostedChannel.id
                    );

                    if (channel)
                      return {
                        key: `BoostedText-Motion-${channel.id}`,
                        element: (
                          <div
                            key={`text${channel.id}${idx}`}
                            className="flex w-full flex-col items-center gap-5"
                          >
                            <BoostPanel
                              availableEntities={getTypeSpecificDiscordEntires(
                                'TextChannel'
                              )}
                              requestChangeDetails={(
                                newEntity,
                                newPercentage
                              ) => {
                                if (newEntity)
                                  addBoost({
                                    entity: newEntity,
                                    oldEntityID: channel.id,
                                    percentage: boostedChannel.percentage,
                                  });
                                else if (newPercentage)
                                  editBoostPercentage({
                                    entityID: channel.id,
                                    newBoostPercentage: newPercentage,
                                    type: 'channels',
                                  });
                              }}
                              prefix="#"
                              requestRemove={(id) => {
                                setDeleteBoostModal({
                                  type: `channels`,
                                  id,
                                  name: `# ${channel.name}` || `Unknown`,
                                });
                              }}
                              percentage={boostedChannel.percentage}
                              entity={channel}
                            />
                          </div>
                        ),
                      };
                    return { element: <></>, key: '' };
                  }
                )}
              </AnimatedDivList>
            </div>
            <div className="w-full">
              <ButtonCluster
                buttons={[
                  {
                    text: `Add Boosted Channel`,
                    icon: faAdd,
                    onClick: () => {
                      setAddBoostModal({ type: `TextChannel` });
                    },
                  },
                ]}
              />
            </div>
          </div>
        </div>
        <hr className="mx-auto mt-1 w-4/5 md:hidden" />
        <div>
          <PageTitle
            disableArrow
            title="Boosted VoiceChannels"
            tooltipText="Boosted VoiceChannels allow you make messages reward more xp in specified voice channels than in others. (100% = Double XP)"
          />
          <div className="flex flex-wrap gap-10">
            <div className="flex w-full flex-wrap gap-5">
              <AnimatedDivList emptyMessage="You did not boost any TextChannels yet.">
                {map(
                  sortBy(
                    guild.currentXPGuild?.boosts.channels,
                    (channel) => channel.percentage
                  ),
                  (boostedChannel, idx) => {
                    const channel = find(
                      filter(guild.currentDiscordChannels, (c) =>
                        isEqual(c.type, DiscordChannelType.voice)
                      ),
                      (r) => r.id === boostedChannel.id
                    );

                    if (channel)
                      return {
                        key: `BoostedVoice-Motion-${channel.id}`,
                        element: (
                          <div
                            key={`boostedVoice${channel.id}${idx}`}
                            className="flex w-full flex-col items-center gap-5"
                          >
                            <BoostPanel
                              availableEntities={getTypeSpecificDiscordEntires(
                                'VoiceChannel'
                              )}
                              requestChangeDetails={(
                                newEntity,
                                newPercentage
                              ) => {
                                if (newEntity)
                                  addBoost({
                                    entity: newEntity,
                                    oldEntityID: channel.id,
                                    percentage: boostedChannel.percentage,
                                  });
                                else if (newPercentage)
                                  editBoostPercentage({
                                    entityID: channel.id,
                                    newBoostPercentage: newPercentage,
                                    type: 'channels',
                                  });
                              }}
                              prefix=""
                              requestRemove={(id) => {
                                setDeleteBoostModal({
                                  type: `channels`,
                                  id,
                                  name: channel.name || `Unknown`,
                                });
                              }}
                              percentage={boostedChannel.percentage}
                              entity={channel}
                            />
                          </div>
                        ),
                      };
                    return { element: <></>, key: '' };
                  }
                )}
              </AnimatedDivList>
            </div>
            <div className="w-full">
              <ButtonCluster
                buttons={[
                  {
                    text: `Add Boosted Channel`,
                    icon: faAdd,
                    onClick: () => {
                      setAddBoostModal({ type: `VoiceChannel` });
                    },
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
      <hr className="mx-auto mt-1 w-4/5 md:-mb-4" />
      <div className="opacity-50 blur-md transition ease-in-out hover:blur-0">
        <PageTitle
          disableArrow
          title="Boosted Categories"
          tooltipText="Boosted Categories allow you make messages reward more xp in specified categories than in others. (100% = Double XP)"
        />
        <div className="flex flex-wrap gap-10">
          <div className="flex w-full flex-wrap gap-5">
            <div className="flex w-full flex-col items-center gap-5">
              {/* Content */}
              <h2 className="opacity-50">Coming Soon...</h2>
            </div>
          </div>
          <div className="w-full">
            <ButtonCluster
              buttons={[
                {
                  disabled: true,
                  text: `Add Boosted Category`,
                  icon: faAdd,
                  onClick: () => {},
                },
              ]}
            />
          </div>
        </div>
      </div>
      <Modal
        title={`Add ${addBoostModal ? `${addBoostModal.type}-` : ``}Boost`}
        isOpen={!isUndefined(addBoostModal)}
        requestClose={() => {
          setAddBoostModal(undefined);
        }}
        customKey={addBoostModal ? addBoostModal.type : undefined}
      >
        <form
          onSubmit={handleSubmit(onAddBoost)}
          className="flex flex-col gap-10"
        >
          <div className="flex w-full flex-wrap gap-5">
            <div className="grow">
              <PanelInput
                disabled={addDisabled}
                registerForm={register(`percentage`, {
                  required: 'This Input is required!',
                  min: {
                    message: `You can't boost with less than -100%!`,
                    value: -100,
                  },
                })}
                label="Percentage"
                inputProps={{ min: -100 }}
                value={12}
                type={'number'}
                formError={errors.percentage}
              />
            </div>
            <div className="grow">
              <Select
                disabled={addDisabled}
                formError={errors.entity}
                registerForm={register(`entity`, { required: true })}
                options={
                  addBoostModal
                    ? getTypeSpecificDiscordEntires(addBoostModal?.type).map(
                        (entry) => ({
                          id: entry.id,
                          title:
                            typeToPrefix(addBoostModal?.type) + entry.name ||
                            `Unknown`,
                        })
                      )
                    : []
                }
                label={addBoostModal ? `${addBoostModal.type}` : `Entity`}
                isInPanel={true}
              />
            </div>
          </div>
          <span className="-mt-5 text-center opacity-75">
            <b>100xp</b> »{' '}
            <b>
              {floor(100 + 100 * (watch('percentage') / 100)) < 0
                ? 0
                : floor(100 + 100 * (watch('percentage') / 100))}
              xp
            </b>
          </span>

          <div className="flex flex-col items-center gap-5">
            {addDisabled ? (
              <div className="flex flex-col items-center text-center">
                <h2>
                  You've reached the maximum of 100 Boosted{' '}
                  {addBoostModal?.type}s!
                </h2>
                <span>Delete some in order to create a new one.</span>
              </div>
            ) : (
              <div className="w-full">
                <ButtonCluster
                  isInPanel
                  buttons={[
                    {
                      disabled: addDisabled,
                      submitType: true,
                      icon: faAdd,
                      text: `Add Boost`,
                    },
                  ]}
                />
              </div>
            )}
          </div>
        </form>
      </Modal>
      <Modal
        title={`Unlink Boost for ${deleteBoostModal?.name}?`}
        isOpen={!isUndefined(deleteBoostModal)}
        requestClose={() => {
          setDeleteBoostModal(undefined);
        }}
      >
        <div className="flex w-full flex-col gap-5">
          <div>
            Are you sure you want to remove the boost from{' '}
            <b>{deleteBoostModal?.name}</b>?
          </div>
          <ButtonCluster
            isInPanel
            buttons={[
              {
                onClick: () => {
                  if (deleteBoostModal) {
                    onDeleteBoost(deleteBoostModal.type, deleteBoostModal.id);
                    setDeleteBoostModal(undefined);
                  }
                },
                submitType: true,
                icon: faRemove,
                feature: ButtonFeature.danger,
                text: `Unlink Boost`,
              },
            ]}
          />
        </div>
      </Modal>
    </>
  );
};

export default ServerTabBoosts;
