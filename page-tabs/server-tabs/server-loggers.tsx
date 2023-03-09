// eslint-disable-next-line import/no-cycle
import DropdownPanel from 'components/dropdown-panel';
import PageTitle from 'components/page-title';
import { useServerDetails } from 'context/guild-details-context';
import { cloneDeep, filter, isEqual, isUndefined, map } from 'lodash';
import { FC } from 'react';
import { DiscordChannelType } from 'utils/discord-utils';

interface ServerTabLoggersProps {}

const ServerTabLoggers: FC<ServerTabLoggersProps> = () => {
  const guild = useServerDetails();
  const textChannels = guild.currentDiscordChannels
    ? map(
        filter(guild.currentDiscordChannels, (channel) =>
          isEqual(channel.type, DiscordChannelType.text)
        ),
        (channel) => ({
          id: channel.id,
          title: `# ${channel.name}` || `Unknown`,
        })
      )
    : [];
  const onChange = (logger: string, channel: string) => {
    if (isUndefined(guild.currentXPGuild)) return;
    const g = cloneDeep(guild.currentXPGuild);
    g.logs[logger] = isEqual(channel, `0`) ? null : channel;
    guild.updateGuild(
      {
        name: logger,
        newValue: isEqual(channel, `0`) ? `Disabled` : channel,
        oldValue: guild.currentXPGuild.logs[logger] || `Disabled`,
      },
      g
    );
  };
  return (
    <>
      {!isUndefined(guild.currentXPGuild) &&
        !isUndefined(guild.currentDiscordChannels) && (
          <div>
            <PageTitle
              title="Loggers"
              tooltipText="Loggers allow monitoring of activity while staying in discord."
            />
            <div className="flex flex-wrap gap-5">
              <div className="grow">
                <DropdownPanel
                  dropdownName="Voicetime"
                  dropdownDescription="Info on completed voice sessions will be posted here."
                  value={
                    guild.currentXPGuild.logs.voicetime
                      ? guild.currentXPGuild.logs.voicetime
                      : '0'
                  }
                  options={[{ id: '0', title: 'No Channel' }, ...textChannels]}
                  onChange={(id) => {
                    onChange(`voicetime`, id);
                  }}
                />
              </div>
              <div className="grow">
                <DropdownPanel
                  dropdownName="Exceptions"
                  dropdownDescription="If XP throws an error, it will be posted here."
                  value={
                    guild.currentXPGuild.logs.exceptions
                      ? guild.currentXPGuild.logs.exceptions
                      : '0'
                  }
                  options={[{ id: '0', title: 'No Channel' }, ...textChannels]}
                  onChange={(id) => {
                    onChange(`exceptions`, id);
                  }}
                />
              </div>
            </div>
          </div>
        )}
    </>
  );
};

export default ServerTabLoggers;
