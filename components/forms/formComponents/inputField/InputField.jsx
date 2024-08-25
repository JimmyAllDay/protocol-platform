import React from 'react';
import Tooltip from '../tooltip/Tooltip';

const InputField = ({
  name,
  label,
  tooltip,
  validation,
  autoFocus,
  register,
  readOnly,
  onClick,
  defaultValue,
  errors,
}) => {
  return (
    <div className="flex flex-col justify-items-center space-y-2 w-full">
      <label
        htmlFor={name}
        className="flex items-center justify-center space-x-2"
      >
        <div>{label}</div>
        <Tooltip message={tooltip} />
      </label>
      <input
        type="text"
        className="form-input p-1 rounded"
        id={name}
        defaultValue={defaultValue}
        autoFocus={autoFocus}
        onClick={onClick}
        readOnly={readOnly}
        {...register(name, validation)}
      />
      {errors[name] && (
        <div className="text-accent2 text-xs">{errors[name].message}</div>
      )}
    </div>
  );
};

export default InputField;
