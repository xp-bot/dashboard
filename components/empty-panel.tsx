import { FC } from "react";

/**
 * @var onChange Only works if registerForm is undefined
 */
interface EmptyPanelProps {
  text: string;
}

const EmptyPanel: FC<EmptyPanelProps> = (props) => {
  return (
    <div className="flex w-full flex-col gap-3 text-center opacity-50 md:flex-row md:gap-5">
      <div className="flex grow flex-row gap-5">
        <div
          className="relative h-fit w-full rounded-md border-transparent bg-panelBack px-4 py-2 text-darkText shadow-md focus-within:outline-none dark:bg-panelBack-darkMode dark:text-darkText-darkMode md:grow"
        >
          {props.text}
        </div>
      </div>
    </div>
  );
};

export default EmptyPanel;
