import type { Configuration } from "@happykit/flags/config";

export type AppFlags = {
    "disable-leaderboard-arrows": boolean;
};


export const config: Configuration<AppFlags> = {
    envKey: process.env.PUBLIC_HAPPYKIT_API || 'flags',

    defaultFlags: {
        "disable-leaderboard-arrows": false,
    },
};