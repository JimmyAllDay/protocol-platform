import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 dark:bg-primaryDark dark:border dark:border-accentDark rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold">Replace File?</h2>
        <p className="mt-2">
          A file is currently uploaded. Do you want to replace it?
        </p>
        <div className="mt-4 flex justify-end space-x-2">
          <button className="px-4 py-2 button-primary" onClick={onClose}>
            Cancel
          </button>
          <button className="button-primary" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
