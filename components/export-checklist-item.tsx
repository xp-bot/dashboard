import {
  faCheckCircle,
  faTriangleCircleSquare,
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
    icon: faTriangleCircleSquare,
  },
};

interface IExportChecklistItemProps {
  type: ExportChecklistItemTypes;
  text: string;
}

const ExportChecklistItem: FC<IExportChecklistItemProps> = ({ text, type }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center gap-2">
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
