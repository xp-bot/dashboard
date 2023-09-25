import { FC } from 'react';
import { FieldError } from 'react-hook-form';

interface ErrorLabelProps {
  error?: FieldError;
}

const ErrorLabel: FC<ErrorLabelProps> = (props) => {
  return (
    <>
      {props.error && (
        <label>
          <h2
            className="relative m-0 mt-1 flex flex-row items-center gap-2 text-sm text-red-600 opacity-75 transition ease-in-out dark:font-normal dark:text-red-400"
          >
            {props.error.message || `Please check the Input.`}
          </h2>
        </label>
      )}
    </>
  );
};

export default ErrorLabel;
