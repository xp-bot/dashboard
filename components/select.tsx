import { map } from 'lodash';
import { CSSProperties, FC, LegacyRef } from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

import ErrorLabel from './input-error-label';
import Label from './input-label';

/**
 * @var onChange Only works if registerForm is undefined
 */
interface SelectProps {
  options: { title: string; id: string; selected?: boolean }[];
  value?: string;
  onChange?: (value: string) => void | undefined;
  className?: string;
  isInPanel?: boolean;
  label?: string;
  registerForm?: UseFormRegisterReturn;
  formError?: FieldError;
  disabled?: boolean;
  ref?: LegacyRef<HTMLSelectElement>;
  style?: CSSProperties;
}

const Select: FC<SelectProps> = (props) => {
  const changeState = (value: string) => {
    if (props.onChange) props.onChange(value);
  };

  return (
    <div className="flex w-full flex-col">
      {props.label && <Label label={props.label} />}
      <select
        style={props.style}
        ref={props.ref}
        {...props.registerForm}
        onChange={(e) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          !props.registerForm
            ? changeState(e.target.value)
            : props.registerForm.onChange(e);
        }}
        disabled={props.disabled}
        className={`${props.disabled ? `pointer-events-none opacity-50` : ``} ${
          props.className || ``
        } ${
          props.isInPanel
            ? `border-[1px] border-input-border bg-input p-2.5 font-medium shadow-sm dark:border-input-border-darkMode dark:bg-input-darkMode`
            : `border-transparent bg-panelBack p-2 shadow-md dark:bg-panelBack-darkMode`
        } relative h-[45.5px] w-full cursor-pointer rounded-md  text-darkText focus-within:outline-none dark:text-darkText-darkMode`}
        defaultValue={props.value}
      >
        {map(props.options, (option) => {
          return (
            <option
              selected={option.selected}
              key={`${option.title}-${option.id}`}
              value={option.id}
            >
              {option.title}
            </option>
          );
        })}
      </select>
      <ErrorLabel error={props.formError} />
    </div>
  );
};

export default Select;
