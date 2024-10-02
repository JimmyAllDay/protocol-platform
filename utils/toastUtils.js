import { toast } from 'react-toastify';

const showToast = (message, type = 'info', toastId = 'default-toast-id') => {
  if (!toast.isActive(toastId)) {
    if (type === 'error') {
      toast.error(message, { toastId });
    } else if (type === 'success') {
      toast.success(message, { toastId });
    } else if (type === 'info') {
      toast.info(message, { toastId });
    } else {
      toast(message, { toastId });
    }
  }
};

export default showToast;

//* Example use
//showToast("Please complete your profile before uploading a mix", 'error', 'default-toast-id')
//showToast("Please complete your profile before uploading a mix", 'sucess', 'default-toast-id')
//showToast("Please complete your profile before uploading a mix", 'info', 'default-toast-id')
