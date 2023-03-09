import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonHTMLAttributes, DetailedHTMLProps, FC } from 'react';

interface IBlockButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant?: BlockButtonVariant;
  icon?: IconDefinition;
}

export enum BlockButtonVariant {
  inPanel,
  danger,
  blog,
  save,
}

const variantToStye = (variant?: BlockButtonVariant) => {
  const className = `relative flex h-fit w-full cursor-pointer flex-row items-center whitespace-nowrap rounded-md border px-4 py-2 text-left transition ease-in-out shadow-md hover:-translate-y-1 active:translate-y-0 active:shadow-sm active:outline disabled:pointer-events-none disabled:opacity-75 disabled:grayscale text-darkText dark:text-darkText-darkMode outline-white dark:outline-panelBack-darkMode`;

  switch (variant) {
    case BlockButtonVariant.blog:
      return `border-2 px-2 py-1 transition text-darkText dark:text-darkText-darkMode  ease-in-out dark:md:hover:bg-white/10 dark:md:active:bg-white/20 md:hover:bg-black/10 md:active:bg-black/20`;
    case BlockButtonVariant.inPanel:
      return `${className} border-1 dark:text-darkText-darkMode font-semibold active:bg-button-state-pressed dark:bg-input-darkMode active:dark:bg-button-state-pressed-darkMode border-input-border bg-input dark:border-input-border-darkMode`;

    case BlockButtonVariant.save:
      return `${className} border-1 dark:text-darkText-darkMode font-semibold active:bg-button-state-pressed dark:bg-input-darkMode active:dark:bg-button-state-pressed-darkMode border-input-border bg-input justify-center dark:border-input-border-darkMode border-y-2 border-y-green-500`;

    case BlockButtonVariant.danger:
      return `${className} border-1 text-darkText-darkMode font-semibold dark:active:bg-red-500/50 active:bg-red-500/75 dark:bg-red-500/75 bg-red-500 border-input-border bg-input dark:border-input-border-darkMode`;

    default:
      return `${className} bg-panelBack dark:text-darkText-darkMode active:bg-button-state-pressed  dark:bg-panelBack-darkMode   active:dark:bg-button-state-pressed-darkMode dark:border-panelBack-darkMode`;
  }
};

const BlockButton: FC<IBlockButtonProps> = (props) => (
  <button
    {...props}
    className={`${variantToStye(props.variant)} ${
      props.className ? props.className : ``
    }`}
  >
    <div className="flex flex-row items-center gap-2">
      {props.icon && <FontAwesomeIcon icon={props.icon} />}
      {props.children}
    </div>
  </button>
);

export default BlockButton;
