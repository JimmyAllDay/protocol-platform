const getError = (err) =>
  err.response && err.response.data && err.response.data.message
    ? err.response.data.message
    : err.message;

const mapFirebaseErrorToMessage = (err) => {
  switch (error.code) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-not-found':
      return 'No user found with this email address.';
    //TODO: Map other firebase errors
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};

export { getError, mapFirebaseErrorToMessage };
