import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
import { slice, startsWith, toLower } from "lodash";
import Link from "next/link";
import { FC, useEffect, useState } from "react";

export interface IToastItem {
  text: string;
  subject?: string;
  link?: string;
  onClick?: () => void;
  type: ToastItemType;
  ttl?: number;
  id?: string;
}

interface IInboxItemProps {
  item: IToastItem;
}

export enum ToastItemType {
  NEW_MESSAGE = "NEW_MESSAGE",
  ERROR = "ERROR",
  SUCCESS = "SUCCESS",
  WARNING = "WARNING",
}

const subjectText = (type: ToastItemType) => {
  switch (type) {
    case ToastItemType.NEW_MESSAGE:
      return "You have a new message!";
    case ToastItemType.ERROR:
      return "Error";
    case ToastItemType.SUCCESS:
      return "Success";
    case ToastItemType.WARNING:
      return "Warning";
    default:
      return undefined;
  }
};

const ToastItem: FC<IInboxItemProps> = ({ item }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsVisible(false);
    }, item.ttl || 5000);

    return () => clearTimeout(timeoutId);
  }, []);

  const Content = () => (
    <>
      <div className="flex max-w-[90%] flex-col gap-1">
        {subjectText(item.type) && (
          <p
            className={`text-sm italic text-darkText opacity-75 dark:text-darkText-darkMode ${
              startsWith(
                subjectText(item.type),
                toLower(slice(subjectText(item.type), 0, 1)[0])
              )
                ? "-mt-0.5"
                : ""
            } `}
          >
            {item.subject || subjectText(item.type)}
          </p>
        )}
        <p className="line-clamp-2 w-full text-darkText dark:text-darkText-darkMode">
          {item.text}
        </p>
      </div>
      {(item.link || item.onClick) && (
        <div className="text-darkText dark:text-darkText-darkMode">
          <FontAwesomeIcon icon={faAngleRight} />
        </div>
      )}
    </>
  );

  const borderColors = {
    [ToastItemType.NEW_MESSAGE]: "border-l-xpBlue",
    [ToastItemType.ERROR]: "border-l-red-500",
    [ToastItemType.SUCCESS]: "border-l-green-500",
    [ToastItemType.WARNING]: "border-l-yellow-500",
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          layout={"position"}
          key={`toast-item-${item.id}`}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          className={`pointer-events-auto flex w-full flex-col justify-between rounded-sm rounded-l-none border border-l-4 ${
            borderColors[item.type]
          } bg-input shadow-lg dark:bg-input-darkMode dark:shadow-none dark:shadow-panelBack-darkMode`}
        >
          {item.link ? (
            <Link
              href={item.link || ""}
              onClick={item.onClick}
              className="flex flex-row items-center justify-between gap-2 p-3 pr-[18px] hover:bg-input-border/10"
            >
              <Content />
            </Link>
          ) : (
            <button
              onClick={item.onClick}
              className={`pointer-events-auto flex flex-row items-center justify-between gap-2 p-3 pr-[18px] text-start hover:bg-input-border/10 ${
                item.onClick ? "" : "cursor-default"
              }`}
            >
              <Content />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ToastItem;
