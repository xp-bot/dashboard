import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { isUndefined } from "lodash";
import { IXPAPIUser } from "models/backend/xp-models";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";

import { getRouteParts } from "../../utils/url-utils";

interface TabButtonProps {
  button: ITabButton;
  theme?: TabButtonTheme;
  className?: string;
  fixedMode?: boolean;
}

export enum TabButtonTheme {
  "Page",
  "Title",
}

export interface ITabButton {
  text: string;
  link?: string;
  shallowRouting?: boolean;
  isActive?: (path: string[]) => boolean;
  isVisible?: (user: IXPAPIUser | undefined, path: string[]) => boolean;
  element?: JSX.Element;
  marginLeft?: boolean;
  disabled?: boolean;
  icon?: IconProp;
  executeFunction?: number;
}

const ButtonStyle = (
  theme: TabButtonTheme | undefined,
  active: boolean,
  fixedMode?: boolean
) => {
  const BaseStyle =
    "relative font-inter text-tiny transition ease-in-out flex flex-row items-center justify-center gap-2";

  switch (theme) {
    case TabButtonTheme.Page:
      return active
        ? `cursor-default text-xpBlue opacity-100 font-medium ${BaseStyle}`
        : `font-medium text-darkText dark:text-darkText-darkMode group-hover:opacity-75 dark:opacity-50 ${BaseStyle}`;

    default:
      return active
        ? `${
            fixedMode ? `text-darkText font-semibold` : `text-white`
          } cursor-default opacity-100 font-medium ${BaseStyle}`
        : `${
            fixedMode
              ? `text-darkText`
              : `text-lightText dark:text-lightText-darkMode`
          } opacity-50 group-hover:opacity-75 ${BaseStyle}`;
  }
};

const TabButton: FC<TabButtonProps> = ({
  button,
  theme,
  className,
  fixedMode,
}) => {
  const router = useRouter();
  const currentPath = getRouteParts(router);

  const ButtonContents = () => (
    <>
      {button.element}
      {button.text}
      {button.icon && (
        <FontAwesomeIcon className="opacity-75" icon={button.icon} />
      )}

      {isUndefined(button.isActive)
        ? false
        : button.isActive(currentPath) && (
            <motion.div
              transition={{ type: "spring", bounce: 0.2 }}
              layoutId="selectedDot"
              initial={false}
              // eslint-disable-next-line tailwindcss/no-custom-classname
              className={`selectedDot ${
                theme === TabButtonTheme.Title
                  ? `${
                      fixedMode
                        ? `text-darkText`
                        : `text-lightText dark:text-lightText-darkMode`
                    }`
                  : `text-xpBlue`
              } absolute bottom-[-5px]`}
            >
              •
            </motion.div>
          )}
    </>
  );

  return (
    <div
      className={`${
        (isUndefined(button.isActive) ? false : button.isActive(currentPath))
          ? ``
          : `hover:-translate-y-1 focus:translate-y-0 active:translate-y-0`
      } group transition ease-in-out ${
        button.disabled ? `pointer-events-none opacity-75` : ``
      }`}
    >
      {button.link ? (
        <Link
          className={`${ButtonStyle(
            theme,
            button.isActive ? button.isActive(currentPath) : false,
            fixedMode
          )} ${className}`}
          shallow={button.shallowRouting}
          href={button.link || ``}
        >
          <ButtonContents />
        </Link>
      ) : (
        <div
          className={`${ButtonStyle(
            theme,
            button.isActive ? button.isActive(currentPath) : false,
            fixedMode
          )} ${className}`}
        >
          <ButtonContents />
        </div>
      )}
    </div>
  );
};

export default TabButton;
