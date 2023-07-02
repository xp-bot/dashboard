// eslint-disable-next-line import/no-cycle
import { faAdd, faRemove } from "@fortawesome/free-solid-svg-icons";
import AnimatedDivList from "components/animated-div-list";
import ButtonCluster, { ButtonFeature } from "components/button-cluster";
import LevelrolePanel from "components/levelrole-panel";
import Modal from "components/modal";
import PageTitle from "components/page-title";
import PanelInput from "components/panel-input";
import Select from "components/select";
import { useServerDetails } from "context/guild-details-context";
import {
  cloneDeep,
  filter,
  find,
  isEqual,
  isUndefined,
  map,
  partition,
  size,
  slice,
  sortBy,
} from "lodash";
import { FC, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface RoleInputs {
  level?: number;
  role: string;
}
interface AddAutoroleInputs {
  role: string;
}

interface ServerTabRolesProps {}

const ServerTabRoles: FC<ServerTabRolesProps> = () => {
  const [addRoleModal, setAddRoleModal] = useState(false);
  const [addAutoroleModal, setAddAutoroleModal] = useState(false);
  const [deleteRoleModal, setDeleteRoleModal] = useState<{
    level: number;
    name: string;
  }>();
  const guild = useServerDetails();

  const {
    register: addRoleRegister,
    handleSubmit: addRoleHandleSubmit,
    formState: { errors: addRoleErrors },
  } = useForm<RoleInputs>();

  const {
    register: addAutoroleRegister,
    handleSubmit: addAutoroleHandleSubmit,
    formState: { errors: addAutoroleErrors },
  } = useForm<RoleInputs>();

  const addRole = (data: RoleInputs) => {
    const level = isUndefined(data.level) ? -1 : data.level;

    if (!guild.currentXPGuild) return;
    const g = cloneDeep(guild.currentXPGuild);
    const current = filter(g.levelroles, (role) => !isEqual(role.level, level));
    current.push({ id: data.role, level: level });
    g.levelroles = current;
    guild.updateGuild(
      {
        name: `Level ${level}`,
        oldValue:
          find(g.levelroles, (role) => isEqual(role.level, level))?.id ||
          `Not Set`,
        newValue: data.role,
      },
      g
    );
    setAddRoleModal(false);
    setAddAutoroleModal(false);
  };

  const addRoleLevel = (data: {
    roleID: string;
    oldLevel: number;
    newLevel: number;
  }) => {
    if (!guild.currentXPGuild) return;
    const g = cloneDeep(guild.currentXPGuild);
    const current = partition(g.levelroles, (role) =>
      isEqual(role.level, data.oldLevel)
    );
    g.levelroles = [{ id: data.roleID, level: data.newLevel }, ...current[1]];
    guild.updateGuild(
      {
        name: `Role ${data.roleID}`,
        oldValue: `${data.oldLevel}`,
        newValue: `${data.newLevel}`,
      },
      g
    );
    setAddRoleModal(false);
    setAddAutoroleModal(false);
  };
  const onAddRole: SubmitHandler<RoleInputs> = (data) => {
    addRole(data);
  };
  const onAddAutorole: SubmitHandler<AddAutoroleInputs> = (data) => {
    addRole(data);
  };
  const onDeleteRole = (level: number) => {
    if (!guild.currentXPGuild) return;
    const g = cloneDeep(guild.currentXPGuild);
    g.levelroles = filter(g.levelroles, (role) => !isEqual(role.level, level));
    guild.updateGuild(
      {
        name: `Level ${level}`,
        oldValue:
          find(g.levelroles, (role) => isEqual(role.level, level))?.id ||
          `Not Set`,
        newValue: `Not Set`,
      },
      g
    );
  };

  const allLevelroles = partition(
    sortBy(guild.currentXPGuild?.levelroles, (role) => role.level),
    (r) => r.level >= 0
  );

  const levelroles = allLevelroles[0];
  const autorole = allLevelroles[1][0];

  const autoroleRole = autorole
    ? find(guild.currentDiscordRoles, (r) => r.id === autorole.id)
    : undefined;

  return (
    <>
      <div>
        <PageTitle
          title="Levelroles"
          tooltipText="Levelroles allow you to automatically assign roles to users based on their level."
        />
        <div className="flex flex-wrap gap-10">
          <div className="flex w-full flex-wrap gap-5">
            <AnimatedDivList emptyMessage="You did not set any Levelroles yet.">
              {map(levelroles, (levelrole, idx) => {
                const role = find(
                  guild.currentDiscordRoles,
                  (r) => r.id === levelrole.id
                );

                if (role)
                  return {
                    key: `Levelrole-Motion-${levelrole.level}`,
                    element: (
                      <>
                        <LevelrolePanel
                          availableDiscordRoles={guild.currentDiscordRoles}
                          requestRemove={() => {
                            setDeleteRoleModal({
                              level: levelrole.level,
                              name: role.name,
                            });
                          }}
                          requestChangeDetails={(roleID, newLevel) => {
                            if (roleID)
                              addRole({ level: levelrole.level, role: roleID });
                            else if (!isUndefined(newLevel))
                              addRoleLevel({
                                roleID: role.id,
                                oldLevel: levelrole.level,
                                newLevel,
                              });
                          }}
                          level={levelrole.level}
                          role={role}
                        />
                        {!isEqual(
                          idx,
                          size(guild.currentXPGuild?.levelroles) - 1
                        ) && <></>}
                      </>
                    ),
                  };
                return { element: <></>, key: "" };
              })}
            </AnimatedDivList>
          </div>
          <div className="w-full">
            <ButtonCluster
              buttons={[
                {
                  text: `Add Levelrole`,
                  icon: faAdd,
                  onClick: () => {
                    setAddRoleModal(true);
                  },
                },
              ]}
            />
          </div>
        </div>
      </div>
      <hr className="mx-auto -mb-3 mt-2 w-4/5" />
      <div>
        <PageTitle
          title="Autorole"
          disableArrow
          tooltipText="The Autorole is automatically assigned to every user upon joining, regardless of level."
        />
        <div className="flex flex-wrap gap-10">
          <div className="flex w-full flex-col gap-5">
            <>
              {autorole && autoroleRole ? (
                <LevelrolePanel
                  requestChange={() => {
                    setAddAutoroleModal(true);
                  }}
                  requestRemove={() => {
                    setDeleteRoleModal({ level: -1, name: autoroleRole.name });
                  }}
                  level={-1}
                  role={autoroleRole}
                />
              ) : (
                <div className="w-full">
                  <ButtonCluster
                    buttons={[
                      {
                        text: `Set Autorole`,
                        icon: faAdd,
                        onClick: () => {
                          setAddAutoroleModal(true);
                        },
                      },
                    ]}
                  />
                </div>
              )}
            </>
          </div>
        </div>
      </div>
      <Modal
        title="Add Role"
        isOpen={addRoleModal}
        requestClose={() => {
          setAddRoleModal(false);
        }}
        customKey="add_role"
      >
        <form
          onSubmit={addRoleHandleSubmit(onAddRole)}
          className="flex flex-col gap-10"
        >
          <div className="flex w-full flex-wrap gap-5">
            <div className="grow">
              <PanelInput
                disabled={size(guild.currentXPGuild?.levelroles) >= 100}
                registerForm={addRoleRegister(`level`, {
                  required: "This Input is required!",
                  min: {
                    value: 0,
                    message:
                      "You cannot assign levelroles for negative levels.",
                  },
                })}
                label="Level"
                inputProps={{ type: "number" }}
                value={12}
                formError={addRoleErrors.level}
              />
            </div>
            <div className="grow">
              <Select
                disabled={size(guild.currentXPGuild?.levelroles) >= 100}
                formError={addRoleErrors.role}
                registerForm={addRoleRegister(`role`, { required: true })}
                options={map(
                  sortBy(
                    slice(guild.currentDiscordRoles, 1),
                    (role) => role.name
                  ),
                  (role) => ({
                    id: role.id,
                    title: `@ ${role.name}`,
                  })
                )}
                label="Role"
                isInPanel={true}
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-5">
            {size(guild.currentXPGuild?.levelroles) >= 100 ? (
              <div className="flex flex-col items-center text-center">
                <h2>You've reached the maximum of 100 Roles!</h2>
                <span>Delete some in order to create a new one.</span>
              </div>
            ) : (
              <div className="w-full">
                <ButtonCluster
                  isInPanel
                  buttons={[
                    {
                      disabled: size(guild.currentXPGuild?.levelroles) >= 100,
                      submitType: true,
                      icon: faAdd,
                      text: `Add Role`,
                    },
                  ]}
                />
              </div>
            )}
          </div>
        </form>
      </Modal>
      <Modal
        title="Set Autorole"
        isOpen={addAutoroleModal}
        requestClose={() => {
          setAddAutoroleModal(false);
        }}
        customKey="set_autorole"
      >
        <form
          onSubmit={addAutoroleHandleSubmit(onAddAutorole)}
          className="flex flex-col gap-10"
        >
          <div className="flex w-full flex-wrap gap-5">
            <div className="grow">
              <Select
                disabled={size(guild.currentXPGuild?.levelroles) >= 100}
                formError={addAutoroleErrors.role}
                registerForm={addAutoroleRegister(`role`, { required: true })}
                options={map(
                  sortBy(
                    slice(guild.currentDiscordRoles, 1),
                    (role) => role.name
                  ),
                  (role) => ({
                    id: role.id,
                    title: `@ ${role.name}`,
                  })
                )}
                label="Role"
                isInPanel={true}
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-5">
            {size(guild.currentXPGuild?.levelroles) >= 100 ? (
              <div className="flex flex-col items-center text-center">
                <h2>You've reached the maximum of 100 Roles!</h2>
                <span>Delete some in order to create a new one.</span>
              </div>
            ) : (
              <div className="w-full">
                <ButtonCluster
                  isInPanel
                  buttons={[
                    {
                      disabled: size(guild.currentXPGuild?.levelroles) >= 100,
                      submitType: true,
                      icon: faAdd,
                      text: `Set Autorole`,
                    },
                  ]}
                />
              </div>
            )}
          </div>
        </form>
      </Modal>
      <Modal
        title={`Unlink ${
          deleteRoleModal?.level && deleteRoleModal?.level < 0
            ? `Autorole`
            : `Lvl. ${deleteRoleModal?.level}`
        }?`}
        isOpen={!isUndefined(deleteRoleModal)}
        requestClose={() => {
          setDeleteRoleModal(undefined);
        }}
      >
        <div className="flex w-full flex-col gap-5">
          <div>
            Are you sure you want to unlink <b>@{deleteRoleModal?.name}</b>
            {deleteRoleModal?.level && deleteRoleModal?.level > 0 ? (
              <>
                {" "}
                from <b>Level {deleteRoleModal?.level}</b>
              </>
            ) : (
              <></>
            )}
            ?
          </div>
          <ButtonCluster
            isInPanel
            buttons={[
              {
                onClick: () => {
                  if (deleteRoleModal) {
                    onDeleteRole(deleteRoleModal?.level);
                    setDeleteRoleModal(undefined);
                  }
                },
                submitType: true,
                icon: faRemove,
                feature: ButtonFeature.danger,
                text: `Unlink ${
                  deleteRoleModal?.level && deleteRoleModal?.level > 0
                    ? `Role`
                    : `Autorole`
                }`,
              },
            ]}
          />
        </div>
      </Modal>
    </>
  );
};

export default ServerTabRoles;
