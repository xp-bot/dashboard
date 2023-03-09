const XPModules = {
  XP: {
    messagexp: {
      name: `Message XP`,
      description: `Let users get XP by writing messages.`,
      default: true,
      premiumFeature: false,
    },
    voicexp: {
      name: `Voice XP`,
      description: `Let users get XP by talking in VoiceChannels.`,
      default: true,
      premiumFeature: false,
    },
    reactionxp: {
      name: `Reaction XP`,
      description: `Let users get XP by reacting to messages.`,
      default: true,
      premiumFeature: false,
    },
    ignoreafk: {
      name: `Ignore AFK`,
      description: `Disable XP in AFK Channels.`,
      default: true,
      premiumFeature: false,
    },
  },
  Moderation: {
    autonick: {
      name: `Autonick`,
      description: `Automatically show the level of each user in their nicknames.`,
      default: false,
      premiumFeature: false,
    },
    autonickuseprefix: {
      name: `Autonick Use Prefix`,
      description: `Show the level on the left side of a user's nickname.`,
      default: false,
      premiumFeature: true,
    },
    autonickshowstring: {
      name: `Autonick Show String`,
      description: `Show "Lvl." in the nickname when Autonick is enabled.`,
      default: true,
      premiumFeature: true,
    },
    leaderboard: {
      name: `Leaderboard`,
      description: `Let your users become competitive.`,
      default: true,
      premiumFeature: false,
    },
    singlerankrole: {
      name: `Single Rank Role`,
      description: `Always give your users only the highest achieved role, and remove all LevelRoles below it.`,
      default: false,
      premiumFeature: false,
    },
    removereachedlevelroles: {
      name: `Remove Reached Levelroles`,
      description: `Remove roles that are above a user's level as soon as the user's xp has been reduced.`,
      default: false,
      premiumFeature: true,
    },
    // userrankingoverride: {
    //   name: `User Ranking Override`,
    //   description: `Give users XP even if they have disabled their ranking.`,
    //   default: false,
    //   premiumFeature: false,
    // },
    maximumlevel: {
      name: `Maximum Level`,
      description: `Limit the maximum level that users can reach.`,

      default: false,
      premiumFeature: false,
    },
    resetonleave: {
      name: `Reset User On Leave`,
      description: `Delete the user data as soon as a user leaves the server.`,
      default: false,
      premiumFeature: true,
    },
    enablecommandsinthreads: {
      name: `Enable Commands In Threads`,
      description: `Let users use xp commands in threads.`,
      default: false,
      premiumFeature: true,
    },
  },
  Games: {
    games: {
      name: `Games`,
      description: `Let your users earn XP by playing games.`,
      default: true,
      premiumFeature: false,
    },
    trivia: {
      name: `Trivia`,
      description: `Let your users prove their knowledge.`,
      default: true,
      premiumFeature: false,
    },
  },
};

export default XPModules;
