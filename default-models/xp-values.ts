const XPValues = {
  Essentials: {
    messagexp: {
      name: `Message XP`,
      description: `The amount of XP a user gets per message.`,
      default: 25,
      unit: `%s% xp`,
      premiumFeature: false,
    },
    messagecooldown: {
      name: `Message Cooldown`,
      description: `The time in seconds until the next message will be counted.`,
      default: 0,
      unit: `%s% s`,
      premiumFeature: false,
    },
    voicexp: {
      name: `Voice XP`,
      description: `The amount of XP a user receives per minute in the VC.`,
      default: 60,
      unit: `%s% xp`,
      premiumFeature: false,
    },
    voicejoincooldown: {
      name: `Voice Join Cooldown`,
      description: `The time in seconds until XP starts measuring the user's VC time.`,
      default: 30,
      unit: `%s% s`,
      premiumFeature: false,
    },
    reactionxp: {
      name: `Reaction XP`,
      description: `The amount of XP a user gets per reaction.`,
      default: 1,
      unit: `%s% xp`,
      premiumFeature: false,
    },
  },
  Games: {
    lootXP: {
      name: `Loot XP`,
      description: `The amount of XP a user gets for playing /loot.`,
      default: 25,
      premiumFeature: false,
      unit: `%s% xp`,
    },
    fishXP: {
      name: `Fish XP`,
      description: `The amount of XP a user gets for playing /fish.`,
      default: 25,
      premiumFeature: false,
      unit: `%s% xp`,
    },
    rollXP: {
      name: `Roll XP`,
      description: `The amount of XP a user gets for playing /roll.`,
      default: 25,
      premiumFeature: false,
      unit: `%s% xp`,
    },
    gamecooldown: {
      name: `Game Cooldown`,
      description: `The time in seconds until a user can start a new game.`,
      default: 120,
      unit: `%s% s`,
      premiumFeature: true,
    },
    triviaxp: {
      name: `Trivia XP`,
      description: `The maximum amount of XP a user gets for playing Trivia.`,
      default: 50,
      unit: `%s% xp`,
      premiumFeature: false,
    },
    triviacooldown: {
      name: `Trivia Cooldown`,
      description: `The time in seconds until a user can start a new Trivia game.`,
      default: 10,
      unit: `%s% s`,
      premiumFeature: true,
    },
  },
  Additional: {
    maximumdailyxp: {
      name: `Maximum Daily XP`,
      description: `The maximum amount of XP attainable by executing the "daily" command.`,
      default: 2500,
      unit: `%s% xp`,
      premiumFeature: true,
    },
    maximumlevel: {
      name: `Maximum Level`,
      description: `The maximum level that can be reached.`,
      default: 420,
      unit: `Level %s%`,
      premiumFeature: false,
    },
  },
};

export default XPValues;
