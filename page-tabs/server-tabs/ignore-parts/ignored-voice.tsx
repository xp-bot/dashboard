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
  ignoredVoiceChannelID: string;
}

const IgnoredVoiceChannels = () => {
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
        (channel) => !isEqual(channel, data.ignoredVoiceChannelID)
      ),
      data.ignoredVoiceChannelID,
    ];

    guild.updateGuild(
      {
        name: `Ignored VoiceChannel - ${data.ignoredVoiceChannelID}`,
        oldValue: `${find(g.ignored.channels, (entity) =>
          isEqual(entity, data.ignoredVoiceChannelID)
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
        name: `Ignored VoiceChannel - ${id}`,
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
          <AnimatedDivList emptyMessage="You did not set any VoiceChannels to ignore yet.">
            {map(guild.currentXPGuild?.ignored.channels, (ignoredChannel) => {
              const channel = find(
                guild.currentDiscordChannels,
                (r) =>
                  isEqual(r.id, ignoredChannel) &&
                  (isEqual(r.type, DiscordChannelType.voice) ||
                    isEqual(r.type, DiscordChannelType.stage_voice))
              );

              if (channel)
                return {
                  key: `IgnoredVoice-Motion-${ignoredChannel}`,
                  element: (
                    <div
                      key={ignoredChannel}
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
            })}
          </AnimatedDivList>
        </div>
        <div className="w-full">
          <ButtonCluster
            buttons={[
              {
                text: `Ignore New VoiceChannel`,
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
        title={`Ignore VoiceChannel`}
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
                formError={errors.ignoredVoiceChannelID}
                registerForm={register(`ignoredVoiceChannelID`, {
                  required: true,
                })}
                options={(
                  slice(
                    getTypeSpecificChannels(
                      guild.currentDiscordChannels || [],
                      DiscordChannelType.voice,
                      DiscordChannelType.stage_voice
                    ),
                    1
                  ) || []
                ).map((channel) => ({
                  id: channel.id,
                  title: channel.name || `Unknown`,
                }))}
                label={`VoiceChannel`}
                value={"0"}
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
                      text: `Ignore VoiceChannel`,
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
        title={`Unlink Ignored VoiceChannel for ${deleteIgnoreModal?.name}?`}
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
                text: `Unlink Ignored VoiceChannel`,
              },
            ]}
          />
        </div>
      </Modal>
    </>
  );
};

export default IgnoredVoiceChannels;
