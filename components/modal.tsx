import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
import useWindowSize from "hooks/use-window-size";
import { isUndefined, random } from "lodash";
import { FC, ReactNode, useRef } from "react";

interface IModalProps {
  requestClose?: () => void;
  isOpen: boolean;
  title?: string;
  children: ReactNode;
  customKey?: string;
}

const ModalPanel: FC<IModalProps> = ({
  customKey,
  requestClose,
  children,
  title,
}) => {
  // const controls = useDragControls();
  const panelRef = useRef(null);
  const { width: windowWidth } = useWindowSize();

  const isLG = !windowWidth || windowWidth >= 900;
  return isUndefined(windowWidth) ? (
    <></>
  ) : (
    <motion.div
      ref={panelRef}
      key={`modal_${title}_${customKey || random(1.534)}_box`}
      // TODO: Implement cool way of dragging
      // drag={!isLG ? `y` : undefined}
      // onDragEnd={(e, i) => {
      //   if (requestClose && i.velocity.y > 25) {
      //     requestClose();
      //   }
      // }}
      // dragListener={false}
      // dragDirectionLock
      // dragElastic={0.1}
      // dragControls={controls}
      // dragSnapToOrigin={true}
      // dragConstraints={{ left: 0, top: 0, right: 0 }}
      variants={{
        exit: { y: isLG ? "-20px" : `100%`, opacity: 0 },
        base: {
          y: 0,
          opacity: 1,
        },
      }}
      transition={{ type: "tween", duration: 0.3 }}
      // className={`max-h-[90%]   rounded-lg bg-panelBack p-10 dark:bg-panelBack-darkMode`}
      className={`absolute bottom-0 z-10 max-h-[90%] w-full min-w-[30%] overflow-auto rounded-t-lg bg-panelBack p-10 pb-[110px] dark:bg-panelBack-darkMode 2sm:w-4/5 2sm:md:w-fit lg:relative lg:rounded-lg lg:pb-10`}
    >
      {/* <motion.div
        onPointerDown={(e) => {
          controls.start(e);
        }}
        className="absolute top-0 left-0 mb-4 flex h-10 w-full items-center justify-center"
      >
        <div
          className={`h-1 w-10 rounded-full bg-darkText/25 dark:bg-darkText-darkMode/25`}
        />
      </motion.div> */}
      {title && (
        <>
          <h2 className={`relative m-0 flex flex-row items-center gap-2`}>
            <span className="mr-10">{title}</span>
            {!!requestClose && (
              <FontAwesomeIcon
                className="absolute -right-4 cursor-pointer p-3 px-4"
                onClick={requestClose}
                icon={faClose}
              />
            )}
          </h2>
          <hr className="my-4 w-full" />
        </>
      )}

      <div className="text-darkText dark:text-darkText-darkMode">
        {children}
      </div>
    </motion.div>
  );
};

const Modal: FC<IModalProps> = ({
  isOpen,
  customKey,
  requestClose,
  children,
  title,
}) => {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key={`modal_${title}_${customKey || random(1.534)}_container`}
          initial={"exit"}
          animate={"base"}
          exit={"exit"}
          className="fixed left-0 top-0 z-30 flex h-full w-full items-center justify-center"
        >
          <motion.div
            onClick={(e) => {
              e.stopPropagation();
              requestClose && requestClose();
            }}
            variants={{ exit: { opacity: 0 }, base: { opacity: 1 } }}
            transition={{ type: "tween", duration: 0.3 }}
            className={`fixed left-0 top-0 z-0 flex h-full w-full bg-black/75 p-5 pb-[90px]`}
          />
          <ModalPanel
            isOpen={isOpen}
            customKey={customKey}
            requestClose={requestClose}
            title={title}
          >
            {children}
          </ModalPanel>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
