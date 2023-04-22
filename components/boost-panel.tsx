import { isUndefined, map, slice, sortBy, startsWith } from 'lodash';
import { IDiscordChannel, IDiscordRole } from 'models/backend/discord-models';
import { FC, useState } from 'react';
import { toColor } from 'utils/discord-utils';

import BlockButton from './block-button';
import Select from './select';

/**
 * @var onChange Only works if registerForm is undefined
 */
interface BoostPanelProps {
  percentage: number;
  entity: IDiscordChannel | IDiscordRole;
  availableEntities?: (IDiscordRole | IDiscordChannel)[];
  requestRemove: (id: string) => void;
  requestChangeDetails?: (newEntity?: string, newPercentage?: number) => void;
  prefix: string;
}

const BoostPanel: FC<BoostPanelProps> = (props) => {
  const [percentageInput, setPercentageInput] = useState<string>(
    `${props.percentage}`
  );
  return (
    <div className="flex w-full flex-col gap-3 md:flex-row md:gap-5">
      <div className="flex grow flex-row gap-5">
        <div
          className={`relative h-full whitespace-nowrap rounded-md border-transparent bg-panelBack px-4 py-2 text-darkText shadow-md focus-within:outline-none dark:bg-panelBack-darkMode dark:text-darkText-darkMode md:w-fit`}
        >
          <span className="pointer-events-none absolute right-0 top-0 flex h-full items-center pr-4 opacity-75">
            %
          </span>
          <input
            onChange={(e) => {
              /^(0|[1-9][0-9]*)$/gm.test(e.target.value) &&
                !startsWith(e.target.value, `0`) &&
                setPercentageInput(e.target.value);
            }}
            onBlur={(e) => {
              props.requestChangeDetails &&
                props.requestChangeDetails(
                  undefined,
                  parseInt(e.target.value, 10)
                );
            }}
            style={{
              width: `${
                (percentageInput.length || `${props.percentage}`.length) + 2
              }ch`,
            }}
            className="h-full rounded-md pr-4"
            value={percentageInput}
          />
        </div>

        <div className="relative h-full w-full">
          {props.availableEntities && props.requestChangeDetails ? (
            <Select
              style={{
                borderBottom: !isUndefined((props.entity as any)?.color)
                  ? `2px solid ${toColor((props.entity as any).color)}`
                  : ``,
              }}
              className="!h-full"
              value={props.entity.id}
              onChange={(v) => {
                props.requestChangeDetails && props.requestChangeDetails(v);
              }}
              options={map(
                sortBy(
                  slice(props.availableEntities, 1),
                  (entity) => entity.name
                ),
                (role) => ({
                  id: role.id,
                  title: `${props.prefix} ${role.name}`,
                })
              )}
            />
          ) : (
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
          )}
        </div>
      </div>
      <div>
        <BlockButton onClick={() => props.requestRemove(props.entity.id)}>
          Unlink Boost
        </BlockButton>
      </div>
    </div>
  );
};

export default BoostPanel;
