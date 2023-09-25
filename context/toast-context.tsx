// eslint-disable-next-line import/no-cycle
import ToastItem, { IToastItem } from "components/toast-item";
import { AnimatePresence, motion } from "framer-motion";
import { noop, random, slice } from "lodash";
import { createContext, ReactNode, useContext, useState } from "react";

interface IToastContextValues {
  toast: (toast: IToastItem) => void;
}

export const ToastContext = createContext<IToastContextValues>({
  toast: noop,
});

interface IToastContextProviderProps {
  children: JSX.Element[] | JSX.Element;
}

export function ToastContextProvider({
  children,
}: IToastContextProviderProps): React.ReactElement {
  const [toastItems, setToastItems] = useState<ReactNode[]>([]);

  const handleToast = (toast: IToastItem, key?: string) => {
    const itemKey = key || random(0, 1000000);
    setToastItems(
      slice(
        [
          ...toastItems,
          <ToastItem
            key={itemKey}
            item={{
              ...toast,
              id: toast.id || `${random(0, 1000000)}`,
            }}
          />,
        ],
        -5
      )
    );
  };

  return (
    <ToastContext.Provider
      value={{
        toast: handleToast,
      }}
    >
      {children}
      <motion.div
        key="toast-container"
        className="pointer-events-none fixed bottom-[calc(env(safe-area-inset-bottom)+80px)] right-0 z-10 flex w-full flex-col gap-5 px-5 md:right-5 md:w-80 md:px-0 lg:bottom-5"
      >
        <AnimatePresence mode="popLayout">{toastItems}</AnimatePresence>
      </motion.div>
    </ToastContext.Provider>
  );
}

export const useToast = (): IToastContextValues => useContext(ToastContext);
