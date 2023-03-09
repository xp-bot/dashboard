import { useServerDetails } from 'context/guild-details-context';
import { useUser } from 'context/user-context';
import { isNil } from 'lodash';
import { FC } from 'react';

import { PremiumType } from './module-panel';
import PanelInput from './panel-input';

interface ValuePanelProps {
  disabled?: boolean;
  valueName: string;
  valueDescription: string;
  defaultValue?: number;
  value: number;
  onChange?: (value: number | string) => void;
  premiumLock?: PremiumType;
  min?: number;
  max?: number;
}

const ValuePanel: FC<ValuePanelProps> = (props) => {
  const guild = useServerDetails();
  const user = useUser();
  let premiumEnabled = false;

  switch (props.premiumLock) {
    case 1:
      premiumEnabled = user.currentUser?.premium.userPremium || false;
      break;
    case 2:
      premiumEnabled = guild.currentServerPremium?.premium || false;
      break;

    default:
      premiumEnabled = true;
      break;
  }
  return (
    <div
      className={`${
        !premiumEnabled || props.disabled
          ? `pointer-events-none opacity-50`
          : ``
      } relative flex h-fit flex-col gap-2 rounded-md bg-panelBack p-4 shadow-md dark:bg-panelBack-darkMode`}
    >
      <div className="flex items-center gap-2">
        <h2 className="m-0 inline-block text-[17px]">{props.valueName}</h2>{' '}
        {!isNil(props.defaultValue) && (
          <h2 className="m-0 inline-block text-[13px] font-normal italic opacity-50">
            Default: {props.defaultValue}
          </h2>
        )}
      </div>
      <i>
        <h4 className={`text-darkText dark:text-darkText-darkMode`}>
          {props.valueDescription}
        </h4>
      </i>
      <PanelInput
        type={`number`}
        placeholder={
          !isNil(props.defaultValue) ? `${props.defaultValue}` : undefined
        }
        inputProps={{ type: 'number' }}
        onChange={(e) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          props.onChange && props.onChange(e.target.value);
        }}
        value={props.value}
      />
      {props.premiumLock ? (
        <div className="absolute top-3 right-2">
          {!premiumEnabled || props.disabled ? '🔒' : '🔓'}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ValuePanel;
