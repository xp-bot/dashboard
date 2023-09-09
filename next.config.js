const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,

  images: {
    domains: [
      "localhost",
      "xpwebv1.xp-bot.net",
      "namespace.media",
      "cdn.namespace.media",
      "qwq.sh",
      "cny.sh",
      "api.beta.xp-bot.net",
      "api.xp-bot.net",
    ],
  },

  env: {
    BACKEND_DOMAIN: process.env.NEXT_PUBLIC_BACKEND_DOMAIN,
    ILUM_DOMAIN: process.env.ILUM_DOMAIN,
    DEVELOPERS: process.env.DEVELOPERS,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
};

module.exports = nextConfig;
