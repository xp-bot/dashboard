// eslint-disable-next-line import/no-cycle

import { faGlobe, faRefresh } from '@fortawesome/free-solid-svg-icons';
import ButtonCluster, { ButtonFeature } from 'components/button-cluster';
import PageTitle from 'components/page-title';
import ModulePanel from 'components/module-panel';
import Select from 'components/select';
import { XPLoading } from 'components/svg/logos';
import ValuePanel from 'components/value-panel';
import { useTheme } from 'next-themes';
import { FC } from 'react';

import UserTabRankingCard from './user-ranking-card';

interface UserTabTestComponentsProps {
  tabPath: string;
}

const UserTabTestComponents: FC<UserTabTestComponentsProps> = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex flex-col gap-5">
      <PageTitle title="Components Test" />
      <div className="">
        <XPLoading />
      </div>
      <div>
        <h2>Theme</h2>
        <ButtonCluster
          buttons={[
            {
              text: `Change Theme`,
              onClick: () => {
                setTheme(theme === 'dark' ? 'light' : 'dark');
              },
              icon: faRefresh,
            },
          ]}
        />
      </div>
      <div>
        <h2>Button Cluster</h2>
        <div className="flex flex-col gap-5 rounded-md border p-3">
          <ButtonCluster
            title="Button Cluster Title"
            buttons={[
              { text: `Basic Button` },
              { text: `Disabled Button`, disabled: true },
              { text: `Danger Variant`, feature: ButtonFeature.danger },
              { text: `Save Variant`, feature: ButtonFeature.save },
              { text: `Button with Icon`, icon: faRefresh },
            ]}
          />
          <ButtonCluster
            buttons={[{ text: `Seperate Button`, icon: faGlobe }]}
          />
        </div>
      </div>
      <hr />
      <div>
        <h2>Select Panel</h2>
        <div className="rounded-md border p-3">
          <Select
            value="123"
            options={[
              { id: '123', title: 'Option 1' },
              { id: '321', title: 'Option 2' },
            ]}
          />
        </div>
      </div>
      <hr />
      <div>
        <h2>Module Panel</h2>
        <div className="flex w-full gap-5 rounded-md border p-3">
          <div className="grow">
            <ModulePanel
              checked
              moduleDescription="Module Description Text"
              moduleName="Module Test"
              onChange={() => {}}
            />
          </div>
          <div className="grow">
            <ModulePanel
              checked={false}
              moduleDescription="Module Disabled Description Text"
              moduleName="Module Disabled Test"
              onChange={() => {}}
              disabled
            />
          </div>
        </div>
      </div>
      <hr />
      <div>
        <h2>Value Panel</h2>
        <div className="flex w-full flex-wrap gap-5 rounded-md border p-3">
          <div className="grow">
            <ValuePanel
              defaultValue={33}
              value={12}
              valueDescription="Module Description Text"
              valueName="Module Test"
              onChange={() => {}}
            />
          </div>
          <div className="grow">
            <ValuePanel
              defaultValue={69}
              value={55}
              valueDescription="Module Disabled Description Text"
              valueName="Module Disabled Test"
              onChange={() => {}}
              disabled
            />
          </div>
        </div>
      </div>

      <hr />
      <div>
        <h2>Ranking Card Editor</h2>
        <div className="rounded-md border p-3">
          <UserTabRankingCard tabPath="" />
        </div>
      </div>
    </div>
  );
};

export default UserTabTestComponents;
