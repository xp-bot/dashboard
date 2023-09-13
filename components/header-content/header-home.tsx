import RecentlyPanel from "components/recently-panel";
import useBreakpoints from "hooks/use-breakpoints";
import _, { map, slice } from "lodash";
import Link from "next/link";
import { FC } from "react";

import { useUser } from "../../context/user-context";
import { avatarToURL } from "../../utils/discord-utils";
import FallBackImage from "../fallback-image";

interface HeaderHomeProps {}

const HeaderHome: FC<HeaderHomeProps> = () => {
  const user = useUser();
  const breakpoints = useBreakpoints();

  const quickSelect = _.chain(user.discordGuilds)
    .filter((guild) => guild.xpInvited || false)
    .sortBy((g) => !g.premium.premium)
    .map((guild) => ({ guild }))
    .value();

  return (
    <>
      <div className="relative flex w-full items-center">
        <h1 className="my-2">Welcome to XP</h1>
        <div className="lg:hidden">
          <Link
            className=""
            href={
              !user.isLoggedIn
                ? `${process.env.BACKEND_DOMAIN}/discord/login`
                : `/me`
            }
          >
            <div className="absolute right-0 top-0 drop-shadow-md transition ease-in-out hover:scale-95 active:scale-90">
              <FallBackImage
                src={avatarToURL(user.currentUser?.discordUser)}
                className={"aspect-square w-[37px] rounded-full object-cover"}
              />
            </div>
          </Link>
        </div>
      </div>
      <hr className="w-full" />
      <div className="relative mt-3 flex h-[135px] w-full flex-col gap-[14px]">
        <h4 className="md:text-center">Quick Start</h4>
        <div className="group flex flex-row justify-evenly md:justify-center">
          {map(
            slice(quickSelect, 0, breakpoints.isMd ? 5 : 3),
            (guild, idx) => (
              <RecentlyPanel key={idx} guild={guild.guild} />
            )
          )}
        </div>
      </div>
    </>
  );
};

export default HeaderHome;
