import Head from 'next/head';
import { FC } from 'react';

interface HeadSetProps {
  title: string;
  description?: string;
  icon?: string;
  bigImage?: boolean;
  image?: string;
}

const HeadSet: FC<HeadSetProps> = ({
  title,
  description,
  icon,
  image,
  bigImage,
}) => {
  const metaTitle = `${title} | XP`;

  const metaDescription =
    description ||
    `Reimagine your Community by using XP.\nXP is by far the most advanced and feature-rich leveling Bot for your Discord Server.`;
  const metaImage =
    image ||
    `http://cdn.namespace.media/s/7NAcnj7Pd9Nt8jJ/download/LOGO_3_ROUNDED_x250.png`;

  return (
    <Head>
      <title>{metaTitle}</title>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, viewport-fit=cover"
      />
      <meta name="description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://xp-bot.net/" />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />

      <meta
        property="twitter:card"
        content={bigImage ? 'summary_large_image' : `summary`}
      />
      <meta property="twitter:url" content="https://xp-bot.net/" />
      <meta property="twitter:title" content={metaTitle} />
      <meta property="twitter:description" content={metaDescription} />
      <meta property="twitter:image" content={metaImage} />

      {icon && <link rel="icon" href={icon} />}
    </Head>
  );
};

export default HeadSet;
