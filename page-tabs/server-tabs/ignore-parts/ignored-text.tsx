import { faAdd, faRemove } from "@fortawesome/free-solid-svg-icons";
import AnimatedDivList from "components/animated-div-list";
import ButtonCluster, { ButtonFeature } from "components/button-cluster";
import IgnorePanel from "components/ignore-panel";
import Modal from "components/modal";
import Select from "components/select";
import { useServerDetails } from "context/guild-details-context";
import { motion } from "framer-motion";
import {
  cloneDeep,
  filter,
  find,
  isEqual,
  isUndefined,
  map,
  size,
} from "lodash";
import { IDiscordChannel } from "models/backend/discord-models";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { MotionListProps } from "utils/animation-utils";
import { DiscordChannelType } from "utils/discord-utils";

interface AddIgnoreInputs {
  ignoredTextChannelID: string;
}

const IgnoredTextChannels = () => {
  const [addIgnoreModal, setAddIgnoreModal] = useState(false);
  const [deleteIgnoreModal, setDeleteIgnoreModal] = useState<IDiscordChannel>();
  const guild = useServerDetails();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddIgnoreInputs>();

  const addDisabled = size(guild.currentXPGuild?.ignored.channels) >= 100;

  const onAddIgnore: SubmitHandler<AddIgnoreInputs> = (data) => {
    if (!guild.currentXPGuild || !addIgnoreModal) return;
    const g = cloneDeep(guild.currentXPGuild);
    g.ignored.channels = [
      ...filter(
        g.ignored.channels,
        (channel) => !isEqual(channel, data.ignoredTextChannelID)
      ),
      data.ignoredTextChannelID,
    ];

    guild.updateGuild(
      {
        name: `Ignored TextChannel - ${data.ignoredTextChannelID}`,
        oldValue: `${find(g.ignored.channels, (entity) =>
          isEqual(entity, data.ignoredTextChannelID)
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
    g.ignored.channels = filter(
      g.ignored.channels,
      (entity) => !isEqual(entity, id)
    );

    guild.updateGuild(
      {
        name: `Ignored TextChannel - ${id}`,
        oldValue: `Ignored`,
        newValue: `Not Ignored`,
      },
      g
    );
  };
  return (
    <>
      <div className="flex flex-wrap gap-10">
        <div className="flex w-full flex-wrap gap-5 ">
          <AnimatedDivList emptyMessage="You did not set any TextChannels to ignore yet.">
            {map(guild.currentXPGuild?.ignored.channels, (ignoredChannel) => {
              const channel = find(
                guild.currentDiscordChannels,
                (r) =>
                  isEqual(r.id, ignoredChannel) &&
                  isEqual(r.type, DiscordChannelType.text)
              );

              if (channel)
                return {
                  element: (
                    <motion.div
                      {...MotionListProps}
                      key={`IgnoredText-${ignoredChannel}`}
                      className="flex w-full flex-col items-center gap-5"
                    >
                      <IgnorePanel
                        prefix="#"
                        requestRemove={() => {
                          setDeleteIgnoreModal(channel);
                        }}
                        entity={channel}
                      />
                    </motion.div>
                  ),
                  key: `IgnoredText-Motion-${ignoredChannel}`,
                };
              return { element: <></>, key: "" };
            })}
          </AnimatedDivList>
        </div>
        <div className="w-full">
          <ButtonCluster
            buttons={[
              {
                text: `Ignore New TextChannel`,
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
        title="Ignore TextChannel"
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
                formError={errors.ignoredTextChannelID}
                registerForm={register(`ignoredTextChannelID`, {
                  required: true,
                })}
                // lodash gets confused with typing here. therefore we use the legacy map function.
                // eslint-disable-next-line lodash/prefer-lodash-method
                options={(
                  filter(guild.currentDiscordChannels, (channel) =>
                    isEqual(channel.type, DiscordChannelType.text)
                  ) || []
                ).map((channel) => ({
                  id: channel.id,
                  title: channel.name || `Unknown`,
                }))}
                label="TextChannel"
                isInPanel={true}
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-5">
            {addDisabled ? (
              <div className="flex flex-col items-center text-center">
                <h2>
                  You've reached the maximum of 100 Ignored Text Channels!
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
                      text: `Ignore TextChannel`,
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
        title={`Unlink Ignored TextChannel for # ${deleteIgnoreModal?.name}?`}
        isOpen={!isUndefined(deleteIgnoreModal)}
        requestClose={() => {
          setDeleteIgnoreModal(undefined);
        }}
      >
        <div className="flex w-full flex-col gap-5">
          <div>
            Are you sure you want users to gain xp in{" "}
            <b># {deleteIgnoreModal?.name}</b> again?
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
                text: `Unlink Ignored TextChannel`,
              },
            ]}
          />
        </div>
      </Modal>
    </>
  );
};

export default IgnoredTextChannels;
