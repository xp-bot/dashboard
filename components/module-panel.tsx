import { useServerDetails } from 'context/guild-details-context';
import { useUser } from 'context/user-context';
import { FC, useEffect, useState } from 'react';

import CheckboxContentPanel from './checkbox-content-panel';

export enum PremiumType {
  None,
  UserPremium,
  ServerPremium,
}

interface ModulePanelProps {
  disabled?: boolean;
  moduleName: string;
  moduleDescription: string;
  checked: boolean;
  defaultValue?: boolean;
  onChange: (value: boolean) => void | undefined;
  premiumLock?: PremiumType;
  isInPanel?: boolean;
}

const ModulePanel: FC<ModulePanelProps> = (props) => {
  const guild = useServerDetails();
  const user = useUser();
  const [enabled, setEnabled] = useState(!props.disabled);

  useEffect(() => {
    switch (props.premiumLock) {
      case 1:
        setEnabled(
          props.disabled
            ? false
            : user.currentUser?.premium.userPremium || false
        );
        break;
      case 2:
        setEnabled(
          props.disabled ? false : guild.currentServerPremium?.premium || false
        );
        break;

      default:
        setEnabled(!props.disabled);
        break;
    }
  }, [props]);
  return (
    <CheckboxContentPanel
      isInPanel={props.isInPanel}
      defaultChecked={!enabled ? props.defaultValue : props.checked}
      onChange={props.onChange}
      title={props.moduleName}
      disabled={!enabled}
    >
      <i>
        <h4 className="text-darkText dark:text-darkText-darkMode">
          {props.moduleDescription}
        </h4>
      </i>
      {props.premiumLock ? (
        <div className="absolute right-2 top-3">{!enabled ? '🔒' : '🔓'}</div>
      ) : (
        <></>
      )}
    </CheckboxContentPanel>
  );
};

export default ModulePanel;
