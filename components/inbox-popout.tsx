import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useUser } from "context/user-context";
import { AnimatePresence, motion } from "framer-motion";
import { map, size } from "lodash";
import { FC } from "react";

import InboxItem from "./inbox-item";

interface IInboxPopoutProps {
  inboxOpen: boolean;
  requestClose: () => void;
}

const InboxPopout: FC<IInboxPopoutProps> = ({ inboxOpen, requestClose }) => {
  const user = useUser();

  return (
    <AnimatePresence>
      {inboxOpen && size(user.inbox.inboxItems) > 0 && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ ease: "easeInOut", duration: 0.2 }}
          className="fixed -bottom-px right-10 z-10 flex h-fit w-96 flex-col overflow-hidden rounded-t-md bg-panelBack shadow-panelBack dark:bg-panelBack-darkMode dark:shadow-panelBack-darkMode"
        >
          <div className="flex items-center justify-between gap-2 bg-xpBlue p-4 transition ease-in-out dark:bg-panelBack/10">
            <h2 className="m-0 flex flex-row gap-2 text-[17px] text-lightText">
              Inbox
            </h2>
            <button
              onClick={requestClose}
              className="p-1 text-sm text-lightText"
            >
              <FontAwesomeIcon icon={faX} />
            </button>
          </div>
          <div className="flex max-h-[70vh] w-full flex-col items-center gap-2 overflow-auto p-4">
            {map(user.inbox.inboxItems, (inboxItem) => (
              <InboxItem inboxItem={inboxItem} />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InboxPopout;
