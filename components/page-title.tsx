import {
  faArrowCircleLeft,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { join, slice, split } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";

import Tooltip from "./tooltip";

const PageTitle = (props: {
  motionTextKey?: string;
  disableArrow?: boolean;
  title: string;
  tooltipText?: string;
  children?: ReactNode;
}) => {
  const router = useRouter();
  const splitted = split(router.asPath, `/`);
  const previousSlug = `/${join(slice(splitted, 0, -1), `/`)}`;

  return (
    <>
      <div className="flex flex-row justify-between lg:hidden">
        <Link
          href={props.disableArrow ? `#` : previousSlug}
          className={`lg:hidden ${
            props.disableArrow ? `pointer-events-none` : ``
          }`}
        >
          <motion.h2
            transition={{ type: "tween" }}
            layoutId={props.motionTextKey}
            className={`relative mb-6 mt-2 flex flex-row items-center gap-2 transition ease-in-out active:-translate-x-1`}
          >
            {!props.disableArrow && (
              <div className="text-[1.2rem] text-darkText drop-shadow-sm dark:text-darkText-darkMode dark:opacity-50">
                <FontAwesomeIcon icon={faArrowCircleLeft} />
              </div>
            )}

            {props.title}
          </motion.h2>
        </Link>
      </div>
      <div className="hidden flex-row items-center justify-between lg:flex">
        <div className="flex-row items-center gap-2 lg:flex">
          <h2 className="my-6 w-fit">{props.title}</h2>
          {props.tooltipText && (
            <Tooltip text={props.tooltipText}>
              <FontAwesomeIcon
                className="text-darkText opacity-25 transition ease-in-out hover:opacity-75 dark:text-darkText-darkMode"
                icon={faInfoCircle}
              />
            </Tooltip>
          )}
        </div>
        {props.children}
      </div>
    </>
  );
};

export default PageTitle;
