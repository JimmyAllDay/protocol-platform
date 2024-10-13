import React, { Component } from 'react';
import Link from 'next/link';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service (like Sentry)
    console.error('Error caught in ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="error-fallback">
          <h1>Oops! Something went wrong.</h1>
          <p>You can try either returning to the home page.</p>
          <button
            className="button-primary"
            onClick={() => (window.location.href = '/')}
          >
            Go to Home
          </button>
          <p>
            If the error keeps happening, contact{' '}
            <a
              className="mailLink"
              href="mailto:protocol.underground@gmail.com?subject=Protocol%20App%20Error&body=The%20Protocol%20Underground%20App%20Crashed..."
            >
              support.
            </a>
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
