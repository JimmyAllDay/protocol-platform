import React from 'react';

import Tooltip from '../formComponents/tooltip/Tooltip';
import { Controller } from 'react-hook-form';

export default function InputFileUpload() {
  return (
    <div className="flex flex-col space-y-2">
      <label className="flex" htmlFor="uploadInput">
        Select Audio File:
        <Tooltip message="We have only allowed users to upload 1 mix each at this time. Choose your best one!" />
      </label>
      <Controller
        name="file"
        control={control}
        defaultValue=""
        rules={{ required: 'Audio file is required' }}
        render={({ field, fieldState }) => (
          <>
            <input
              type="file"
              className="form-input-file-upload"
              onChange={(e) => field.onChange(e.target.files[0])}
              ref={(e) => {
                field.ref(e);
                fileCleanUpRef.current = e;
              }}
            />
            {fieldState?.error && (
              <p className="text-accent2">{fieldState.error.message}</p>
            )}
          </>
        )}
      />
    </div>
  );
}
