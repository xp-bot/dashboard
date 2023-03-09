import {
  IDiscordGuildsRequest,
  IDiscordPartialGuild,
  IDiscordRole,
  IDiscordUser,
  IDiscordUserLookup,
} from '../models/backend/discord-models';
import {
  IXPLeaderboardGuild,
  IXPLeaderboardUser,
} from '../models/backend/xp-models';

export const guildIconToURL = (
  guild?: Partial<
    IDiscordPartialGuild | IDiscordGuildsRequest | IXPLeaderboardGuild
  >,
  size?: number
) => {
  if (!guild || !guild.icon) {
    return `https://cdn.namespace.media/s/ofpajSeo5zoymxL/download/LOGO_3_x250.png`;
  }
  if (guild.icon.startsWith(`a_`)) {
    return `https://cdn.discordapp.com/icons/${guild.id}/${
      guild.icon
    }.gif?size=${size || 256}`;
  }
  return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=${
    size || 256
  }`;
};

export const avatarToURL = (
  user?: IDiscordUser | IXPLeaderboardUser | IDiscordUserLookup,
  size?: number,
  noAnimated?: boolean
) => {
  if (!user || !user.avatar) {
    return `https://cdn.namespace.media/s/ofpajSeo5zoymxL/download/LOGO_3_x250.png`;
  }
  if (user.avatar.startsWith(`a_`) && !noAnimated) {
    return `https://cdn.discordapp.com/avatars/${user.id}/${
      user.avatar
    }.gif?size=${size || 64}`;
  }
  return `https://cdn.discordapp.com/avatars/${user.id}/${
    user.avatar
  }.png?size=${size || 64}`;
};

export const userBannerToURL = (
  user?: IDiscordUser | IXPLeaderboardUser | { banner: string; id: string },
  size?: number,
  noAnimated?: boolean
) => {
  if (!user || !user.banner) {
    return `https://cdn.namespace.media/s/PDDtCjSLMrHz9R5/download/SPLASH_Pride.png`;
  }
  if (user.banner.startsWith(`a_`) && !noAnimated) {
    return `https://cdn.discordapp.com/banners/${user.id}/${
      user.banner
    }.gif?size=${size || 1024}`;
  }
  return `https://cdn.discordapp.com/banners/${user.id}/${
    user.banner
  }.png?size=${size || 1024}`;
};

export const roleIconToURL = (role: IDiscordRole, size?: number) => {
  if (!role.icon) {
    return false;
  }
  if (role.icon.startsWith(`a_`)) {
    return `https://cdn.discordapp.com/role-icons/${role.id}/${
      role.icon
    }.gif?size=${size || 64}`;
  }
  return `https://cdn.discordapp.com/role-icons/${role.id}/${
    role.icon
  }.png?size=${size || 64}`;
};

export enum DiscordChannelType {
  'text' = 0,
  'private' = 1,
  'voice' = 2,
  'group' = 3,
  'category' = 4,
  'news' = 5,
  'news_thread' = 10,
  'public_thread' = 11,
  'private_thread' = 12,
  'stage_voice' = 13,
  'directory' = 14,
  'forum' = 15,
}

export const toColor = (num: number) => {
  // eslint-disable-next-line no-param-reassign, no-bitwise
  num >>>= 0;
  // eslint-disable-next-line no-bitwise
  const b = num & 0xff;
  // eslint-disable-next-line no-bitwise
  const g = (num & 0xff00) >>> 8;
  // eslint-disable-next-line no-bitwise
  const r = (num & 0xff0000) >>> 16;
  const a = 0.75;
  // a = ((num & 0xff000000) ><ü>> 24) / 255;

  return `rgba(${[r, g, b, a].join(',')})`;
};
