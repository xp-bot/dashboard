import { useServerDetails } from "context/guild-details-context";
import parse from "html-react-parser";
import { IXPLogHit } from "models/backend/xp-models";
import { FC } from "react";
import {
  fixDiscordMarkdownFormat,
  formatNumber,
  formatVoiceTime,
  getAnnounceMessage,
} from "utils/text-utils";

import BasicPanel, { BasicPanelVariant } from "./basic-panel";

interface ILogPanelProps {
  log: IXPLogHit;
}

const LogPanel: FC<ILogPanelProps> = ({ log }) => {
  const guild = useServerDetails();
  switch (log.type) {
    case "settings":
      return (
        <BasicPanel
          borderColor="#f94c4c"
          md
          title={`${log.whoChanged} changed ${log.whatChanged}.`}
          description={`${log.whoChanged} changed **${log.whatChanged}** from ${log.oldValue} to **${log.newValue}**.`}
        />
      );
    case "commands":
      return (
        <BasicPanel
          md
          borderColor="#6767EA"
          title={`${log.username} used a command.`}
          description={`/${log.command}`}
        />
      );
    case "voicetime":
      return (
        <BasicPanel
          md
          borderColor="#6767EA"
          title={`Voicechat XP for ${log.username}.`}
          description={`**Voice Duration:** ${formatVoiceTime(
            log.time
          )}\n**XP added:** ${formatNumber(log.newXP - log.oldXP)}xp`}
        />
      );
    case "levelup":
      return (
        <BasicPanel borderColor="#6767EA" md title={`Level-up Announcement.`}>
          <BasicPanel variant={BasicPanelVariant.inPanel}>
            {parse(
              fixDiscordMarkdownFormat(
                getAnnounceMessage(
                  guild.currentXPGuild?.announce.message || ``,
                  log.username,
                  log.username,
                  `${log.newLevel}`,
                  `${log.oldLevel}`,
                  `${log.newLevel - log.oldLevel}`
                )
              )
            )}
          </BasicPanel>
        </BasicPanel>
      );
    case "xpchanged":
      return (
        <BasicPanel
          md
          borderColor={log.xpChange > 0 ? "#4fc980" : `#f94c4c`}
          title={`${log.username} ${
            log.xpChange > 0 ? `gained` : `lost`
          } ${formatNumber(log.xpChange)}xp.`}
          description={`**Reason**: ${log.reason}`}
        />
      );

    case "exceptions":
      return (
        <BasicPanel borderColor="#f94c4c" md title={log.title}>
          <pre>
            <code>{log.content}</code>
          </pre>
        </BasicPanel>
      );

    default:
      return <></>;
  }
};

export default LogPanel;
