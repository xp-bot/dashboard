import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';

import Select from './select';
import Tooltip from './tooltip';

interface DropdownPanelProps {
  disabled?: boolean;
  dropdownName: string;
  dropdownDescription: string;
  value?: string;
  onChange?: (value: string) => void;
  options: { title: string; id: string; selected?: boolean }[];
  tooltipText?: string;
}

const DropdownPanel: FC<DropdownPanelProps> = (props) => {
  return (
    <div
      className={`${
        props.disabled ? `pointer-events-none opacity-50` : ``
      } relative flex h-fit flex-col gap-2 rounded-md bg-panelBack p-4 shadow-md transition ease-in-out dark:bg-panelBack-darkMode`}
    >
      <div className="flex items-center gap-2">
        <h2 className="m-0 flex flex-row gap-2 text-[17px]">
          {props.dropdownName}
          {props.tooltipText && (
            <Tooltip text={props.tooltipText}>
              <FontAwesomeIcon
                className="text-darkText opacity-25 transition ease-in-out hover:opacity-75 dark:text-darkText-darkMode"
                icon={faInfoCircle}
              />
            </Tooltip>
          )}
        </h2>
      </div>
      <i>
        <h4 className={` text-darkText dark:text-darkText-darkMode`}>
          {props.dropdownDescription}
        </h4>
      </i>
      <Select
        onChange={props.onChange}
        isInPanel
        options={props.options}
        value={props.value}
      />
    </div>
  );
};

export default DropdownPanel;
