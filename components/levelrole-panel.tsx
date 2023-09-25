import { isEqual, map, parseInt, slice, sortBy } from "lodash";
import { IDiscordRole } from "models/backend/discord-models";
import { FC, useState } from "react";
import { toColor } from "utils/discord-utils";

import BlockButton from "./block-button";
import Select from "./select";

interface LevelrolePanelProps {
  level: number;
  role: IDiscordRole;
  requestRemove: () => void;
  requestChange?: () => void;
  requestChangeDetails?: (newRole?: string, newLevel?: number) => void;
  availableDiscordRoles?: IDiscordRole[];
}

const LevelrolePanel: FC<LevelrolePanelProps> = (props) => {
  const [levelInput, setLevelInput] = useState<string>(`${props.level}`);

  return (
    <div className="flex w-full flex-col gap-3 md:flex-row md:gap-5">
      <div className="flex grow flex-row gap-5">
        {props.level >= 0 && (
          <div className="relative h-full whitespace-nowrap rounded-md border-transparent bg-panelBack text-darkText shadow-md focus-within:outline-none dark:bg-panelBack-darkMode dark:text-darkText-darkMode md:w-fit">
            <span className="pointer-events-none absolute left-0 top-0 flex h-full items-center pl-4 opacity-75">
              Lvl.
            </span>
            <input
              onChange={(e) => {
                /^(?!0\d)\d+$/gm.test(e.target.value) &&
                  // !startsWith(e.target.value, `0`) &&
                  setLevelInput(e.target.value);
              }}
              onBlur={(e) => {
                !isEqual(e.target.value, `${props.level}`) &&
                  props.requestChangeDetails &&
                  props.requestChangeDetails(
                    undefined,
                    parseInt(e.target.value)
                  );
              }}
              style={{
                width: `${
                  (levelInput.length || `${props.level}`.length) + 7
                }ch`,
              }}
              className="h-full rounded-md px-4 pl-10"
              value={levelInput}
            ></input>
          </div>
        )}
        <div className="relative h-full w-full">
          {props.availableDiscordRoles && props.requestChangeDetails ? (
            <Select
              style={{
                borderBottom: props.role?.color
                  ? `2px solid ${toColor(props.role.color)}`
                  : ``,
              }}
              className="!h-full"
              value={props.role.id}
              onChange={(v) => {
                !isEqual(v, props.role.id) &&
                  props.requestChangeDetails &&
                  props.requestChangeDetails(v);
              }}
              options={map(
                sortBy(slice(props.availableDiscordRoles, 1), "name"),
                (role) => ({
                  id: role.id,
                  title: `@ ${role.name}`,
                })
              )}
            />
          ) : (
            <div
              style={{
                borderBottom: props.role?.color
                  ? `2px solid ${toColor(props.role.color)}`
                  : ``,
              }}
              className="relative h-fit w-full rounded-md border-transparent bg-panelBack px-4 py-2 text-darkText shadow-md focus-within:outline-none dark:bg-panelBack-darkMode dark:text-darkText-darkMode md:grow"
            >
              @ {props.role?.name}
            </div>
          )}
        </div>
      </div>
      {props.level < 0 && (
        <div>
          <BlockButton onClick={props.requestChange}>Change Role</BlockButton>
        </div>
      )}
      <div>
        <BlockButton onClick={props.requestRemove}>Unlink Role</BlockButton>
      </div>
    </div>
  );
};

export default LevelrolePanel;
