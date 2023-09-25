import BlockButton from "components/block-button";
import Link from "next/link";
import { FC } from "react";

interface HeaderPremiumProps {}

const HeaderPremium: FC<HeaderPremiumProps> = () => {
  return (
    <>
      <div className="flex flex-col items-center gap-10 text-center lg:pb-20">
        <div className="flex flex-col gap-1">
          <h1 className="tracking-[.1em] md:whitespace-nowrap md:text-[4.5vw]">
            Even better with Premium
          </h1>
          <span className="font-montserrat text-sm font-semibold text-lightText opacity-75 dark:text-lightText-darkMode lg:text-[1.4vw] xl:text-[1vw]">
            Get even more in-depth with XP Premium!
          </span>
        </div>
        <div className="hidden w-fit flex-row gap-5 lg:flex">
          <Link href="https://patreon.xp-bot.net/">
            <BlockButton>Get XP Premium</BlockButton>
          </Link>
        </div>
      </div>
    </>
  );
};

export default HeaderPremium;
