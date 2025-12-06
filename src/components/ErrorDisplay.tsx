'use client';

import { AlertTriangle, RefreshCcw, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
  onGoBack?: () => void;
}

export default function ErrorDisplay({ message, onRetry, onGoBack }: ErrorDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto text-center py-12 px-4"
    >
      {/* Error Icon */}
      <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
        <AlertTriangle className="w-10 h-10 text-red-500" />
      </div>

      {/* Error Message */}
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Oops! Something went wrong
      </h2>
      <p className="text-gray-500 mb-8">
        {message || 'An unexpected error occurred. Please try again.'}
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {onRetry && (
          <button
            onClick={onRetry}
            className="py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            Try Again
          </button>
        )}

        {onGoBack && (
          <button
            onClick={onGoBack}
            className="py-3 px-6 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        )}
      </div>

      {/* Help Text */}
      <p className="text-sm text-gray-400 mt-8">
        If the problem persists, try using a different image or refreshing the page.
      </p>
    </motion.div>
  );
}
