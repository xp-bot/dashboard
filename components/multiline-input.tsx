import { isUndefined } from 'lodash';
import {
  ChangeEventHandler,
  DetailedHTMLProps,
  FC,
  InputHTMLAttributes,
} from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

import ErrorLabel from './input-error-label';
import Label from './input-label';

interface MultilineInputProps {
  inputProps?: DetailedHTMLProps<
    InputHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  >;
  registerForm?: UseFormRegisterReturn;
  disabled?: boolean;
  value: string | number;
  label?: string;
  placeholder?: string;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  formError?: FieldError;
}

const MultilineInput: FC<MultilineInputProps> = (props) => {
  return (
    <div className="flex flex-col">
      {props.label && <Label label={props.label} />}

      <textarea
        {...props.inputProps}
        {...props.registerForm}
        onChange={(e) => {
          e.currentTarget.style.height = 'auto';
          e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;

          props.registerForm?.onChange(e);
          if (!isUndefined(props.onChange)) props.onChange(e);
        }}
        onClick={(e) => {
          e.currentTarget.style.height = 'auto';
          e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
        }}
        disabled={props.disabled}
        defaultValue={props.value}
        placeholder={props.placeholder}
        className={`${
          props.disabled ? `pointer-events-none opacity-50` : ``
        } resize-none rounded-md border-[1px] border-input-border bg-input p-2.5 font-medium text-darkText shadow-input outline-8 outline-transparent transition ease-in-out focus-within:border-[1px] focus-within:outline-input-border dark:border-input-border-darkMode dark:bg-input-darkMode dark:text-darkText-darkMode`}
      />
      <ErrorLabel error={props.formError} />
    </div>
  );
};

export default MultilineInput;
