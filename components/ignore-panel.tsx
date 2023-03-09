import { isUndefined } from 'lodash';
import { IDiscordChannel, IDiscordRole } from 'models/backend/discord-models';
import { FC } from 'react';
import { toColor } from 'utils/discord-utils';

import BlockButton from './block-button';

/**
 * @var onChange Only works if registerForm is undefined
 */
interface IgnorePanelProps {
  entity: IDiscordChannel | IDiscordRole;
  requestRemove: (id: string) => void;
  prefix: string;
}

const IgnorePanel: FC<IgnorePanelProps> = (props) => {
  return (
    <div className="flex w-full flex-col gap-3 md:flex-row md:gap-5">
      <div className="flex grow flex-row gap-5">
        <div
          style={{
            borderBottom: !isUndefined((props.entity as any)?.color)
              ? `2px solid ${toColor((props.entity as any).color)}`
              : ``,
          }}
          className={`relative h-fit w-full rounded-md border-transparent bg-panelBack px-4 py-2 text-darkText shadow-md focus-within:outline-none dark:bg-panelBack-darkMode dark:text-darkText-darkMode md:grow`}
        >
          {props.prefix} {props.entity.name}
        </div>
      </div>
      <div>
        <BlockButton onClick={() => props.requestRemove(props.entity.id)}>
          Unlink Ignore
        </BlockButton>
      </div>
    </div>
  );
};

export default IgnorePanel;
