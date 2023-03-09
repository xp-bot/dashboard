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
            className={`ease-in-out relative m-0 mt-1 text-red-600 dark:text-red-400 dark:font-normal opacity-75 text-sm flex flex-row items-center gap-2 transition`}
          >
            {props.error.message || `Please check the Input.`}
          </h2>
        </label>
      )}
    </>
  );
};

export default ErrorLabel;
