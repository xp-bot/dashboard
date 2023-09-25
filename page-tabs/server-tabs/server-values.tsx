// eslint-disable-next-line import/no-cycle
import { PremiumType } from 'components/module-panel';
import PageTitle from 'components/page-title';
import ValuePanel from 'components/value-panel';
import { useServerDetails } from 'context/guild-details-context';
import XPModules from 'default-models/xp-modules';
import XPValues from 'default-models/xp-values';
import {
  cloneDeep,
  isEqual,
  isUndefined,
  map,
  size,
  toInteger,
  toPairs,
} from 'lodash';
import { FC } from 'react';

interface ServerTabValuesProps {}

const ServerTabValues: FC<ServerTabValuesProps> = () => {
  const guild = useServerDetails();
  return (
    <>
      {!isUndefined(guild.currentXPGuild) && (
        <div>
          <PageTitle
            title="Values"
            tooltipText="Values allow you to regulate the rate at which users progress within XP."
          />
          <div className="flex flex-col items-center gap-8">
            {map(toPairs(XPValues), ([categoryName, category], idx) => {
              return (
                <>
                  <div
                    className="w-full"
                    key={`server-values-cat-${categoryName}`}
                  >
                    <div className="flex flex-row flex-wrap gap-8">
                      {map(toPairs(category), ([valueKey, value]) => {
                        const xpValue = guild.currentXPGuild?.values[valueKey];
                        return (
                          <div
                            key={`server-values-cat-value-${valueKey}`}
                            className="grow"
                          >
                            <ValuePanel
                              premiumLock={
                                value.premiumFeature
                                  ? PremiumType.ServerPremium
                                  : undefined
                              }
                              valueName={value.name}
                              valueDescription={value.description}
                              value={
                                !isUndefined(xpValue) ? xpValue : value.default
                              }
                              defaultValue={value.default}
                              onChange={(changedValue) => {
                                if (!guild.currentXPGuild) return;
                                const g = cloneDeep(guild.currentXPGuild);
                                g.values[valueKey] = toInteger(changedValue);
                                guild.updateGuild(
                                  {
                                    name: value.name,
                                    oldValue: `${guild.currentXPGuild.modules[valueKey]}`,
                                    newValue: `${changedValue}`,
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
                    <hr key={`server-values-cat-hr-${idx}`} />
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

export default ServerTabValues;
