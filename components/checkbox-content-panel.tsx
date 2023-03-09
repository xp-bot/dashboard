import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, ReactNode, useState } from 'react';

import Tooltip from './tooltip';

interface CheckboxContentProps {
  disabled?: boolean;
  title: string;
  defaultChecked?: boolean;
  children?: ReactNode;
  onChange?: (value: boolean) => void | undefined;
  increaseGap?: boolean;
  isInPanel?: boolean;
  tooltipText?: string;
}

const CheckboxContentPanel: FC<CheckboxContentProps> = (props) => {
  const [state, setState] = useState(props.defaultChecked || false);

  const changeState = (value: boolean) => {
    setState(value);
    if (props.onChange) props.onChange(value);
  };

  return (
    <div
      onClick={() => {
        changeState(!state);
      }}
      className={`${props.disabled ? `pointer-events-none opacity-50` : ``} ${
        props.increaseGap ? `gap-3` : `gap-2`
      } relative flex h-fit cursor-pointer flex-col rounded-md ${
        props.isInPanel
          ? `border border-input-border bg-input dark:border-none dark:bg-input-darkMode`
          : `bg-panelBack dark:bg-panelBack-darkMode`
      }  p-4 shadow-md transition ease-in-out active:translate-y-1 `}
    >
      <div className="flex gap-2">
        <div className={`flex items-center justify-center `}>
          <div className="flex h-[14px] w-[14px] items-center justify-center rounded-sm border-[2px] border-darkText dark:border-darkText-darkMode">
            <div
              className={`${
                state ? `scale-100 opacity-100` : `scale-75 opacity-0`
              } h-[6px] w-[6px] rounded-sm bg-darkText transition ease-in-out dark:bg-darkText-darkMode`}
            />
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <h2 className="m-0 inline-block text-[17px]">{props.title}</h2>
          {props.tooltipText && (
            <Tooltip text={props.tooltipText}>
              <FontAwesomeIcon
                className="text-darkText opacity-25 transition ease-in-out hover:opacity-75 dark:text-darkText-darkMode"
                icon={faInfoCircle}
              />
            </Tooltip>
          )}
        </div>
      </div>
      {props.children && <div>{props.children}</div>}
    </div>
  );
};

export default CheckboxContentPanel;
