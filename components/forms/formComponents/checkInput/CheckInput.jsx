import React from 'react';
import Tooltip from '../tooltip/Tooltip';

export default function CheckInput({
  name,
  label,
  validation,
  toolTip,
  register,
  errors,
}) {
  return (
    <div className="flex flex-col justify-items-center space-y-2">
      <div className="flex">
        <input
          className="accent-black bg-black border border-white mr-2"
          type="checkbox"
          name={name}
          {...register(name, validation)}
        />
        <label htmlFor="promo" className="text-xs flex">
          <div>{label}</div>
          <div>
            <Tooltip message={toolTip} />
          </div>
        </label>
      </div>
      {errors[name] && (
        <div className="form-error-text">This field is required</div>
      )}
    </div>
  );
}
