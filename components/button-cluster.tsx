import {
  faAngleRight,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isUndefined, map, size, startsWith } from 'lodash';
import Link from 'next/link';
import { FC, MouseEventHandler } from 'react';

import PageTitle from './page-title';

interface IButton {
  text: string;
  icon?: IconDefinition;
  feature?: ButtonFeature;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  link?: string;
  shallowLink?: boolean;
  disabled?: boolean;
  submitType?: boolean;
}

export enum ButtonFeature {
  'danger' = 'bg-button-red text-lightText active:bg-button-red-pressed dark:bg-button-red-darkMode active:dark:bg-button-red-pressed-darkMode',
  'save' = 'bg-button-green border-[#70C464] text-lightText active:bg-button-green-pressed dark:bg-button-green-darkMode active:dark:bg-button-green-pressed-darkMode',
}

interface ButtonClusterProps {
  buttons: IButton[];
  title?: string;
  isInPanel?: boolean;
}

const MobileClusterButton: FC<IButton> = ({
  text,
  icon,
  feature,
  onClick,
  disabled,
  submitType,
}) => (
  <button
    disabled={disabled}
    onClick={onClick}
    type={submitType ? `submit` : `button`}
    className={`relative flex w-full flex-row items-center py-[9px] text-left disabled:pointer-events-none disabled:opacity-75 ${
      feature ||
      `active:bg-button-state-pressed active:dark:bg-button-state-pressed-darkMode`
    }`}
  >
    <div className="flex h-full w-[54px] items-center justify-center">
      {icon && <FontAwesomeIcon className="text-base" icon={icon} />}
    </div>
    <span className="w-full pr-10">{text}</span>

    <FontAwesomeIcon
      className={`absolute right-4 ${
        isUndefined(feature) ? `text-button-arrow` : ``
      }`}
      icon={faAngleRight}
    />
  </button>
);

interface IDesktopButton extends IButton {
  isInPanel?: boolean;
}
const DesktopClusterButton: FC<IDesktopButton> = ({
  text,
  icon,
  feature,
  onClick,
  disabled,
  isInPanel,
  submitType,
}) => (
  <button
    disabled={disabled}
    onClick={onClick}
    type={submitType ? `submit` : `button`}
    className={`relative flex w-full cursor-pointer flex-row items-center rounded-md py-3 pr-12 text-left shadow-md outline-white transition ease-in-out hover:-translate-y-1 active:translate-y-0 active:shadow-sm active:outline disabled:pointer-events-none  disabled:opacity-75 disabled:grayscale  dark:outline-panelBack-darkMode  ${
      feature ||
      `${
        isInPanel
          ? `border-[1px] border-input-border bg-input active:bg-input/75 dark:border-input-border-darkMode dark:bg-input-darkMode active:dark:bg-input-darkMode/75`
          : `border bg-panelBack active:bg-button-state-pressed dark:border-panelBack-darkMode dark:bg-panelBack-darkMode active:dark:bg-button-state-pressed-darkMode`
      }`
    } `}
  >
    {icon ? (
      <div className="flex h-full w-[54px] items-center justify-center">
        <FontAwesomeIcon className="text-base opacity-75" icon={icon} />
      </div>
    ) : (
      <div className="w-4" />
    )}
    {text}

    <FontAwesomeIcon
      className={`absolute right-4 ${
        isUndefined(feature) ? `text-button-arrow` : ``
      }`}
      icon={faAngleRight}
    />
  </button>
);

const ButtonCluster: FC<ButtonClusterProps> = ({
  buttons,
  title,
  isInPanel,
}) => {
  return (
    <div className="w-full">
      {title && <PageTitle title={title} disableArrow />}
      <div
        className={`flex flex-col items-end overflow-hidden rounded-md bg-panelBack  text-darkText shadow-md dark:bg-panelBack-darkMode dark:text-darkText-darkMode dark:shadow-none lg:hidden ${
          isInPanel
            ? `border-[1px] border-input-border dark:border-input-border-darkMode`
            : ``
        }`}
      >
        {map(buttons, (button, idx) => (
          <div
            className={`${button.disabled ? `pointer-events-none` : ``} w-full`}
            key={`button-cluster-button-${title || ``}-${idx}`}
          >
            {button.link ? (
              <Link
                shallow={button.shallowLink}
                target={
                  startsWith(button.link, `/`) ||
                  startsWith(button.link, process.env.BACKEND_DOMAIN)
                    ? ``
                    : `_blank`
                }
                href={button.link}
              >
                <MobileClusterButton {...button} />
              </Link>
            ) : (
              <MobileClusterButton {...button} />
            )}
            {idx < size(buttons) - 1 && (
              <hr className="relative left-[54px] w-full border-[.5px]" />
            )}
          </div>
        ))}
      </div>
      <div className="hidden flex-row flex-wrap gap-6 text-darkText dark:text-darkText-darkMode lg:flex">
        {map(buttons, (button, idx) => (
          <div
            className={`${
              button.disabled ? `pointer-events-none` : ``
            } w-fit grow`}
            key={idx}
          >
            {button.link ? (
              <Link
                shallow={button.shallowLink}
                target={
                  startsWith(button.link, `/`) ||
                  startsWith(button.link, process.env.BACKEND_DOMAIN)
                    ? ``
                    : `_blank`
                }
                href={button.link}
              >
                <DesktopClusterButton isInPanel={isInPanel} {...button} />
              </Link>
            ) : (
              <DesktopClusterButton isInPanel={isInPanel} {...button} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ButtonCluster;
