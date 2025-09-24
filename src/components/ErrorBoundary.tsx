import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to console for debugging
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/50 p-8 max-w-2xl w-full">
            <div className="text-center">
              {/* Error Icon */}
              <div className="mx-auto w-20 h-20 mb-6 relative">
                <div className="absolute inset-0 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-10 h-10 text-red-600" />
                </div>
                <div className="absolute inset-0 bg-red-200 rounded-full animate-ping opacity-20"></div>
              </div>

              {/* Error Title */}
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Oops! Something went wrong
              </h1>

              <p className="text-gray-600 mb-8 leading-relaxed">
                We encountered an unexpected error while rendering the application. 
                This might be due to a temporary issue or a problem with the component.
              </p>

              {/* Error Details (in development) */}
              {import.meta.env.DEV && this.state.error && (
                <div className="mb-8 p-4 bg-gray-100 rounded-lg text-left">
                  <h3 className="font-semibold text-gray-800 mb-2">Error Details:</h3>
                  <div className="text-sm text-gray-700 font-mono">
                    <div className="mb-2">
                      <strong>Error:</strong> {this.state.error.message}
                    </div>
                    <div className="mb-2">
                      <strong>Component:</strong> {this.state.errorInfo?.componentStack}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={this.handleReset}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <RefreshCw className="w-5 h-5" />
                  Try Again
                </button>
                
                <button
                  onClick={this.handleReload}
                  className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200"
                >
                  <Home className="w-5 h-5" />
                  Reload Page
                </button>
              </div>

              {/* Support Information */}
              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Need Help?</h3>
                <p className="text-blue-700 text-sm">
                  If this error persists, please ensure:
                </p>
                <ul className="text-blue-700 text-sm text-left mt-2 space-y-1">
                  <li>• Your browser is up to date</li>
                  <li>• JavaScript is enabled</li>
                  <li>• The backend server is running on localhost:5000</li>
                  <li>• Your internet connection is stable</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}