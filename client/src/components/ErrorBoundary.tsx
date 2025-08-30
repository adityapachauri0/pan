import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to monitoring service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // In production, send to error tracking service like Sentry
    if (process.env.NODE_ENV === 'production') {
      // window.gtag?.('event', 'exception', {
      //   description: error.toString(),
      //   fatal: false
      // });
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <div className="error-icon">⚠️</div>
            <h2>Something went wrong</h2>
            <p>We're sorry, but something unexpected happened. Please refresh the page or try again later.</p>
            <button 
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              Refresh Page
            </button>
            {process.env.NODE_ENV === 'development' && (
              <details className="error-details">
                <summary>Error Details (Dev Only)</summary>
                <pre>{this.state.error?.toString()}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;