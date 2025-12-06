import React, { ReactNode, useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children, fallback, onError }) => {
  const [state, setState] = useState<ErrorBoundaryState>({
    hasError: false,
    error: null,
    errorInfo: null
  });

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const error = new Error(`Global error: ${event.message}`);
      setState({
        hasError: true,
        error,
        errorInfo: null
      });
      console.error('ErrorBoundary caught global error:', event.error);
      onError?.(error);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = new Error(`Unhandled promise rejection: ${event.reason}`);
      setState({
        hasError: true,
        error,
        errorInfo: null
      });
      console.error('ErrorBoundary caught unhandled rejection:', event.reason);
      onError?.(error);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [onError]);

  const componentDidCatch = (error: Error, errorInfo: React.ErrorInfo) => {
    setState({
      hasError: true,
      error,
      errorInfo
    });
    console.error('ErrorBoundary caught component error:', error, errorInfo);
    onError?.(error);
  };

  const handleRetry = () => {
    setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  if (state.hasError) {
    return fallback || (
      <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-red-50 to-white p-4 md:p-6">
        <div className="max-w-md w-full bg-white rounded-xl shadow-2xl border border-red-100 p-6 md:p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Application Error</h2>
          <p className="text-red-600 mb-4 text-sm md:text-base">Something went wrong while running the application.</p>

          <div className="space-y-3 mb-6">
            {state.error && (
              <div className="p-3 bg-gray-50 rounded-lg text-left text-xs border border-gray-200">
                <p className="font-semibold text-gray-700 mb-1">Error Details:</p>
                <pre className="font-mono text-[11px] text-gray-600 overflow-auto max-h-20">{state.error.message}</pre>
                {state.errorInfo && (
                  <div className="mt-2">
                    <p className="font-semibold text-gray-700 mb-1">Component Stack:</p>
                    <pre className="font-mono text-[10px] text-gray-500 overflow-auto max-h-16">{state.errorInfo.componentStack}</pre>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleRetry}
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-mono text-xs font-bold uppercase flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-mono text-xs font-bold uppercase"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};