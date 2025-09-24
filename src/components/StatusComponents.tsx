import React from 'react';
import { Loader2, AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { useLoadingAnimation } from '../hooks/useAnimations';

interface LoadingStateProps {
  message?: string;
  progress?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Analyzing lifecycle assessment...', 
  progress 
}) => {
  const loadingRef = useLoadingAnimation(true);

  return (
    <div ref={loadingRef} className="w-full max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 p-12">
        <div className="text-center">
          {/* Animated Loader */}
          <div className="relative mx-auto w-20 h-20 mb-8">
            <div className="absolute inset-0 border-4 border-slate-600 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-transparent border-t-blue-400 rounded-full animate-spin animation-delay-150"></div>
            <div className="absolute inset-4 border-4 border-transparent border-t-purple-400 rounded-full animate-spin animation-delay-300"></div>
          </div>

          {/* Loading Message */}
          <h3 className="text-2xl font-bold text-slate-100 mb-4">{message}</h3>
          
          {/* Progress Bar */}
          {progress !== undefined && (
            <div className="w-full bg-slate-700 rounded-full h-3 mb-6">
              <div 
                className="bg-gradient-to-r from-cyan-400 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
          )}

          {/* Loading Steps */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center justify-center gap-3 text-slate-300">
              <div className="loading-dot w-2 h-2 bg-cyan-400 rounded-full"></div>
              <span>Processing material data</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-slate-300">
              <div className="loading-dot w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Analyzing environmental impacts</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-slate-300">
              <div className="loading-dot w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Generating recommendations</span>
            </div>
          </div>

          {/* Time Estimate */}
          <p className="text-slate-400 text-sm">
            This usually takes 8-15 seconds. Please be patient while our AI processes your request.
          </p>
        </div>
      </div>
    </div>
  );
};

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
  onReset?: () => void;
  isRetrying?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  onRetry,
  onReset,
  isRetrying = false
}) => {
  const isNetworkError = error.toLowerCase().includes('network') || error.toLowerCase().includes('fetch');
  const isRateLimit = error.toLowerCase().includes('rate limit');

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-red-400/20 p-12">
        <div className="text-center">
          {/* Error Icon */}
          <div className="mx-auto w-20 h-20 mb-8 relative">
            <div className="absolute inset-0 bg-red-900/30 rounded-full flex items-center justify-center border border-red-400/30">
              {isNetworkError ? (
                <WifiOff className="w-10 h-10 text-red-400" />
              ) : (
                <AlertCircle className="w-10 h-10 text-red-400" />
              )}
            </div>
            {/* Pulse animation */}
            <div className="absolute inset-0 bg-red-400/20 rounded-full animate-ping opacity-30"></div>
          </div>

          {/* Error Title */}
          <h3 className="text-2xl font-bold text-slate-100 mb-4">
            {isRateLimit ? 'Rate Limit Exceeded' : 
             isNetworkError ? 'Connection Error' : 
             'Assessment Failed'}
          </h3>

          {/* Error Message */}
          <div className="bg-red-900/20 border border-red-400/30 rounded-lg p-4 mb-8">
            <p className="text-red-300">{error}</p>
          </div>

          {/* Suggested Actions */}
          <div className="text-left mb-8">
            <h4 className="font-semibold text-slate-200 mb-3">Suggested Actions:</h4>
            <ul className="space-y-2 text-slate-300">
              {isRateLimit ? (
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Wait 15 minutes before making another request</span>
                </li>
              ) : isNetworkError ? (
                <>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Check your internet connection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Ensure the backend server is running on localhost:5000</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Check your input data for any issues</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Try again with different parameters</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {onRetry && !isRateLimit && (
              <button
                onClick={onRetry}
                disabled={isRetrying}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isRetrying ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    Try Again
                  </>
                )}
              </button>
            )}
            
            {onReset && (
              <button
                onClick={onReset}
                className="flex-1 px-6 py-3 border border-slate-600 text-slate-300 rounded-lg font-semibold hover:bg-slate-800 hover:border-slate-500 transition-all duration-200"
              >
                Start Over
              </button>
            )}
          </div>

          {/* Server Status */}
          <div className="mt-8 pt-6 border-t border-slate-700">
            <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
              <Wifi className="w-4 h-4" />
              <span>Server: localhost:5000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Health check component
interface HealthCheckProps {
  onHealthCheck: () => void;
  isChecking: boolean;
  isHealthy: boolean | null;
}

export const HealthCheck: React.FC<HealthCheckProps> = ({
  onHealthCheck,
  isChecking,
  isHealthy
}) => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={onHealthCheck}
        disabled={isChecking}
        className={`p-3 rounded-full shadow-lg transition-all duration-200 ${
          isHealthy === null
            ? 'bg-gray-500 hover:bg-gray-600'
            : isHealthy
            ? 'bg-green-500 hover:bg-green-600'
            : 'bg-red-500 hover:bg-red-600'
        } text-white`}
        title={`Server status: ${
          isHealthy === null ? 'Unknown' : isHealthy ? 'Healthy' : 'Unhealthy'
        }`}
      >
        {isChecking ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Wifi className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};