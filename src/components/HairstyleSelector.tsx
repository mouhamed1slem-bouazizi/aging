'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Scissors, User, Users as UsersIcon, Palette } from 'lucide-react';
import { HairGender, HairStyle, HairColor, HairstyleParams } from '@/types';

interface HairstyleSelectorProps {
  onHairstyleSelect: (params: HairstyleParams) => void;
  disabled?: boolean;
}

interface HairstyleOption {
  code: string;
  name: string;
  category: string;
}

const maleHairstyles: HairstyleOption[] = [
  { code: 'BuzzCut', name: 'Buzz Cut', category: 'Short' },
  { code: 'UnderCut', name: 'Undercut', category: 'Short' },
  { code: 'Pompadour', name: 'Pompadour', category: 'Medium' },
  { code: 'SlickBack', name: 'Slick Back', category: 'Medium' },
  { code: 'ManBun', name: 'Man Bun', category: 'Long' },
  { code: 'Afro', name: 'Afro', category: 'Curly' },
  { code: 'CrewCut', name: 'Crew Cut', category: 'Short' },
  { code: 'FauxHawk', name: 'Faux Hawk', category: 'Short' },
  { code: 'SideSwept', name: 'Side Swept', category: 'Medium' },
  { code: 'Quiff', name: 'Quiff', category: 'Medium' },
  { code: 'CombOver', name: 'Comb Over', category: 'Medium' },
  { code: 'SpikeyHair', name: 'Spikey Hair', category: 'Short' },
  { code: 'FrenchCrop', name: 'French Crop', category: 'Short' },
  { code: 'TexturedCrop', name: 'Textured Crop', category: 'Short' },
  { code: 'MessyHair', name: 'Messy Hair', category: 'Medium' },
  { code: 'CurlyTop', name: 'Curly Top', category: 'Curly' },
  { code: 'FlowHair', name: 'Flow Hair', category: 'Long' },
  { code: 'LongHair', name: 'Long Hair', category: 'Long' },
  { code: 'Dreadlocks', name: 'Dreadlocks', category: 'Long' },
  { code: 'Cornrows', name: 'Cornrows', category: 'Braids' },
  { code: 'FlatTop', name: 'Flat Top', category: 'Short' },
  { code: 'HighAndTight', name: 'High and Tight', category: 'Short' },
  { code: 'IvyLeague', name: 'Ivy League', category: 'Short' },
  { code: 'BrushUp', name: 'Brush Up', category: 'Medium' },
  { code: 'AngularFringe', name: 'Angular Fringe', category: 'Medium' },
  { code: 'ClassicTaper', name: 'Classic Taper', category: 'Short' },
  { code: 'MohawkFade', name: 'Mohawk Fade', category: 'Short' },
  { code: 'WavyHair', name: 'Wavy Hair', category: 'Medium' },
  { code: 'ShoulderLength', name: 'Shoulder Length', category: 'Long' },
  { code: 'MiddlePart', name: 'Middle Part', category: 'Medium' },
  { code: 'SidePart', name: 'Side Part', category: 'Medium' },
  { code: 'Shaggy', name: 'Shaggy', category: 'Medium' },
  { code: 'BusinessCut', name: 'Business Cut', category: 'Short' },
  { code: 'SurferHair', name: 'Surfer Hair', category: 'Medium' },
  { code: 'ModernMullet', name: 'Modern Mullet', category: 'Long' },
];

const femaleHairstyles: HairstyleOption[] = [
  { code: 'PixieCut', name: 'Pixie Cut', category: 'Short' },
  { code: 'BobCut', name: 'Bob Cut', category: 'Short' },
  { code: 'LongCurly', name: 'Long Curly', category: 'Long' },
  { code: 'Ponytail', name: 'Ponytail', category: 'Long' },
  { code: 'BoxBraids', name: 'Box Braids', category: 'Braids' },
  { code: 'BeachWaves', name: 'Beach Waves', category: 'Medium' },
  { code: 'StraightHair', name: 'Straight Hair', category: 'Long' },
  { code: 'Bangs', name: 'Bangs', category: 'Medium' },
  { code: 'Updo', name: 'Updo', category: 'Formal' },
  { code: 'Chignon', name: 'Chignon', category: 'Formal' },
  { code: 'FrenchBraid', name: 'French Braid', category: 'Braids' },
  { code: 'FishTailBraid', name: 'Fishtail Braid', category: 'Braids' },
  { code: 'MessyBun', name: 'Messy Bun', category: 'Casual' },
  { code: 'TopKnot', name: 'Top Knot', category: 'Casual' },
  { code: 'HalfUpHalfDown', name: 'Half Up Half Down', category: 'Medium' },
  { code: 'LayeredCut', name: 'Layered Cut', category: 'Medium' },
  { code: 'Shag', name: 'Shag', category: 'Medium' },
  { code: 'Lob', name: 'Lob (Long Bob)', category: 'Medium' },
  { code: 'BluntCut', name: 'Blunt Cut', category: 'Medium' },
  { code: 'VCut', name: 'V-Cut', category: 'Long' },
  { code: 'UCut', name: 'U-Cut', category: 'Long' },
  { code: 'FeatheredHair', name: 'Feathered Hair', category: 'Medium' },
  { code: 'VintageWaves', name: 'Vintage Waves', category: 'Medium' },
  { code: 'SideSweptBangs', name: 'Side Swept Bangs', category: 'Medium' },
  { code: 'BluntBangs', name: 'Blunt Bangs', category: 'Medium' },
  { code: 'CurtainBangs', name: 'Curtain Bangs', category: 'Medium' },
  { code: 'SpaceNuns', name: 'Space Buns', category: 'Casual' },
  { code: 'DutchBraids', name: 'Dutch Braids', category: 'Braids' },
  { code: 'Cornrows', name: 'Cornrows', category: 'Braids' },
  { code: 'Twists', name: 'Twists', category: 'Braids' },
  { code: 'AfroHair', name: 'Afro Hair', category: 'Curly' },
  { code: 'BigCurls', name: 'Big Curls', category: 'Curly' },
  { code: 'LooseCurls', name: 'Loose Curls', category: 'Curly' },
  { code: 'TightCurls', name: 'Tight Curls', category: 'Curly' },
  { code: 'SpiralCurls', name: 'Spiral Curls', category: 'Curly' },
  { code: 'WaterWave', name: 'Water Wave', category: 'Curly' },
  { code: 'DeepWave', name: 'Deep Wave', category: 'Curly' },
  { code: 'BodyWave', name: 'Body Wave', category: 'Medium' },
  { code: 'SleekPonytail', name: 'Sleek Ponytail', category: 'Long' },
  { code: 'HighPonytail', name: 'High Ponytail', category: 'Long' },
  { code: 'LowPonytail', name: 'Low Ponytail', category: 'Long' },
  { code: 'BubblePonytail', name: 'Bubble Ponytail', category: 'Long' },
  { code: 'BraidedPonytail', name: 'Braided Ponytail', category: 'Braids' },
  { code: 'CrownBraid', name: 'Crown Braid', category: 'Braids' },
  { code: 'WaterfallBraid', name: 'Waterfall Braid', category: 'Braids' },
  { code: 'PullThroughBraid', name: 'Pull Through Braid', category: 'Braids' },
  { code: 'VoluminousHair', name: 'Voluminous Hair', category: 'Long' },
  { code: 'SleekStraight', name: 'Sleek Straight', category: 'Long' },
  { code: 'TousledWaves', name: 'Tousled Waves', category: 'Medium' },
  { code: 'GlossyHair', name: 'Glossy Hair', category: 'Long' },
  { code: 'Bouffant', name: 'Bouffant', category: 'Formal' },
  { code: 'FlippedEnds', name: 'Flipped Ends', category: 'Medium' },
  { code: 'AsymmetricalBob', name: 'Asymmetrical Bob', category: 'Short' },
  { code: 'InvertedBob', name: 'Inverted Bob', category: 'Short' },
  { code: 'ALineBob', name: 'A-Line Bob', category: 'Short' },
  { code: 'BuzzCutFemale', name: 'Buzz Cut', category: 'Short' },
  { code: 'ShortShag', name: 'Short Shag', category: 'Short' },
  { code: 'LongShag', name: 'Long Shag', category: 'Long' },
  { code: 'MiddlePart', name: 'Middle Part', category: 'Medium' },
  { code: 'SidePart', name: 'Side Part', category: 'Medium' },
  { code: 'RetroWaves', name: 'Retro Waves', category: 'Medium' },
  { code: 'GlamourWaves', name: 'Glamour Waves', category: 'Long' },
];

const hairColors: { code: HairColor; name: string; color: string }[] = [
  { code: 'blonde', name: 'Blonde', color: '#F5DEB3' },
  { code: 'platinumBlonde', name: 'Platinum Blonde', color: '#E5E4E2' },
  { code: 'brown', name: 'Brown', color: '#8B4513' },
  { code: 'lightBrown', name: 'Light Brown', color: '#CD853F' },
  { code: 'blue', name: 'Blue', color: '#0000FF' },
  { code: 'lightBlue', name: 'Light Blue', color: '#87CEEB' },
  { code: 'purple', name: 'Purple', color: '#800080' },
  { code: 'lightPurple', name: 'Light Purple', color: '#DDA0DD' },
  { code: 'pink', name: 'Pink', color: '#FFC0CB' },
  { code: 'black', name: 'Black', color: '#000000' },
  { code: 'white', name: 'White', color: '#FFFFFF' },
  { code: 'grey', name: 'Grey', color: '#808080' },
  { code: 'silver', name: 'Silver', color: '#C0C0C0' },
  { code: 'red', name: 'Red', color: '#FF0000' },
  { code: 'orange', name: 'Orange', color: '#FFA500' },
  { code: 'green', name: 'Green', color: '#008000' },
  { code: 'gradient', name: 'Gradient', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { code: 'multicolored', name: 'Multicolored', color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { code: 'darkBlue', name: 'Dark Blue', color: '#00008B' },
  { code: 'burgundy', name: 'Burgundy', color: '#800020' },
  { code: 'darkGreen', name: 'Dark Green', color: '#006400' },
];

export default function HairstyleSelector({
  onHairstyleSelect,
  disabled = false,
}: HairstyleSelectorProps) {
  const [selectedGender, setSelectedGender] = useState<HairGender>('female');
  const [selectedHairStyle, setSelectedHairStyle] = useState<HairStyle | null>(null);
  const [selectedColor, setSelectedColor] = useState<HairColor | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const hairstyles = selectedGender === 'male' ? maleHairstyles : femaleHairstyles;
  
  const categories = ['All', ...Array.from(new Set(hairstyles.map(h => h.category)))];
  
  const filteredHairstyles = selectedCategory === 'All' 
    ? hairstyles 
    : hairstyles.filter(h => h.category === selectedCategory);

  const handleApply = () => {
    if (!selectedHairStyle) return;
    
    const params: HairstyleParams = {
      gender: selectedGender,
      hairStyle: selectedHairStyle,
      ...(selectedColor && { color: selectedColor }),
    };
    
    onHairstyleSelect(params);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Scissors className="w-8 h-8 text-purple-500" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Choose Your Hairstyle
          </h2>
        </div>
        <p className="text-gray-600">
          Select gender, pick a hairstyle, and optionally choose a hair color
        </p>
      </motion.div>

      {/* Gender Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center gap-4"
      >
        <button
          onClick={() => {
            setSelectedGender('male');
            setSelectedHairStyle(null);
            setSelectedCategory('All');
          }}
          disabled={disabled}
          className={`flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all ${
            selectedGender === 'male'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <User className="w-5 h-5" />
          Male
        </button>
        <button
          onClick={() => {
            setSelectedGender('female');
            setSelectedHairStyle(null);
            setSelectedCategory('All');
          }}
          disabled={disabled}
          className={`flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all ${
            selectedGender === 'female'
              ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg scale-105'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <UsersIcon className="w-5 h-5" />
          Female
        </button>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap justify-center gap-2"
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            disabled={disabled}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === category
                ? 'bg-purple-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {category}
          </button>
        ))}
      </motion.div>

      {/* Hairstyle Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-xl"
      >
        {filteredHairstyles.map((style) => (
          <motion.button
            key={style.code}
            onClick={() => setSelectedHairStyle(style.code)}
            disabled={disabled}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-4 rounded-xl text-center transition-all ${
              selectedHairStyle === style.code
                ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg ring-4 ring-purple-300'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <Scissors className={`w-6 h-6 mx-auto mb-2 ${
              selectedHairStyle === style.code ? 'text-white' : 'text-purple-500'
            }`} />
            <div className="text-sm font-semibold">{style.name}</div>
            <div className={`text-xs mt-1 ${
              selectedHairStyle === style.code ? 'text-purple-100' : 'text-gray-500'
            }`}>
              {style.category}
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Color Selection (Optional) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-3"
      >
        <div className="flex items-center justify-center gap-2">
          <Palette className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg font-semibold text-gray-800">Hair Color (Optional)</h3>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-2 max-h-48 overflow-y-auto p-4 bg-gray-50 rounded-xl">
          {hairColors.map((color) => (
            <motion.button
              key={color.code}
              onClick={() => setSelectedColor(selectedColor === color.code ? null : color.code)}
              disabled={disabled}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`relative p-3 rounded-lg transition-all ${
                selectedColor === color.code
                  ? 'ring-4 ring-purple-500 shadow-lg'
                  : 'ring-2 ring-gray-200 hover:ring-gray-300'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div
                className="w-full h-12 rounded-md mb-1"
                style={{
                  background: color.color.includes('gradient') ? color.color : color.color,
                  border: color.code === 'white' ? '1px solid #ddd' : 'none',
                }}
              />
              <div className="text-xs text-center font-medium text-gray-700">{color.name}</div>
            </motion.button>
          ))}
        </div>
        {selectedColor && (
          <div className="text-center text-sm text-gray-600">
            Selected: <span className="font-semibold">{hairColors.find(c => c.code === selectedColor)?.name}</span>
          </div>
        )}
      </motion.div>

      {/* Apply Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center"
      >
        <button
          onClick={handleApply}
          disabled={disabled || !selectedHairStyle}
          className={`px-12 py-4 rounded-xl font-bold text-lg transition-all ${
            disabled || !selectedHairStyle
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-xl hover:scale-105'
          }`}
        >
          {disabled ? 'Processing...' : 'Apply Hairstyle'}
        </button>
      </motion.div>

      {/* Selection Summary */}
      {selectedHairStyle && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center p-4 bg-purple-50 rounded-xl"
        >
          <div className="text-sm text-gray-600">
            Selected: <span className="font-semibold text-purple-700">
              {hairstyles.find(h => h.code === selectedHairStyle)?.name}
            </span>
            {selectedColor && (
              <> with <span className="font-semibold text-purple-700">
                {hairColors.find(c => c.code === selectedColor)?.name}
              </span> color</>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
