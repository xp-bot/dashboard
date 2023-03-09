export interface ITokenCluster {
  access_token: string;
  refresh_token: string;
}

export interface IDiscordPartialGuild {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: string[];
  features: string[];
  xpInvited?: boolean;
}

export interface IDiscordGuildsRequest extends IDiscordPartialGuild {
  premium: {
    premium: boolean;
    voteFree: boolean;
  };
}

export interface IDiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar?: string;
  bot?: boolean;
  system?: boolean;
  mfa_enabled?: boolean;
  banner?: string;
  accent_color?: number;
  locale?: string;
  verified?: boolean;
  flags?: number;
  premium_type?: number;
  public_flags?: number;
}

export interface IDiscordUserLookup {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  banner: string;
}

export interface IDiscordChannel {
  id: string;
  type: number;
  guild_id?: string;
  position?: number;
  permission_overwrites?: 'array of overwrite objects';
  name?: string;
  topic?: string;
  nsfw?: boolean;
  last_message_id?: string;
  bitrate?: number;
  user_limit?: number;
  rate_limit_per_user?: number;
  recipients?: 'array of user objects';
  icon?: string;
  owner_id?: string;
  application_id?: string;
  parent_id?: string;
  last_pin_timestamp?: 'ISO8601 timestamp';
  rtc_region?: string;
  video_quality_mode?: number;
  message_count?: number;
  member_count?: number;
  thread_metadata?: 'a thread metadata object';
  member?: 'a thread member object';
  default_auto_archive_duration?: number;
  permissions?: string;
}

export interface IDiscordRole {
  id: string;
  name: string;
  color: number;
  hoist: boolean;
  icon?: string;
  unicode_emoji?: string;
  position: number;
  permissions: string;
  managed: boolean;
  mentionable: boolean;
  tags?: 'role tags object';
}
