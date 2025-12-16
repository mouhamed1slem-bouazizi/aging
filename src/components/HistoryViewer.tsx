'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Trash2, Clock, X } from 'lucide-react';
import { TransformationHistory, getHistory, deleteFromHistory, clearAllHistory } from '@/lib/history';

interface HistoryViewerProps {
  onClose: () => void;
  onSelectImage?: (original: string, transformed: string) => void;
}

export default function HistoryViewer({ onClose, onSelectImage }: HistoryViewerProps) {
  const [history, setHistory] = useState<TransformationHistory[]>([]);
  const [selectedItem, setSelectedItem] = useState<TransformationHistory | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const items = getHistory();
    setHistory(items);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (confirm('Delete this transformation from history?')) {
      await deleteFromHistory(id);
      loadHistory();
      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
    }
  };

  const handleClearAll = async () => {
    if (confirm('Clear all transformation history? This cannot be undone.')) {
      await clearAllHistory();
      loadHistory();
      setSelectedItem(null);
    }
  };

  const handleDownload = (item: TransformationHistory) => {
    const link = document.createElement('a');
    link.href = item.transformedImage;
    link.download = `${item.transformationType}_${new Date(item.timestamp).toISOString()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = Date.now();
    const diff = now - timestamp;
    
    // Less than 1 hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    }
    
    // Less than 24 hours
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }
    
    // Less than 7 days
    if (diff < 604800000) {
      const days = Math.floor(diff / 86400000);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
    
    return date.toLocaleDateString();
  };

  const getFeatureName = (type: string): string => {
    const names: Record<string, string> = {
      'age': 'Age Transform',
      'gender': 'Gender Swap',
      'filter': 'Face Filter',
      'lip-color': 'Lip Color',
      'face-beauty': 'Face Beauty',
      'face-slimming': 'Face Slimming',
      'skin-beauty': 'Skin Beauty',
      'face-fusion': 'Face Fusion',
      'smart-beauty': 'Smart Beauty',
      'hairstyle': 'Hairstyle',
      'expression': 'Expression',
      'cartoon': 'Cartoon',
      'hitchcock': 'Hitchcock Effects',
      'try-on-clothes': 'Try On Clothes',
    };
    return names[type] || type;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Clock className="w-6 h-6" />
                Transformation History
              </h2>
              <p className="text-white/80 text-sm mt-1">
                {history.length} transformation{history.length !== 1 ? 's' : ''} saved
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row h-[calc(90vh-120px)]">
          {/* History List */}
          <div className="w-full md:w-1/3 border-r border-gray-200 overflow-y-auto p-4">
            {history.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No transformations yet</p>
                <p className="text-sm mt-2">Your transformation history will appear here</p>
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((item) => (
                  <motion.button
                    key={item.id}
                    layout
                    onClick={() => setSelectedItem(item)}
                    className={`w-full p-3 rounded-xl text-left transition-all ${
                      selectedItem?.id === item.id
                        ? 'bg-purple-100 border-2 border-purple-500'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.transformedImage}
                        alt="Thumbnail"
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900 truncate">
                          {getFeatureName(item.transformationType)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(item.timestamp)}
                        </p>
                        {item.firebaseUrl && (
                          <span className="inline-block mt-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                            Backed up
                          </span>
                        )}
                      </div>
                      <button
                        onClick={(e) => handleDelete(item.id, e)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="flex-1 p-6 overflow-y-auto">
            {selectedItem ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {getFeatureName(selectedItem.transformationType)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Created {formatDate(selectedItem.timestamp)}
                  </p>
                </div>

                {/* Before/After Comparison */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Original</p>
                    <img
                      src={selectedItem.originalImage}
                      alt="Original"
                      className="w-full rounded-xl border-2 border-gray-200"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Transformed</p>
                    <img
                      src={selectedItem.transformedImage}
                      alt="Transformed"
                      className="w-full rounded-xl border-2 border-purple-200"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleDownload(selectedItem)}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all font-medium flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download
                  </button>
                  {onSelectImage && (
                    <button
                      onClick={() => {
                        onSelectImage(selectedItem.originalImage, selectedItem.transformedImage);
                        onClose();
                      }}
                      className="flex-1 px-4 py-3 bg-white border-2 border-purple-500 text-purple-600 rounded-xl hover:bg-purple-50 transition-all font-medium"
                    >
                      Use Again
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <Clock className="w-20 h-20 mx-auto mb-4 opacity-30" />
                  <p className="text-lg">Select an item to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <button
              onClick={handleClearAll}
              className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear All History
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
