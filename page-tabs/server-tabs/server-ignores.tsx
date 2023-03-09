// eslint-disable-next-line import/no-cycle
import { faAdd, faRemove } from '@fortawesome/free-solid-svg-icons';
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
  isEqual,
  isUndefined,
  size,
  slice,
  upperFirst,
} from 'lodash';
import { IDiscordChannel, IDiscordRole } from 'models/backend/discord-models';
import { FC, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { DiscordChannelType } from 'utils/discord-utils';

import IgnoredCategories from './ignore-parts/ignored-category';
import IgnoredRoles from './ignore-parts/ignored-roles';
import IgnoredTextChannels from './ignore-parts/ignored-text';
import IgnoredVoiceChannels from './ignore-parts/ignored-voice';

interface AddRoleInputs {
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

interface ServerTabIgnoresProps {}

const ServerTabIgnores: FC<ServerTabIgnoresProps> = () => {
  const [addBoostModal, setAddBoostModal] = useState<{
    type: `Role` | `TextChannel` | `VoiceChannel`;
  }>();
  const [deleteBoostModal, setDeleteBoostModal] = useState<{
    type: `roles` | `channels`;
    name: string;
    id: string;
  }>();
  const guild = useServerDetails();

  const getTypeSpecificDiscordEntires = ():
    | IDiscordRole[]
    | IDiscordChannel[] => {
    if (!isUndefined(addBoostModal))
      switch (addBoostModal.type) {
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
    else return [];
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
  } = useForm<AddRoleInputs>();
  const onAddBoost: SubmitHandler<AddRoleInputs> = (data) => {
    if (!guild.currentXPGuild || !addBoostModal) return;
    const g = cloneDeep(guild.currentXPGuild);
    const isRole = isEqual(addBoostModal.type, `Role`);
    const current = isRole
      ? filter(g.boosts.roles, (role) => !isEqual(role.id, data.entity))
      : filter(
          guild.currentXPGuild.boosts.channels,
          (channel) => !isEqual(channel.id, data.entity)
        );
    current.push({ id: data.entity, percentage: data.percentage });

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    isRole ? (g.boosts.roles = current) : (g.boosts.channels = current);

    guild.updateGuild(
      {
        name: `${addBoostModal.type} Boost - ${data.entity}`,
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
          title="Ignored Roles"
          tooltipText="Ignored Roles allow you to specify roles that should not gain any xp."
        />
        <IgnoredRoles />
      </div>
      <hr className="mx-auto mt-1 w-4/5 md:-mb-4" />
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div>
          <PageTitle
            disableArrow
            title="Ignored TextChannels"
            tooltipText="Ignored TextChannels allow you to specify text channels where message xp is always disabled."
          />
          <IgnoredTextChannels />
        </div>
        <hr className="mx-auto -mb-5 mt-1 w-4/5 md:hidden" />
        <div>
          <PageTitle
            disableArrow
            title="Ignored VoiceChannels"
            tooltipText="Ignored VoiceChannels allow you to specify voice channels where voice xp is always disabled."
          />
          <IgnoredVoiceChannels />
        </div>
      </div>
      <hr className="mx-auto mt-1 w-4/5 md:-mb-4" />
      <div>
        <PageTitle
          disableArrow
          title="Ignored Categories"
          tooltipText="Ignored Categories allow you to specify categories where voice xp and message xp is always disabled."
        />
        <IgnoredCategories />
      </div>
      <Modal
        title={`Add ${addBoostModal ? `${addBoostModal.type}-` : ``}Boost`}
        isOpen={!isUndefined(addBoostModal)}
        requestClose={() => {
          setAddBoostModal(undefined);
        }}
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
                })}
                label="Percentage"
                inputProps={{ type: 'number' }}
                value={12}
                formError={errors.percentage}
              />
            </div>
            <div className="grow">
              <Select
                disabled={addDisabled}
                formError={errors.entity}
                registerForm={register(`entity`, { required: true })}
                options={getTypeSpecificDiscordEntires().map((entry) => ({
                  id: entry.id,
                  title:
                    typeToPrefix(addBoostModal?.type) + entry.name || `Unknown`,
                }))}
                label={addBoostModal ? `${addBoostModal.type}` : `Entity`}
                isInPanel={true}
              />
            </div>
          </div>

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

export default ServerTabIgnores;
