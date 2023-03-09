import { CSSProperties, FC, ReactNode } from 'react';

interface BoxPanelProps {
  children: ReactNode;
  className?: string;
  styles?: CSSProperties;
}

const BoxPanel: FC<BoxPanelProps> = ({ children, className, styles }) => {
  return (
    <div
      style={styles}
      className={`flex h-full w-fit min-w-[80px] items-center justify-center rounded-md border border-input-border p-2 text-center shadow-sm ${
        className || ``
      }`}
    >
      {children}
    </div>
  );
};

export default BoxPanel;
