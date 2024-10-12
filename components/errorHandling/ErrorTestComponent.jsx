import React from 'react';

const ErrorTestComponent = () => {
  throw new Error('This is a test error!');
  return <div>This will never render</div>;
};

export default ErrorTestComponent;
