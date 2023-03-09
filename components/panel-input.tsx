import {
  ChangeEventHandler,
  DetailedHTMLProps,
  FC,
  HTMLInputTypeAttribute,
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
  value: string | number;
  label?: string;
  placeholder?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  formError?: FieldError;
  type?: HTMLInputTypeAttribute;
}

const PanelInput: FC<InputProps> = (props) => {
  return (
    <div className="flex flex-col">
      {props.label && <Label label={props.label} />}

      <input
        {...props.inputProps}
        {...props.registerForm}
        type={props.type}
        onChange={(e) => {
          props.registerForm && props.registerForm.onChange(e);
          props.onChange && props.onChange(e);
        }}
        disabled={props.disabled}
        defaultValue={props.value}
        placeholder={props.placeholder}
        className={`${
          props.disabled ? `pointer-events-none opacity-50` : ``
        } rounded-md border-[1px] border-input-border bg-input p-2.5 font-medium text-darkText shadow-input outline-8 outline-transparent transition ease-in-out focus-within:border-[1px] focus-within:outline-input-border dark:border-input-border-darkMode dark:bg-input-darkMode dark:text-darkText-darkMode`}
      />
      <ErrorLabel error={props.formError} />
    </div>
  );
};

export default PanelInput;
