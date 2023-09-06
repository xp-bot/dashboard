import { filter } from "lodash";
import { IDiscordChannel } from "models/backend/discord-models";
import { DiscordChannelType } from "./discord-utils";

export default (channels: IDiscordChannel[], ...types: DiscordChannelType[]) =>
  filter(channels, (channel) => types.includes(channel.type));
