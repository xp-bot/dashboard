import { faAdd, faRemove } from "@fortawesome/free-solid-svg-icons";
import AnimatedDivList from "components/animated-div-list";
import ButtonCluster, { ButtonFeature } from "components/button-cluster";
import IgnorePanel from "components/ignore-panel";
import Modal from "components/modal";
import Select from "components/select";
import { useServerDetails } from "context/guild-details-context";
import {
  cloneDeep,
  filter,
  find,
  isEqual,
  isUndefined,
  map,
  size,
  slice,
} from "lodash";
import { IDiscordChannel } from "models/backend/discord-models";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { DiscordChannelType } from "utils/discord-utils";
import getTypeSpecificChannels from "utils/get-type-specific-channels";

interface AddIgnoreInputs {
  ignoredCategoryID: string;
}

const IgnoredCategories = () => {
  const [addIgnoreModal, setAddIgnoreModal] = useState(false);
  const [deleteIgnoreModal, setDeleteIgnoreModal] = useState<IDiscordChannel>();
  const guild = useServerDetails();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddIgnoreInputs>();

  const addDisabled = size(guild.currentXPGuild?.ignored.categories) >= 100;

  const onAddIgnore: SubmitHandler<AddIgnoreInputs> = (data) => {
    if (!guild.currentXPGuild || !addIgnoreModal) return;
    const g = cloneDeep(guild.currentXPGuild);
    g.ignored.categories = [
      ...filter(
        g.ignored.categories,
        (channel) => !isEqual(channel, data.ignoredCategoryID)
      ),
      data.ignoredCategoryID,
    ];

    guild.updateGuild(
      {
        name: `Ignored Category - ${data.ignoredCategoryID}`,
        oldValue: `${find(g.ignored.categories, (entity) =>
          isEqual(entity, data.ignoredCategoryID)
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
    g.ignored.categories = filter(
      g.ignored.categories,
      (entity) => !isEqual(entity, id)
    );

    guild.updateGuild(
      {
        name: `Ignored Category - ${id}`,
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
          <AnimatedDivList emptyMessage="You did not set any Categories to ignore yet.">
            {map(
              guild.currentXPGuild?.ignored.categories,
              (ignoredCategory) => {
                const channel = find(
                  guild.currentDiscordChannels,
                  (r) =>
                    isEqual(r.id, ignoredCategory) &&
                    isEqual(r.type, DiscordChannelType.category)
                );

                if (channel)
                  return {
                    key: `IgnoredCategory-Motion-${ignoredCategory}`,
                    element: (
                      <div
                        key={ignoredCategory}
                        className="flex w-full flex-col items-center gap-5"
                      >
                        <IgnorePanel
                          prefix=""
                          requestRemove={() => {
                            setDeleteIgnoreModal(channel);
                          }}
                          entity={channel}
                        />
                      </div>
                    ),
                  };
                return { element: <></>, key: "" };
              }
            )}
          </AnimatedDivList>
        </div>
        <div className="w-full">
          <ButtonCluster
            buttons={[
              {
                text: `Ignore New Category`,
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
        title={`Ignore Category`}
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
                formError={errors.ignoredCategoryID}
                registerForm={register(`ignoredCategoryID`, {
                  required: true,
                })}
                options={(
                  slice(
                    getTypeSpecificChannels(
                      guild.currentDiscordChannels || [],
                      DiscordChannelType.category
                    ),
                    1
                  ) || []
                ).map((channel) => ({
                  id: channel.id,
                  title: channel.name || `Unknown`,
                }))}
                label={`Category`}
                isInPanel={true}
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-5">
            {addDisabled ? (
              <div className="flex flex-col items-center text-center">
                <h2>You've reached the maximum of 100 Ignored Categories!</h2>
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
                      text: `Ignore Category`,
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
        title={`Unlink Ignored Category for ${deleteIgnoreModal?.name}?`}
        isOpen={!isUndefined(deleteIgnoreModal)}
        requestClose={() => {
          setDeleteIgnoreModal(undefined);
        }}
      >
        <div className="flex w-full flex-col gap-5">
          <div>
            Are you sure you want users to gain xp in{" "}
            <b>{deleteIgnoreModal?.name}</b> again?
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
                text: `Unlink Ignored Category`,
              },
            ]}
          />
        </div>
      </Modal>
    </>
  );
};

export default IgnoredCategories;
