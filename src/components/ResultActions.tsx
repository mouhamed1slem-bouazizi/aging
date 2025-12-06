'use client';

import { useState } from 'react';
import { Download, Share2, RotateCcw, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { downloadImage, shareImage } from '@/lib/utils';

interface ResultActionsProps {
  transformedImage: string;
  onStartOver: () => void;
  onTryAnother: () => void;
}

export default function ResultActions({
  transformedImage,
  onStartOver,
  onTryAnother,
}: ResultActionsProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState<boolean | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const timestamp = new Date().toISOString().slice(0, 10);
      downloadImage(transformedImage, `agefx-transformation-${timestamp}.png`);
    } finally {
      setTimeout(() => setIsDownloading(false), 1000);
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    setShareSuccess(null);
    try {
      const success = await shareImage(transformedImage, 'My AgeFX Transformation');
      setShareSuccess(success);
      if (!success) {
        // Fallback: copy to clipboard or show message
        try {
          await navigator.clipboard.writeText(window.location.href);
          setShareSuccess(true);
        } catch {
          setShareSuccess(false);
        }
      }
    } finally {
      setIsSharing(false);
      setTimeout(() => setShareSuccess(null), 3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-xl mx-auto space-y-4"
    >
      {/* Primary Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex-1 py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-2xl hover:shadow-lg hover:shadow-purple-300 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {isDownloading ? (
            <>
              <Check className="w-5 h-5" />
              Downloaded!
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              Download Image
            </>
          )}
        </button>

        <button
          onClick={handleShare}
          disabled={isSharing}
          className="flex-1 py-4 px-6 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-2xl hover:border-purple-300 hover:bg-purple-50 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {isSharing ? (
            <div className="w-5 h-5 border-2 border-gray-300 border-t-purple-600 rounded-full animate-spin" />
          ) : (
            <Share2 className="w-5 h-5" />
          )}
          Share
        </button>
      </div>

      {/* Share feedback */}
      <AnimatePresence>
        {shareSuccess !== null && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl ${
              shareSuccess
                ? 'bg-green-50 text-green-700'
                : 'bg-yellow-50 text-yellow-700'
            }`}
          >
            {shareSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span className="text-sm">Shared successfully!</span>
              </>
            ) : (
              <>
                <X className="w-4 h-4" />
                <span className="text-sm">Sharing not available. Try downloading instead.</span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Secondary Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={onTryAnother}
          className="flex-1 py-3 px-6 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Try Another Age
        </button>

        <button
          onClick={onStartOver}
          className="flex-1 py-3 px-6 text-gray-500 font-medium rounded-xl hover:bg-gray-100 transition-colors"
        >
          Start Over with New Photo
        </button>
      </div>
    </motion.div>
  );
}
