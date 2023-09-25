import { apiRoutes } from "apis/api-helper";
import BasicPanel from "components/basic-panel";
import FallBackImage from "components/fallback-image";
import HeadSet from "components/head-set";
import HeaderChangelogs from "components/header-content/header-changelogs";
import PageTitle from "components/page-title";
import Tooltip from "components/tooltip";
import { useLayout } from "context/layout-context";
import { map, reverse, toPairs } from "lodash";
import { IDiscordUserLookup } from "models/backend/discord-models";
import { IPage } from "models/page";
import type { NextPage } from "next";
import { FC, useEffect, useState } from "react";
import { avatarToURL } from "utils/discord-utils";

import changelog from "../changelogs";

type HomeProps = IPage;

export const ChangelogUser: FC<{ user_id: string }> = ({ user_id }) => {
  const [user, setUser] = useState<IDiscordUserLookup | undefined>();
  useEffect(() => {
    const getUser = async () => {
      const res = await apiRoutes.discord.lookupUser(user_id);

      if (!res.success) return;

      setUser(res.body);
    };

    getUser();
  }, []);

  return (
    <span className="relative inline-flex w-fit flex-row items-center gap-2 overflow-hidden rounded-md border bg-input text-sm text-darkText shadow-md transition-colors ease-in-out hover:bg-input-border dark:border-none dark:bg-input-darkMode dark:text-darkText-darkMode dark:hover:bg-input-border">
      {user && (
        <span className="aspect-square w-7 overflow-hidden">
          <FallBackImage
            className="h-full w-full object-cover"
            src={avatarToURL(user, 128, true)}
          />
        </span>
      )}
      <span className="pr-3">
        <span className="absolute -right-1 -top-8 text-5xl opacity-[.03] blur-[1px] dark:blur-0">
          @
        </span>
        <p>{user ? <>{user.username}</> : user_id}</p>
      </span>
    </span>
  );
};

const Blog: NextPage<HomeProps> = () => {
  const layout = useLayout();

  useEffect(() => {
    layout.changeHeader(<HeaderChangelogs />, `changelogs`);
  }, []);
  return (
    <div className="container">
      <HeadSet
        title="Dashboard Changelogs"
        description="Stay up-to-date with the latest updates, bug fixes, and feature
        enhancements for your favorite dashboard with our comprehensive
        changelogs."
      />
      <div className="flex flex-col gap-[2.5rem]">
        <div>
          <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap">
            {map(
              reverse(toPairs(changelog)),
              ([version, versionChangelog], idx) => {
                const changeClusters = toPairs(versionChangelog);
                return (
                  <>
                    <div className="flex w-full flex-col">
                      <PageTitle title={`v${version}`} disableArrow />
                      <BasicPanel key={`changelog-${version}-${idx}`}>
                        {map(
                          changeClusters,
                          ([title, changes], changeClustersIDX) => (
                            <div
                              className="flex flex-col gap-5"
                              key={`changelog-modal-version-${title}-${changeClustersIDX}`}
                            >
                              <div>
                                <h2>{title}</h2>
                                <ul className="flex flex-col gap-2">
                                  {map(changes, (change, changesIDX) => {
                                    return change.type === "image" ? (
                                      <div
                                        key={`changelog-modal-version-change-${change.type}-${changesIDX}`}
                                        className="my-5 px-5 py-2 pt-0"
                                      >
                                        <div className="h-fit w-fit overflow-hidden rounded-md drop-shadow-md md:mx-auto">
                                          <FallBackImage
                                            className="hidden w-fit object-contain md:flex md:max-h-80"
                                            src={change.content.pc}
                                          />
                                          <FallBackImage
                                            className="object-contain md:hidden"
                                            src={
                                              change.content.mobile ||
                                              change.content.pc
                                            }
                                          />
                                        </div>
                                      </div>
                                    ) : (
                                      <li
                                        key={`changelog-modal-version-change-hr-${changeClustersIDX}`}
                                        className="ml-5 list-disc text-darkText dark:text-darkText-darkMode"
                                      >
                                        <div className="flex flex-col gap-2">
                                          <p className="text-darkText dark:text-darkText-darkMode">
                                            {change.content}
                                          </p>
                                          {change.submitter_id &&
                                            change.submit_type && (
                                              <div className="flex flex-row items-center gap-2">
                                                <Tooltip
                                                  alignLeft
                                                  showContentOnMobile
                                                  text="Thank you for submitting this idea!"
                                                >
                                                  <ChangelogUser
                                                    user_id={
                                                      change.submitter_id
                                                    }
                                                  />
                                                </Tooltip>
                                              </div>
                                            )}
                                        </div>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                              {/* {changeClustersIDX + 1 <
                                size(entries(changeClusters)) && (
                                <hr className="mx-auto mt-2 w-4/5" />
                              )} */}
                            </div>
                          )
                        )}
                      </BasicPanel>
                    </div>
                    {/* {idx + 1 < size(entries(changelog)) && (
                      <hr className="mt-4 lg:-mb-4" />
                    )} */}
                  </>
                );
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
