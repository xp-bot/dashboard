import {
  faCheckCircle,
  faDotCircle,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC } from "react";

export enum ExportChecklistItemTypes {
  CHECK = "check",
  CROSS = "cross",
  WARNING = "warning",
}

const ExportChecklistItemTypesMap = {
  [ExportChecklistItemTypes.CHECK]: {
    color: "text-green-500",
    icon: faCheckCircle,
  },
  [ExportChecklistItemTypes.CROSS]: {
    color: "text-red-500",
    icon: faXmarkCircle,
  },
  [ExportChecklistItemTypes.WARNING]: {
    color: "text-yellow-500",
    icon: faDotCircle,
  },
};

interface IExportChecklistItemProps {
  type: ExportChecklistItemTypes;
  text: string;
  rtl?: boolean;
}

const ExportChecklistItem: FC<IExportChecklistItemProps> = ({
  text,
  type,
  rtl,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div
        className={`flex flex-row items-center gap-2 ${
          rtl ? "flex-row-reverse" : ""
        }`}
      >
        <FontAwesomeIcon
          className={`${ExportChecklistItemTypesMap[type].color} text-lg`}
          icon={ExportChecklistItemTypesMap[type].icon}
        />
        <p>{text}</p>
      </div>
    </div>
  );
};

export default ExportChecklistItem;
