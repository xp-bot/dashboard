import { FC } from 'react';

interface LabelProps {
  label: string;
}

const Label: FC<LabelProps> = (props) => {
  return (
    <label>
      <h2
        className={`relative m-0 mb-1 flex flex-row items-center gap-2 text-base opacity-75 transition ease-in-out`}
      >
        {props.label}
      </h2>
    </label>
  );
};

export default Label;
