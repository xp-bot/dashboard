import {
  ChangeEventHandler,
  DetailedHTMLProps,
  FC,
  InputHTMLAttributes,
} from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

import ErrorLabel from './input-error-label';
import Label from './input-label';

interface InputProps {
  inputProps?: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
  registerForm?: UseFormRegisterReturn;
  disabled?: boolean;
  value?: string | number;
  label?: string;
  placeholder?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  formError?: FieldError;
}

const BlockInput: FC<InputProps> = (props) => {
  return (
    <div className="flex grow flex-col">
      {props.label && <Label label={props.label} />}
      <input
        {...props.inputProps}
        {...props.registerForm}
        onChange={
          props.registerForm ? props.registerForm.onChange : props.onChange
        }
        disabled={props.disabled}
        defaultValue={props.value}
        placeholder={props.placeholder}
        className={`${
          props.formError ? `border-b-2 border-b-red-500` : ` border-b`
        } w-full border-b bg-black/[.02] px-3 py-1 font-serif text-[1.55rem] text-darkText !outline-none !ring-0 transition-all ease-in-out placeholder:text-base focus-within:border-b-2 focus-within:bg-black/5 dark:bg-white/5 dark:text-darkText-darkMode dark:focus-within:bg-white/10`}
      />
      <ErrorLabel error={props.formError} />
    </div>
  );
};

export default BlockInput;
