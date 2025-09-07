'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: errorInfo });
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} retry={this.handleRetry} />;
      }

      return <DefaultErrorFallback error={this.state.error!} retry={this.handleRetry} />;
    }

    return this.props.children;
  }
}

interface DefaultErrorFallbackProps {
  error: Error;
  retry: () => void;
}

function DefaultErrorFallback({ error, retry }: DefaultErrorFallbackProps) {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="glass-card rounded-xl max-w-md w-full p-8 text-center">
        {/* Error Icon */}
        <div className="bg-red-500 bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={32} className="text-red-400" />
        </div>

        {/* Error Title */}
        <h1 className="text-2xl font-bold text-white mb-4">
          Oops! Something went wrong
        </h1>

        {/* Error Description */}
        <p className="text-gray-300 mb-6">
          We encountered an unexpected error while preparing your culinary experience. 
          Don't worry, our AI chef is working to fix this!
        </p>

        {/* Error Details (Development Only) */}
        {isDevelopment && (
          <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="text-sm font-semibold text-red-400 mb-2">Error Details:</h3>
            <p className="text-xs text-gray-300 font-mono break-all">
              {error.message}
            </p>
            {error.stack && (
              <details className="mt-2">
                <summary className="text-xs text-gray-400 cursor-pointer">Stack Trace</summary>
                <pre className="text-xs text-gray-400 mt-2 overflow-auto max-h-32">
                  {error.stack}
                </pre>
              </details>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={retry}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} />
            Try Again
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="flex-1 bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg hover:bg-gray-600 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Home size={18} />
            Go Home
          </button>
        </div>

        {/* Help Text */}
        <p className="text-xs text-gray-400 mt-6">
          If this problem persists, please refresh the page or contact support.
        </p>
      </div>
    </div>
  );
}

// Hook for functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: React.ErrorInfo) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo);
    
    if (process.env.NODE_ENV === 'production') {
      // Log to external service
      // Example: Sentry.captureException(error, { extra: errorInfo });
    }
  };
}
