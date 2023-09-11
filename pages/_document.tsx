/* eslint-disable @next/next/no-css-tags */
import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5b62ed" />
        <meta
          name="apple-mobile-web-app-title"
          content="Reimagine your Community | XP"
        />
        <meta name="application-name" content="Reimagine your Community | XP" />
        <meta name="msapplication-TileColor" content="#5B62ED" />
        <meta name="theme-color" content="#5B62ED" />

        <meta property="og:title" content={`Reimagine your Community | XP`} />
        <meta
          property="twitter:title"
          content={`Reimagine your Community | XP`}
        />

        <meta data-n-head="ssr" data-hid="author" name="author" content="XP" />

        <meta property="theme-color" content="#5B62ED" />
        {/* eslint-disable-next-line @next/next/next-script-for-ga */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-JW52ZNXQ6B"
        />
        <script async src="/scripts/ga.js" />

        <link
          rel="stylesheet"
          href="node_modules/@fortawesome/fontawesome-svg-core/styles.css"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="bg-wavePage dark:bg-wavePage-darkMode">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
