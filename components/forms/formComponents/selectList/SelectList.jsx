import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import CreatableSelect from 'react-select/creatable';
import { selectListStyles } from './SelectListStyles';
import Tooltip from '../tooltip/Tooltip';

import { useTheme } from 'context/ThemeContext';

export default function SelectList({
  label,
  control,
  name,
  options: initialOptions,
  tooltip,
}) {
  const { theme } = useTheme();
  const styles = selectListStyles(theme);

  const [options, setOptions] = useState(initialOptions);

  const handleCreateOption = (inputValue) => {
    const newOption = { value: inputValue, label: inputValue };
    setOptions((prevOptions) => [...prevOptions, newOption]); // Update options state
  };

  return (
    <div>
      <label
        htmlFor={name}
        className="flex items-center justify-center space-x-2"
      >
        <div>{label}</div>
        <Tooltip message={tooltip} />
      </label>

      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value, ref } }) => (
          <CreatableSelect
            isMulti
            name={name}
            options={options}
            className="basic-multi-select"
            classNamePrefix="select"
            styles={styles}
            value={options.filter(
              (option) => Array.isArray(value) && value.includes(option.value)
            )}
            onChange={(vals) => onChange(vals.map((val) => val.value))}
            onCreateOption={handleCreateOption}
            ref={ref}
            placeholder="Select or type an option..."
          />
        )}
      />
    </div>
  );
}
