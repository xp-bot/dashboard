import BlockButton from "components/block-button";
import Link from "next/link";
import { FC } from "react";

interface HeaderHomeProps {}

const HeaderIndex: FC<HeaderHomeProps> = () => {
  return (
    <>
      <div className="flex flex-col items-center gap-10 text-center lg:pb-20">
        <div className="flex flex-col gap-1">
          <h1 className="tracking-[.1em] md:whitespace-nowrap md:text-[4.5vw]">
            Reimagine your Community
          </h1>
          <span className="font-montserrat text-lightText dark:text-lightText-darkMode text-sm font-semibold opacity-75 lg:text-[1.4vw] xl:text-[1vw]">
            Elevate your Community to the next Level with Top-Tier Leveling,
            endless Customizability and more.
          </span>
        </div>
        <div className="hidden w-fit flex-row gap-5 lg:flex">
          <Link href={`https://get.xp-bot.net/`}>
            <BlockButton>Welcome to XP</BlockButton>
          </Link>
        </div>
      </div>
    </>
  );
};

export default HeaderIndex;
