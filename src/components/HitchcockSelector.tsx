'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Video, Check } from 'lucide-react';
import { HitchcockMode, HitchcockFlow, HitchcockParams } from '@/types';

interface HitchcockModeOption {
  mode: HitchcockMode;
  label: string;
  description: string;
  emoji: string;
}

const HITCHCOCK_MODES: HitchcockModeOption[] = [
  {
    mode: 0,
    label: 'Push Forward',
    description: 'Push forward shot with flow',
    emoji: '➡️',
  },
  {
    mode: 1,
    label: 'Wide-Angle',
    description: 'Wide-angle camera movement',
    emoji: '🎬',
  },
  {
    mode: 2,
    label: 'Hitchcock Zoom',
    description: 'Classic vertigo effect',
    emoji: '🌀',
  },
  {
    mode: 3,
    label: 'Swing',
    description: 'Swing camera movement',
    emoji: '↔️',
  },
  {
    mode: 4,
    label: 'Bounce',
    description: 'Bounce camera movement',
    emoji: '↕️',
  },
];

interface HitchcockSelectorProps {
  onSelect: (params: HitchcockParams) => void;
}

export default function HitchcockSelector({ onSelect }: HitchcockSelectorProps) {
  const [selectedMode, setSelectedMode] = useState<HitchcockMode>(2); // Default to Hitchcock
  const [longSide, setLongSide] = useState<number>(960);
  const [frameNum, setFrameNum] = useState<number>(90);
  const [fps, setFps] = useState<number>(30);
  const [useFlow, setUseFlow] = useState<HitchcockFlow>(-1);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleConfirm = useCallback(() => {
    onSelect({
      mode: selectedMode,
      longSide,
      frameNum,
      fps,
      useFlow,
    });
  }, [selectedMode, longSide, frameNum, fps, useFlow, onSelect]);

  const videoDuration = frameNum / fps;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center"
        >
          <Video className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900">Hitchcock Effects</h2>
        <p className="text-gray-600">
          Create cinematic camera effects
        </p>
      </div>

      {/* Camera Mode Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        <h3 className="text-sm font-semibold text-gray-700">Camera Movement</h3>
        <div className="grid grid-cols-1 gap-3">
          {HITCHCOCK_MODES.map((modeOption) => (
            <button
              key={modeOption.mode}
              onClick={() => setSelectedMode(modeOption.mode)}
              className={`p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${
                selectedMode === modeOption.mode
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300 bg-white'
              }`}
            >
              <div className="text-3xl">{modeOption.emoji}</div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{modeOption.label}</div>
                <div className="text-xs text-gray-500">{modeOption.description}</div>
              </div>
              {selectedMode === modeOption.mode && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-white" />
                </motion.div>
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Basic Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-4 border border-purple-100"
      >
        <h3 className="text-sm font-semibold text-gray-700">Video Settings</h3>
        
        {/* Resolution */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">Resolution (Long Side)</label>
            <span className="text-sm font-semibold text-purple-600">{longSide}px</span>
          </div>
          <input
            type="range"
            min="480"
            max="1920"
            step="120"
            value={longSide}
            onChange={(e) => setLongSide(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>480px (Fast)</span>
            <span>1920px (High Quality)</span>
          </div>
        </div>

        {/* Duration Info */}
        <div className="bg-white rounded-xl p-3 border border-purple-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Video Duration</span>
            <span className="text-lg font-bold text-purple-600">{videoDuration.toFixed(1)}s</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {frameNum} frames @ {fps} fps
          </div>
        </div>
      </motion.div>

      {/* Advanced Settings Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-sm font-medium text-gray-700"
        >
          {showAdvanced ? '▼' : '▶'} Advanced Settings
        </button>

        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 space-y-4 bg-white rounded-2xl p-4 border border-gray-200"
          >
            {/* Frame Count */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">Frame Count</label>
                <span className="text-sm font-semibold text-purple-600">{frameNum}</span>
              </div>
              <input
                type="range"
                min="30"
                max="180"
                step="15"
                value={frameNum}
                onChange={(e) => setFrameNum(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>30 (1s)</span>
                <span>180 (6s)</span>
              </div>
            </div>

            {/* FPS */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">Frame Rate (FPS)</label>
                <span className="text-sm font-semibold text-purple-600">{fps}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[24, 30, 60].map((fpsOption) => (
                  <button
                    key={fpsOption}
                    onClick={() => setFps(fpsOption)}
                    className={`p-2 rounded-lg border-2 transition-all text-sm font-medium ${
                      fps === fpsOption
                        ? 'border-purple-500 bg-purple-50 text-purple-600'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-purple-300'
                    }`}
                  >
                    {fpsOption} fps
                  </button>
                ))}
              </div>
            </div>

            {/* Flow Effect */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Flow Effect</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setUseFlow(-1)}
                  className={`p-2 rounded-lg border-2 transition-all text-xs font-medium ${
                    useFlow === -1
                      ? 'border-purple-500 bg-purple-50 text-purple-600'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-purple-300'
                  }`}
                >
                  Auto
                </button>
                <button
                  onClick={() => setUseFlow(0)}
                  className={`p-2 rounded-lg border-2 transition-all text-xs font-medium ${
                    useFlow === 0
                      ? 'border-purple-500 bg-purple-50 text-purple-600'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-purple-300'
                  }`}
                >
                  Disabled
                </button>
                <button
                  onClick={() => setUseFlow(1)}
                  className={`p-2 rounded-lg border-2 transition-all text-xs font-medium ${
                    useFlow === 1
                      ? 'border-purple-500 bg-purple-50 text-purple-600'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-purple-300'
                  }`}
                >
                  Enabled
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Flow effect adds 20-30% processing time
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Summary & Confirm */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-3"
      >
        <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl p-4 border border-purple-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">📊 Summary</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-gray-600">Effect:</div>
            <div className="font-semibold text-gray-900">
              {HITCHCOCK_MODES.find(m => m.mode === selectedMode)?.label}
            </div>
            <div className="text-gray-600">Resolution:</div>
            <div className="font-semibold text-gray-900">{longSide}px</div>
            <div className="text-gray-600">Duration:</div>
            <div className="font-semibold text-gray-900">{videoDuration.toFixed(1)}s</div>
            <div className="text-gray-600">Quality:</div>
            <div className="font-semibold text-gray-900">{fps} fps</div>
          </div>
        </div>

        <button
          onClick={handleConfirm}
          className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all font-medium shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2"
        >
          <span>Create Video Effect</span>
          <Video className="w-5 h-5" />
        </button>

        <p className="text-xs text-center text-gray-500">
          ⚠️ Processing may take 1-3 minutes depending on settings
        </p>
      </motion.div>
    </div>
  );
}
