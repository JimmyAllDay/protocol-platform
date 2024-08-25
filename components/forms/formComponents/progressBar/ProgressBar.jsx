import React from 'react';

export default function ProgressBar({ progress }) {
  return (
    <>
      <div className="form-progress-bar-container">
        <div
          className="form-progress-bar"
          style={{ width: progress.progress }}
        ></div>
      </div>
      <p className="form-progress-bar-message">{progress.message}</p>
    </>
  );
}
