import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useUser } from "context/user-context";
import { AnimatePresence, motion } from "framer-motion";
import useBreakpoints from "hooks/use-breakpoints";
import { map, size } from "lodash";
import { FC, useEffect } from "react";

import AnimatedDivList from "./animated-div-list";
// eslint-disable-next-line import/no-cycle
import InboxItem from "./inbox-item";
import Modal from "./modal";

interface IInboxPopoutProps {
  inboxOpen: boolean;
  requestClose: () => void;
}

const InboxPopout: FC<IInboxPopoutProps> = ({ inboxOpen, requestClose }) => {
  const user = useUser();
  const breakpoints = useBreakpoints();

  useEffect(() => {
    if (size(user.inbox.inboxItems) === 0) {
      requestClose();
    }
  }, [user.inbox.inboxItems]);

  const Content = () => (
    <div className="flex h-fit w-full flex-col items-center gap-2 md:max-h-[70vh] md:w-full md:overflow-auto md:p-4">
      <AnimatedDivList
        disableSeparators
        emptyMessage="You have no messages in your inbox."
        // eslint-disable-next-line react/no-children-prop
      >
        {map(user.inbox.inboxItems, (inboxItem) => ({
          // eslint-disable-next-line no-underscore-dangle
          key: `inbox-item ${inboxItem._id}}`,
          element: (
            <>
              <InboxItem inboxItem={inboxItem} />
            </>
          ),
        }))}
      </AnimatedDivList>
      <hr className="my-2 mb-1 w-full" />
      <div className="flex w-full justify-evenly">
        <button
          onClick={() => user.inbox.markAllInboxItemsRead()}
          className="text-sm italic text-darkText opacity-50 transition ease-in-out hover:opacity-100 dark:text-darkText-darkMode"
        >
          Mark all as read
        </button>
        <button
          onClick={() => user.inbox.dismissAllInboxItems()}
          className="text-sm italic text-darkText opacity-50 transition ease-in-out hover:opacity-100 dark:text-darkText-darkMode"
        >
          Dismiss and delete all
        </button>
      </div>
      <div className="h-[calc(env(safe-area-inset-bottom))] w-full md:hidden" />
    </div>
  );

  if (breakpoints.isMd)
    return (
      <AnimatePresence>
        {inboxOpen && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ ease: "easeInOut", duration: 0.2 }}
            className="fixed bottom-[calc(env(safe-area-inset-bottom)+65px)] right-10 z-20 flex h-fit w-96 flex-col overflow-hidden rounded-t-md border border-b-0 bg-panelBack shadow-xl dark:bg-panelBack-darkMode dark:shadow-none dark:shadow-panelBack-darkMode lg:-bottom-px"
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
            <Content />
          </motion.div>
        )}
      </AnimatePresence>
    );
  return (
    <Modal
      customKey="inbox-popout-mobile"
      isOpen={inboxOpen}
      title="Inbox"
      requestClose={requestClose}
    >
      <Content />
    </Modal>
  );
};

export default InboxPopout;
