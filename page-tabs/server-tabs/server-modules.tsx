// eslint-disable-next-line import/no-cycle
import ModulePanel, { PremiumType } from 'components/module-panel';
import PageTitle from 'components/page-title';
import { useServerDetails } from 'context/guild-details-context';
import XPModules from 'default-models/xp-modules';
import { cloneDeep, isEqual, isUndefined, map, size, toPairs } from 'lodash';
import { FC } from 'react';

interface ServerTabModulesProps {}

const ServerTabModules: FC<ServerTabModulesProps> = () => {
  const guild = useServerDetails();
  return (
    <>
      {!isUndefined(guild.currentXPGuild) && (
        <div>
          <PageTitle
            motionTextKey="MotionServerTab-Modules"
            tooltipText="Modules allow for the activation and deactivation of features within XP."
            title={`Modules`}
          />
          <div className="flex flex-col items-center gap-8">
            {map(toPairs(XPModules), ([categoryName, category], idx) => {
              return (
                <>
                  <div
                    key={`server-modules-cat-${categoryName}`}
                    className="w-full"
                  >
                    <div className="flex flex-row flex-wrap gap-5">
                      {map(toPairs(category), ([moduleKey, module]) => {
                        const xpModule =
                          guild.currentXPGuild?.modules[moduleKey];
                        return (
                          <div
                            key={`server-modules-cat-value-${moduleKey}`}
                            className="grow"
                          >
                            <ModulePanel
                              premiumLock={
                                module.premiumFeature
                                  ? PremiumType.ServerPremium
                                  : undefined
                              }
                              moduleName={module.name}
                              moduleDescription={module.description}
                              defaultValue={module.default}
                              checked={
                                !isUndefined(xpModule)
                                  ? xpModule
                                  : module.default
                              }
                              onChange={(value) => {
                                if (!guild.currentXPGuild) return;
                                const g = cloneDeep(guild.currentXPGuild);
                                g.modules[moduleKey] = value;
                                guild.updateGuild(
                                  {
                                    name: module.name,
                                    oldValue: `${guild.currentXPGuild.modules[moduleKey]}`,
                                    newValue: `${value}`,
                                  },
                                  g
                                );
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {!isEqual(size(XPModules) - 1, idx) && (
                    <hr key={`server-modules-cat-hr-${idx}`} />
                  )}
                </>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default ServerTabModules;
