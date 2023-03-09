import { faAdd, faRemove } from '@fortawesome/free-solid-svg-icons';
import AnimatedDivList from 'components/animated-div-list';
import ButtonCluster, { ButtonFeature } from 'components/button-cluster';
import IgnorePanel from 'components/ignore-panel';
import Modal from 'components/modal';
import Select from 'components/select';
import { useServerDetails } from 'context/guild-details-context';
import {
  cloneDeep,
  filter,
  find,
  isEqual,
  isUndefined,
  map,
  size,
  slice,
} from 'lodash';
import { IDiscordRole } from 'models/backend/discord-models';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

interface AddIgnoreInputs {
  ignoredRoleID: string;
}

const IgnoredRoles = () => {
  const [addIgnoreModal, setAddIgnoreModal] = useState(false);
  const [deleteIgnoreModal, setDeleteIgnoreModal] = useState<IDiscordRole>();
  const guild = useServerDetails();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddIgnoreInputs>();

  const addDisabled = size(guild.currentXPGuild?.ignored.roles) >= 100;

  const onAddIgnore: SubmitHandler<AddIgnoreInputs> = (data) => {
    if (!guild.currentXPGuild || !addIgnoreModal) return;
    const g = cloneDeep(guild.currentXPGuild);
    g.ignored.roles = [
      ...filter(g.ignored.roles, (role) => !isEqual(role, data.ignoredRoleID)),
      data.ignoredRoleID,
    ];

    guild.updateGuild(
      {
        name: `Ignored Role - ${data.ignoredRoleID}`,
        oldValue: `${find(g.ignored.roles, (entity) =>
          isEqual(entity, data.ignoredRoleID)
        )}`
          ? `Ignored`
          : `Not Ignored`,
        newValue: `Ignored`,
      },
      g
    );
    setAddIgnoreModal(false);
  };

  const onDeleteBoost = (id: string) => {
    if (!guild.currentXPGuild) return;
    const g = cloneDeep(guild.currentXPGuild);
    g.ignored.roles = filter(g.ignored.roles, (entity) => !isEqual(entity, id));

    guild.updateGuild(
      {
        name: `Ignored Role - ${id}`,
        oldValue: `Ignored`,
        newValue: `Not Ignored`,
      },
      g
    );
  };
  return (
    <>
      <div className="flex flex-wrap gap-10">
        <div className="flex w-full flex-wrap gap-5">
          <AnimatedDivList emptyMessage="You did not set any Roles to ignore yet.">
            {map(guild.currentXPGuild?.ignored.roles, (ignoredRole) => {
              const role = find(
                guild.currentDiscordRoles,
                (r) => r.id === ignoredRole
              );

              if (role)
                return {
                  key: `IgnoredRole-Motion-${ignoredRole}`,
                  element: (
                    <div
                      key={ignoredRole}
                      className="flex w-full flex-col items-center gap-5"
                    >
                      <IgnorePanel
                        prefix="@"
                        requestRemove={() => {
                          setDeleteIgnoreModal(role);
                        }}
                        entity={role}
                      />
                    </div>
                  ),
                };
              return { element: <></>, key: '' };
            })}
          </AnimatedDivList>
        </div>
        <div className="w-full">
          <ButtonCluster
            buttons={[
              {
                text: `Ignore New Role`,
                icon: faAdd,
                onClick: () => {
                  setAddIgnoreModal(true);
                },
              },
            ]}
          />
        </div>
      </div>

      {/* Add Modal */}
      <Modal
        title={`Ignore Role`}
        isOpen={addIgnoreModal}
        requestClose={() => {
          setAddIgnoreModal(false);
        }}
      >
        <form
          onSubmit={handleSubmit(onAddIgnore)}
          className="flex flex-col gap-10"
        >
          <div className="flex w-full flex-wrap gap-5">
            <div className="grow">
              <Select
                disabled={addDisabled}
                formError={errors.ignoredRoleID}
                registerForm={register(`ignoredRoleID`, { required: true })}
                options={(slice(guild.currentDiscordRoles, 1) || []).map(
                  (role) => ({
                    id: role.id,
                    title: role.name,
                  })
                )}
                label={`Role`}
                isInPanel={true}
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-5">
            {addDisabled ? (
              <div className="flex flex-col items-center text-center">
                <h2>You've reached the maximum of 100 Ignored Roles!</h2>
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
                      text: `Ignore Role`,
                    },
                  ]}
                />
              </div>
            )}
          </div>
        </form>
      </Modal>

      {/* Remove Modal */}
      <Modal
        title={`Unlink Ignored Role for @ ${deleteIgnoreModal?.name}?`}
        isOpen={!isUndefined(deleteIgnoreModal)}
        requestClose={() => {
          setDeleteIgnoreModal(undefined);
        }}
      >
        <div className="flex w-full flex-col gap-5">
          <div>
            Are you sure you want to allow <b>@ {deleteIgnoreModal?.name}</b> to
            gain xp again?
          </div>
          <ButtonCluster
            isInPanel
            buttons={[
              {
                onClick: () => {
                  if (deleteIgnoreModal) {
                    onDeleteBoost(deleteIgnoreModal.id);
                    setDeleteIgnoreModal(undefined);
                  }
                },
                submitType: true,
                icon: faRemove,
                feature: ButtonFeature.danger,
                text: `Unlink Ignored Role`,
              },
            ]}
          />
        </div>
      </Modal>
    </>
  );
};

export default IgnoredRoles;
