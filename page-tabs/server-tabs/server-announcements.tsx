// eslint-disable-next-line import/no-cycle
import BasicPanel from "components/basic-panel";
import BlockButton, { BlockButtonVariant } from "components/block-button";
import CheckboxContentPanel from "components/checkbox-content-panel";
import DropdownPanel from "components/dropdown-panel";
import MultilineInput from "components/multiline-input";
import PageTitle from "components/page-title";
import { useServerDetails } from "context/guild-details-context";
import parse from "html-react-parser";
import {
  cloneDeep,
  filter,
  isEqual,
  isNil,
  isUndefined,
  join,
  map,
  noop,
  size,
  slice,
  split,
} from "lodash";
import { FC, useRef, useState } from "react";
import { DiscordChannelType } from "utils/discord-utils";
import {
  fixDiscordMarkdownFormat,
  getAnnounceMessage,
  stripHtml,
} from "utils/text-utils";

interface ServerTabAnnouncementsProps {}

const ServerTabAnnouncements: FC<ServerTabAnnouncementsProps> = () => {
  const guild = useServerDetails();
  const [cursorPos, setCursorPos] = useState(0);

  const messageInput = useRef<HTMLTextAreaElement>(null);

  const editAnnouncementMessage = (text: string) => {
    if (!guild.currentXPGuild) return;
    const g = cloneDeep(guild.currentXPGuild);
    g.announce.message = join(slice(text, 0, 250), ``);
    guild.updateGuild(undefined, g);
  };

  const maxiumMessageLengthReached =
    size(guild.currentXPGuild?.announce.message) / 250;

  const addVariable = (variable: string) => {
    if (
      !guild.currentXPGuild ||
      size(guild.currentXPGuild.announce.message) + size(variable) > 250
    )
      return;
    const splitChars = split(guild.currentXPGuild.announce.message, ``);
    const newMessage = `${join(
      slice(splitChars, 0, cursorPos),
      ``
    )} ${variable} ${join(slice(splitChars, cursorPos), ``)}`;
    editAnnouncementMessage(newMessage);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    messageInput.current ? (messageInput.current.value = newMessage) : noop;
  };

  return (
    <>
      {!isUndefined(guild.currentXPGuild) && (
        <>
          <div className="flex flex-col items-center gap-5">
            <div className="w-full">
              <PageTitle
                title="Announcements"
                tooltipText="Announcements will pe posted once a user reaches a new level."
              />
              <div className="flex flex-col items-center gap-5">
                <div className="grid w-full gap-5 md:grid-cols-2 md:gap-6">
                  <div className="flex w-full flex-col gap-5 md:justify-between md:gap-0">
                    <CheckboxContentPanel
                      increaseGap
                      tooltipText="Select whether the announcement will be posted into a specific channel or not."
                      defaultChecked={!guild.currentXPGuild.announce.current}
                      title="Specify Channel"
                      onChange={(value) => {
                        if (!guild.currentXPGuild) return;
                        const g = cloneDeep(guild.currentXPGuild);
                        g.announce.current = !value;
                        guild.updateGuild(
                          {
                            name: `Announcement Specify Channel`,
                            oldValue: !guild.currentXPGuild.announce.current
                              ? `Enabled`
                              : `Disabled`,
                            newValue: value ? `Enabled` : `Disabled`,
                          },
                          g
                        );
                      }}
                    />
                    <CheckboxContentPanel
                      increaseGap
                      defaultChecked={guild.currentXPGuild.announce.ping}
                      title="Ping Users"
                      tooltipText="Select whether the announcement pings the user that reached a new level."
                      onChange={(value) => {
                        if (!guild.currentXPGuild) return;
                        const g = cloneDeep(guild.currentXPGuild);
                        g.announce.ping = value;
                        guild.updateGuild(
                          {
                            name: `Announcement Ping Users`,
                            oldValue: guild.currentXPGuild.announce.ping
                              ? `Enabled`
                              : `Disabled`,
                            newValue: value ? `Enabled` : `Disabled`,
                          },
                          g
                        );
                      }}
                    />
                  </div>
                  <div className="w-full">
                    <DropdownPanel
                      disabled={guild.currentXPGuild.announce.current}
                      dropdownName="Announcement Channel"
                      tooltipText={
                        !guild.currentXPGuild.announce.current
                          ? "Select the channel the announcement will be posted in."
                          : undefined
                      }
                      value={guild.currentXPGuild.logs.levelup || undefined}
                      dropdownDescription="Announcement Messages will be sent here."
                      onChange={(value) => {
                        if (!guild.currentXPGuild) return;
                        const g = cloneDeep(guild.currentXPGuild);
                        if (isEqual(value, `0`)) g.logs.levelup = null;
                        else g.logs.levelup = value;
                        guild.updateGuild(
                          {
                            name: `Announcements Channel`,
                            newValue: isNil(g.logs.levelup)
                              ? `No Channel Set`
                              : value,
                            oldValue: isNil(guild.currentXPGuild.logs.levelup)
                              ? `No Channel Set`
                              : guild.currentXPGuild.logs.levelup,
                          },
                          g
                        );
                      }}
                      options={[
                        { title: `Channel Not Set`, id: "0" },
                        ...map(
                          filter(
                            guild.currentDiscordChannels,
                            (channel) =>
                              isEqual(channel.type, DiscordChannelType.text) ||
                              isEqual(channel.type, DiscordChannelType.news)
                          ),
                          (channel) => {
                            return {
                              id: channel.id,
                              title: `#${channel.name || `Unknown`}`,
                            };
                          }
                        ),
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>
            <hr className="-mb-1 mt-5 w-[80%]" />
            <div className="w-full">
              <PageTitle disableArrow title="Announcement Message Designer" />
              <div className="flex flex-col items-center gap-5">
                <BasicPanel
                  title="Message Preview"
                  tooltipText="This is what your announcement will look like."
                >
                  <div className="h-full w-full overflow-hidden break-words rounded-md border-2 border-l-4 border-[#F2F3F5] border-l-xpBlue bg-[#FFFFFF] p-3 text-[#2E3338] shadow-md dark:border-y-transparent dark:border-r-transparent dark:bg-[#36393F] dark:text-darkText-darkMode dark:shadow-none">
                    {parse(
                      fixDiscordMarkdownFormat(
                        stripHtml(
                          document,
                          getAnnounceMessage(
                            guild.currentXPGuild.announce.message
                          )
                        )
                      )
                    )}
                  </div>
                </BasicPanel>
                <div className="grid w-full gap-5 md:grid-cols-[1fr_250px]">
                  <BasicPanel title="Message Editor">
                    <i
                      className={`${
                        maxiumMessageLengthReached < 0.5
                          ? `opacity-0`
                          : maxiumMessageLengthReached < 0.75
                          ? `opacity-25`
                          : maxiumMessageLengthReached < 0.9
                          ? `opacity-50`
                          : maxiumMessageLengthReached >= 1
                          ? `opacity-100`
                          : `opacity-75`
                      } absolute right-3 top-3 transition ease-in-out`}
                    >
                      <span
                        className={`${
                          maxiumMessageLengthReached < 0.9
                            ? ``
                            : maxiumMessageLengthReached < 0.95
                            ? `text-red-300`
                            : maxiumMessageLengthReached <= 1
                            ? `font-semibold text-red-500`
                            : ``
                        } transition ease-in-out`}
                      >
                        {250 - size(guild.currentXPGuild.announce.message)}
                      </span>{" "}
                      / 250
                    </i>
                    <MultilineInput
                      value={guild.currentXPGuild.announce.message}
                      onChange={(e) => {
                        if (!e.target.value) return;
                        editAnnouncementMessage(e.target.value);
                        setCursorPos(e.target.selectionStart);
                      }}
                      inputProps={{
                        maxLength: 250,
                        onBlur: (e) => {
                          setCursorPos(e.target.selectionStart);
                        },
                        ref: messageInput,
                      }}
                    />
                  </BasicPanel>
                  <BasicPanel
                    title="Toolbox"
                    tooltipText="Use the toolbox to add variables to your announcement."
                  >
                    <BlockButton
                      onClick={() => {
                        addVariable("{TAG}");
                      }}
                      variant={BlockButtonVariant.inPanel}
                    >
                      Add User Tag
                    </BlockButton>
                    <BlockButton
                      onClick={() => {
                        addVariable("{MNT}");
                      }}
                      variant={BlockButtonVariant.inPanel}
                    >
                      Add User Mention
                    </BlockButton>
                    <BlockButton
                      onClick={() => {
                        addVariable("{OLDLVL}");
                      }}
                      variant={BlockButtonVariant.inPanel}
                    >
                      Add Old Level
                    </BlockButton>
                    <BlockButton
                      onClick={() => {
                        addVariable("{LVL}");
                      }}
                      variant={BlockButtonVariant.inPanel}
                    >
                      Add New Level
                    </BlockButton>
                    <BlockButton
                      onClick={() => {
                        addVariable("{CMB}");
                      }}
                      variant={BlockButtonVariant.inPanel}
                    >
                      Add Climbed Levels
                    </BlockButton>
                  </BasicPanel>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ServerTabAnnouncements;
