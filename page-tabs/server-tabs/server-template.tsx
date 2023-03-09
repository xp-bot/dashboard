// eslint-disable-next-line import/no-cycle
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import ButtonCluster, { ButtonFeature } from 'components/button-cluster';
import PageTitle from 'components/page-title';
import { FC } from 'react';

interface ServerTabSettingsProps {}

const ServerTabSettings: FC<ServerTabSettingsProps> = () => (
  <>
    <PageTitle title="User Settings" />
    <div className="flex flex-wrap gap-5">
      <ButtonCluster
        buttons={[
          {
            text: `Reset My Account`,
            icon: faExclamationTriangle,
          },
          {
            text: `Reset My Account`,
            feature: ButtonFeature.danger,
            icon: faExclamationTriangle,
          },
        ]}
      />
    </div>
  </>
);

export default ServerTabSettings;
