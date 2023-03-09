import { IDiscordRole } from 'models/backend/discord-models';
import { FC } from 'react';
import { toColor } from 'utils/discord-utils';

import BlockButton from './block-button';

/**
 * @var onChange Only works if registerForm is undefined
 */
interface LevelrolePanelProps {
  level: number;
  role: IDiscordRole;
  requestRemove: (level: number) => void;
  requestChange?: (level: number) => void;
}

const LevelrolePanel: FC<LevelrolePanelProps> = (props) => {
  return (
    <div className="flex w-full flex-col gap-3 md:flex-row md:gap-5">
      <div className="flex grow flex-row gap-5">
        {props.level > 0 && (
          <div
            className={`relative h-fit whitespace-nowrap rounded-md border-transparent bg-panelBack px-4 py-2 text-darkText shadow-md focus-within:outline-none dark:bg-panelBack-darkMode dark:text-darkText-darkMode md:w-fit`}
          >
            Lvl. {props.level}
          </div>
        )}

        <div
          style={{
            borderBottom: props.role?.color
              ? `2px solid ${toColor(props.role.color)}`
              : ``,
          }}
          className={`relative h-fit w-full rounded-md border-transparent bg-panelBack px-4 py-2 text-darkText shadow-md focus-within:outline-none dark:bg-panelBack-darkMode dark:text-darkText-darkMode md:grow`}
        >
          @ {props.role?.name}
        </div>
      </div>
      {props.level < 0 && (
        <div>
          <BlockButton
            onClick={() =>
              props.requestChange && props.requestChange(props.level)
            }
          >
            Change Role
          </BlockButton>
        </div>
      )}
      <div>
        <BlockButton onClick={() => props.requestRemove(props.level)}>
          Unlink Role
        </BlockButton>
      </div>
    </div>
  );
};

export default LevelrolePanel;
