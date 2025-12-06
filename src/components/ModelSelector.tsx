'use client';

import { AIModel } from '@/types';
import { AI_MODELS } from '@/lib/constants';
import { CheckCircle2, Sparkles, Zap } from 'lucide-react';

interface ModelSelectorProps {
  onSelect: (model: AIModel) => void;
}

export default function ModelSelector({ onSelect }: ModelSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose AI Model</h2>
        <p className="text-gray-600">Select the AI model for image transformation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {AI_MODELS.map((model) => (
          <button
            key={model.id}
            onClick={() => onSelect(model.id)}
            className={`relative p-6 rounded-2xl border-2 transition-all hover:scale-105 hover:shadow-lg ${
              model.isFree
                ? 'border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 hover:border-green-500'
                : 'border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 hover:border-purple-400'
            }`}
          >
            {model.isFree && (
              <div className="absolute -top-3 -right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                FREE
              </div>
            )}

            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${
                model.isFree ? 'bg-green-100' : 'bg-purple-100'
              }`}>
                {model.isFree ? (
                  <Zap className="w-6 h-6 text-green-600" />
                ) : (
                  <Sparkles className="w-6 h-6 text-purple-600" />
                )}
              </div>

              <div className="flex-1 text-left">
                <h3 className="font-bold text-lg text-gray-900 mb-1">
                  {model.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {model.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="px-2 py-1 bg-white rounded-full">
                    {model.provider}
                  </span>
                  {!model.requiresApiKey && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      No API Key Required
                    </span>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-500">
          💡 Tip: Start with <span className="font-semibold text-green-600">Pollinations.AI</span> (free) to test the app!
        </p>
      </div>
    </div>
  );
}
