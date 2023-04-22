import { ReactNode } from 'react';

const Tooltip = (props: {
  text: string;
  children: ReactNode;
  showContentOnMobile?: boolean;
  alignLeft?: boolean;
}) => {
  return (
    <>
      <div
        className={`group relative hidden items-center ${
          props.alignLeft ? `justify-start` : `justify-center`
        }  text-base font-normal lg:flex`}
      >
        {props.children}
        <p className="pointer-events-none absolute top-[100%] z-10 flex w-[300px] -translate-y-4 scale-90 items-center justify-center rounded-md border border-input-border bg-panelBack/75 p-3 text-center text-darkText opacity-0 shadow-md backdrop-blur-md transition ease-in-out group-hover:translate-y-4 group-hover:scale-100 group-hover:opacity-100 dark:border-input-border-darkMode dark:bg-panelBack-darkMode/75 dark:text-darkText-darkMode">
          {props.text}
        </p>
      </div>
      {props.showContentOnMobile && (
        <div className="block lg:hidden">{props.children}</div>
      )}
    </>
  );
};

export default Tooltip;
