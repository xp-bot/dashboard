import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import parse from 'html-react-parser';
import { CSSProperties, FC, ReactNode } from 'react';
import { fixDiscordMarkdownFormat } from 'utils/text-utils';

import Tooltip from './tooltip';

interface BasicPanelProps {
  disabled?: boolean;
  title?: string;
  description?: string;
  children?: ReactNode;
  md?: boolean;
  variant?: BasicPanelVariant;
  borderColor?: string;
  borderTop?: boolean;
  className?: string;
  style?: CSSProperties;
  tooltipText?: string;
}

export enum BasicPanelVariant {
  inPanel,
}

const variantToStye = (variant?: BasicPanelVariant) => {
  const className = `text-darkText border border-1 dark:text-darkText-darkMode font-semibold dark:bg-input-darkMode border-input-border bg-input dark:border-input-border-darkMode`;

  switch (variant) {
    case BasicPanelVariant.inPanel:
      return className;

    default:
      return ` bg-panelBack dark:bg-panelBack-darkMode`;
  }
};

const BasicPanel: FC<BasicPanelProps> = (props) => {
  return (
    <div
      style={{
        ...(props.borderColor
          ? {
              ...(props.borderTop
                ? {
                    borderTop: `3px solid ${props.borderColor}`,
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                  }
                : {
                    borderLeft: `3px solid ${props.borderColor}`,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                  }),
            }
          : undefined),
        ...props.style,
      }}
      className={`${
        props.disabled ? `pointer-events-none opacity-50` : ``
      } relative flex h-fit w-full flex-col gap-3 rounded-md p-4 shadow-md ${variantToStye(
        props.variant
      )} ${props.className || ``}`}
    >
      {(props.title || props.description) && (
        <div className="flex flex-col gap-3">
          {props.title && (
            <div className="flex items-center gap-2">
              <h2 className="m-0 flex flex-row gap-2 text-[17px]">
                {props.title}
                {props.tooltipText && (
                  <Tooltip text={props.tooltipText}>
                    <FontAwesomeIcon
                      className="text-darkText opacity-25 transition ease-in-out hover:opacity-75 dark:text-darkText-darkMode"
                      icon={faInfoCircle}
                    />
                  </Tooltip>
                )}
              </h2>
            </div>
          )}
          {props.description && (
            <i>
              <h4 className={`text-darkText dark:text-darkText-darkMode`}>
                {props.md
                  ? parse(fixDiscordMarkdownFormat(props.description))
                  : props.description}{' '}
              </h4>
            </i>
          )}
        </div>
      )}

      {props.children}
    </div>
  );
};

export default BasicPanel;
