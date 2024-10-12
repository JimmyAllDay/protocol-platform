// Map of Firebase error codes to user-friendly messages
const errorMessages = {
  // Auth Errors
  'auth/app-deleted': 'The app has been deleted. Please contact support.',
  'auth/app-not-authorized':
    'The app is not authorized to access Firebase. Please contact support.',
  'auth/argument-error': 'An invalid argument was provided. Please try again.',
  'auth/invalid-api-key': 'Invalid API key. Please contact support.',
  'auth/invalid-user-token':
    'Your login session has expired. Please sign in again.',
  'auth/network-request-failed':
    'Network issue. Please check your connection and try again.',
  'auth/operation-not-allowed':
    'This operation is not allowed. Please contact support.',
  'auth/requires-recent-login': 'Please log in again to proceed.',
  'auth/too-many-requests': 'Too many requests. Please try again later.',
  'auth/unauthorized-domain': 'Unauthorized domain. Please contact support.',

  // Sign-in Errors
  'auth/user-disabled': 'This account has been deleted.',
  'auth/user-token-expired':
    'Your login session has expired. Please sign in again.',
  'auth/web-storage-unsupported':
    'Your browser does not support web storage. Please enable cookies and try again.',
  'auth/popup-closed-by-user':
    'It seems you closed the login popup. Please try again.',
  'auth/popup-blocked':
    'The login popup was blocked by your browser. Please allow popups and try again.',
  'auth/unauthorized-domain':
    'Unauthorized domain for the popup operation. Please contact support.',

  // Email/Password Errors
  'auth/invalid-email':
    'The email address is not valid. Please enter a valid email.',
  'auth/user-not-found':
    'No user found with this email. Please sign up or try again.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/email-already-in-use':
    'This email is already registered. Please sign in.',

  // Account Management Errors
  'auth/account-exists-with-different-credential':
    'An account with this email exists with a different sign-in method. Please use the correct sign-in method.',
  'auth/credential-already-in-use':
    'This credential is already associated with a different user account.',
  'auth/invalid-credential': 'Invalid credentials. Please try again.',
  'auth/user-mismatch':
    'The credentials do not match the logged-in user. Please sign in again.',
  'auth/requires-recent-login':
    'This action requires a recent login. Please sign in again.',
  'auth/provider-already-linked':
    'This account is already linked to the same provider.',

  // Reset Password Errors
  'auth/invalid-action-code':
    'The action code is invalid or expired. Please try again.',
  'auth/expired-action-code':
    'The reset password link has expired. Please request a new one.',
  'auth/weak-password':
    'The password is too weak. Please use a stronger password.',
  'auth/missing-email': 'Please provide an email address to proceed.',

  // Custom Token Errors
  'auth/invalid-custom-token': 'The custom token is invalid. Please try again.',
  'auth/custom-token-mismatch':
    'The custom token does not match the current environment.',

  // Verification Errors
  'auth/missing-verification-code':
    'The verification code is missing. Please enter the code sent to you.',
  'auth/invalid-verification-code':
    'The verification code is invalid. Please try again.',
  'auth/missing-verification-id':
    'The verification ID is missing. Please try again.',

  // Reauthentication Errors
  'auth/user-disabled': 'This account has been deleted.',
  'auth/requires-recent-login': 'Please log in again to proceed.',

  // Default for unknown errors
  default: 'Something went wrong. Please try again later.',
};

//Extract a user-friendly message based on Firebase error code
export default function getErrorMessage(error) {
  if (error.code && errorMessages[error.code]) {
    return errorMessages[error.code];
  }
  return errorMessages.default;
}

//* Example of using this strategy in a catch block (copy the code inside the block)

/* 
catch (error) {
  // Log the full error to the console for debugging (or send it to your server)
console.error('Detailed Error Log:', error);
const message = getErrorMessage(error);
ShowToast(message, 'error');
} */
