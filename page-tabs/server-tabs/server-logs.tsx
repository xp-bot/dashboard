// eslint-disable-next-line import/no-cycle
import { apiRoutes } from 'apis/api-helper';
import BlockButton from 'components/block-button';
import CheckboxContentPanel from 'components/checkbox-content-panel';
import LogPanel from 'components/log-panel';
import PageTitle from 'components/page-title';
import { useServerDetails } from 'context/guild-details-context';
import { AnimatePresence, motion } from 'framer-motion';
import { debounce, filter, includes, isEqual, map, uniq } from 'lodash';
import { IXPDBLog } from 'models/backend/xp-models';
import { FC, useEffect, useState } from 'react';

interface ServerTabLogsProps {}

const ServerTabLogs: FC<ServerTabLogsProps> = () => {
  const guild = useServerDetails();
  const [searchSelected] = useState<string | undefined>();
  const [logs, setLogs] = useState<IXPDBLog>({
    hits: [],
    page: 1,
    totalPages: 1,
  });
  const [page, setPage] = useState(1);
  const [loadingPage, setLoadingPage] = useState(true);

  const fetchLogs = debounce(async () => {
    const res = await apiRoutes.xp.guild.getLogs(
      guild.guildID,
      page,
      searchSelected
    );
    if (!res.success) return;
    setLogs(res.body);
    setLoadingPage(false);
  });
  useEffect(() => {
    setLoadingPage(true);
    fetchLogs();
  }, [page, searchSelected]);

  const [showAll, setShowAll] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([
    `settings`,
    `voicetime`,
    `levelup`,
    `xpchanged`,
    `commands`,
    `exceptions`,
  ]);

  // if (!guild.currentXPLogs) {
  //   router.push(`/servers/${guild.currentDiscordGuild?.id}/`);
  //   return <></>;
  // }

  const addFilter = (f: string) => {
    setPage(1);
    setSelectedFilters(uniq([...selectedFilters, f]));
  };

  const removeFilter = (f: string) => {
    setPage(1);
    setSelectedFilters([
      ...filter(
        selectedFilters,
        (selectedFilter) => !isEqual(selectedFilter, f)
      ),
    ]);
  };

  const switchFilter = (f: string, value: boolean) =>
    value ? addFilter(f) : removeFilter(f);

  const isFilterEnabled = (f: string) => includes(selectedFilters, f);

  const filteredLogs = showAll
    ? logs.hits
    : filter(
        logs.hits,
        (log) => showAll || includes(selectedFilters, log.type)
      );

  // eslint-disable-next-line consistent-return
  return (
    <>
      {guild.currentServerPremium?.premium && (
        <motion.div>
          <PageTitle title="Server Logs" />
          <div className="flex flex-col gap-5">
            {/* <BasicPanel>
              <PanelInput
                onChange={(e) => {
                  setPage(0);
                  setSearchSelected(
                    isEmpty(e.target.value) ? undefined : e.target.value
                  );
                }}
                value={''}
                placeholder={'Search'}
              />
            </BasicPanel> */}
            <motion.div
              layout="position"
              key="khjgjgh"
              transition={{ type: 'spring' }}
              className="flex flex-col"
            >
              <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-[250px_1px_1fr]">
                <div className="flex w-full flex-wrap">
                  <div className="flex w-full flex-col gap-5">
                    <CheckboxContentPanel
                      title="Show All"
                      defaultChecked={showAll}
                      onChange={(v) => setShowAll(v)}
                    />
                    <div
                      className={`${
                        showAll ? `hidden md:flex` : `flex`
                      } w-full flex-col gap-5`}
                    >
                      <CheckboxContentPanel
                        title="Settings"
                        disabled={showAll}
                        defaultChecked={isFilterEnabled(`settings`)}
                        onChange={(v) => switchFilter(`settings`, v)}
                      />
                      <CheckboxContentPanel
                        title="Voicetime"
                        disabled={showAll}
                        defaultChecked={isFilterEnabled(`voicetime`)}
                        onChange={(v) => switchFilter(`voicetime`, v)}
                      />
                      <CheckboxContentPanel
                        title="Level-Ups"
                        disabled={showAll}
                        defaultChecked={isFilterEnabled(`levelup`)}
                        onChange={(v) => switchFilter(`levelup`, v)}
                      />
                      <CheckboxContentPanel
                        title="XP Changed"
                        disabled={showAll}
                        defaultChecked={isFilterEnabled(`xpchanged`)}
                        onChange={(v) => switchFilter(`xpchanged`, v)}
                      />
                      <CheckboxContentPanel
                        title="Commands"
                        disabled={showAll}
                        defaultChecked={isFilterEnabled(`commands`)}
                        onChange={(v) => switchFilter(`commands`, v)}
                      />
                      <CheckboxContentPanel
                        title="Exceptions"
                        disabled={showAll}
                        defaultChecked={isFilterEnabled(`exceptions`)}
                        onChange={(v) => switchFilter(`exceptions`, v)}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full bg-white/25" />
                <motion.div
                  layout="position"
                  className="relative flex h-full w-full flex-col flex-wrap gap-5"
                >
                  <div className="flex flex-row gap-5">
                    <BlockButton
                      disabled={loadingPage || page === 1}
                      onClick={() => {
                        if (!loadingPage && logs.page > 1) setPage(page - 1);
                      }}
                    >
                      Last Page
                    </BlockButton>
                    <BlockButton
                      disabled={loadingPage || logs.page >= logs.totalPages}
                      onClick={() => {
                        if (!loadingPage && logs.page < logs.totalPages)
                          setPage(page + 1);
                      }}
                    >
                      Next Page
                    </BlockButton>
                  </div>
                  <AnimatePresence mode="popLayout">
                    {map(filteredLogs, (log) => (
                      <motion.div
                        layout="position"
                        initial="initial"
                        exit="exit"
                        animate="base"
                        variants={{
                          initial: { x: -20, opacity: 0 },
                          exit: { x: 20, opacity: 0 },
                          base: {
                            x: 0,
                            opacity: 1,
                            transition: { staggerDirection: -1 },
                          },
                        }}
                        key={`log_${log.id}`}
                        className="left-0 top-0 w-full"
                      >
                        <LogPanel log={log} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default ServerTabLogs;
