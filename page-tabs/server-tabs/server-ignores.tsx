// eslint-disable-next-line import/no-cycle
import PageTitle from "components/page-title";
import { FC } from "react";

import IgnoredCategories from "./ignore-parts/ignored-category";
import IgnoredRoles from "./ignore-parts/ignored-roles";
import IgnoredTextChannels from "./ignore-parts/ignored-text";
import IgnoredVoiceChannels from "./ignore-parts/ignored-voice";

interface AddRoleInputs {
  percentage: number;
  entity: string;
}

interface ServerTabIgnoresProps {}

const ServerTabIgnores: FC<ServerTabIgnoresProps> = () => {
  return (
    <>
      <div>
        <PageTitle
          title="Ignored Roles"
          tooltipText="Ignored Roles allow you to specify roles that should not gain any xp."
        />
        <IgnoredRoles />
      </div>
      <hr className="mx-auto mt-1 w-4/5 md:-mb-4" />
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div>
          <PageTitle
            disableArrow
            title="Ignored TextChannels"
            tooltipText="Ignored TextChannels allow you to specify text channels where message xp is always disabled."
          />
          <IgnoredTextChannels />
        </div>
        <hr className="mx-auto -mb-5 mt-1 w-4/5 md:hidden" />
        <div>
          <PageTitle
            disableArrow
            title="Ignored VoiceChannels"
            tooltipText="Ignored VoiceChannels allow you to specify voice channels where voice xp is always disabled."
          />
          <IgnoredVoiceChannels />
        </div>
      </div>
      <hr className="mx-auto mt-1 w-4/5 md:-mb-4" />
      <div>
        <PageTitle
          disableArrow
          title="Ignored Categories"
          tooltipText="Ignored Categories allow you to specify categories where voice xp and message xp is always disabled."
        />
        <IgnoredCategories />
      </div>
    </>
  );
};

export default ServerTabIgnores;
