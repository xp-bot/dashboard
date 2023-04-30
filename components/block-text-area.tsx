import { isUndefined } from "lodash";
import {
  ChangeEventHandler,
  DetailedHTMLProps,
  FC,
  TextareaHTMLAttributes,
} from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

import ErrorLabel from "./input-error-label";
import Label from "./input-label";

interface IBlockTextAreaProps {
  inputProps?: DetailedHTMLProps<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  >;
  registerForm?: UseFormRegisterReturn;
  disabled?: boolean;
  value?: string | number;
  label?: string;
  placeholder?: string;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  formError?: FieldError;
}

const BlockTextArea: FC<IBlockTextAreaProps> = (props) => {
  return (
    <div className="flex grow flex-col">
      {props.label && <Label label={props.label} />}
      <textarea
        {...props.registerForm}
        {...props.inputProps}
        onChange={(e) => {
          e.currentTarget.style.height = "auto";
          e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;

          props.registerForm?.onChange(e);
          if (!isUndefined(props.onChange)) props.onChange(e);
        }}
        onClick={(e) => {
          e.currentTarget.style.height = "auto";
          e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
        }}
        disabled={props.disabled}
        defaultValue={props.value}
        placeholder={props.placeholder}
        className={`${
          props.formError ? `border-b-2 border-b-red-500` : ` border-b`
        } w-full resize-none border-b bg-black/[.02] px-3 py-1 font-serif text-darkText !outline-none !ring-0 transition-all ease-in-out focus-within:border-b-2 focus-within:bg-black/5 dark:bg-white/5 dark:text-darkText-darkMode dark:focus-within:bg-white/10 ${
          props.inputProps?.className || ``
        }`}
      />
      <ErrorLabel error={props.formError} />
    </div>
  );
};

export default BlockTextArea;
