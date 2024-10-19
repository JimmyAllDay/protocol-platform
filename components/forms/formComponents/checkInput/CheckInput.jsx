import React from 'react';
import Tooltip from '../tooltip/Tooltip';

export default function CheckInput({
  name,
  label,
  validation,
  toolTip,
  register,
  errors,
  url,
}) {
  const handleCheckboxChange = (event) => {
    if (event.target.checked && url) {
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      if (newWindow) {
        newWindow.focus();
      }
    }
  };

  return (
    <div className="flex flex-col justify-items-center space-y-2">
      <div className="flex">
        <input
          className="checked:accent-black focus:accent-accent2 bg-black mr-2 scale-125"
          type="checkbox"
          name={name}
          {...register(name, validation)}
          onChange={handleCheckboxChange}
        />
        <label htmlFor="promo" className="text-sm flex">
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
