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
  { code: 'FauxHawk', name: 'Faux Hawk', category: 'Short' },
  { code: 'Spiky', name: 'Spiky', category: 'Short' },
  { code: 'CombOver', name: 'Comb Over', category: 'Medium' },
  { code: 'HighTightFade', name: 'High and Tight Fade', category: 'Short' },
  { code: 'CurlyShag', name: 'Curly Shag', category: 'Curly' },
  { code: 'WavyShag', name: 'Wavy Shag', category: 'Medium' },
  { code: 'LowFade', name: 'Low Fade', category: 'Short' },
  { code: 'UndercutLongHair', name: 'Undercut With Long Hair', category: 'Long' },
  { code: 'TwoBlockHaircut', name: 'Two Block Haircut', category: 'Medium' },
  { code: 'TexturedFringe', name: 'Textured Fringe', category: 'Short' },
  { code: 'BluntBowlCut', name: 'Blunt Bowl Cut', category: 'Short' },
  { code: 'LongWavyCurtainBangs', name: 'Long Wavy Curtain Bangs', category: 'Long' },
  { code: 'MessyTousled', name: 'Messy Tousled', category: 'Medium' },
  { code: 'CornrowBraids', name: 'Cornrow Braids', category: 'Braids' },
  { code: 'LongHairTiedUp', name: 'Long Hair Tied Up', category: 'Long' },
  { code: 'Middle-parted', name: 'Middle Parted', category: 'Medium' },
  { code: 'ManGreased', name: 'Man Greased Slick-back', category: 'Medium' },
  { code: 'WavyMiddlePart', name: 'Wavy Middle Part', category: 'Medium' },
  { code: 'Natural_Side-Part', name: 'Natural Side-Part', category: 'Medium' },
  { code: 'Wolf_Crop', name: 'Wolf Crop', category: 'Short' },
  { code: 'Wind-Tousled_Crop', name: 'Wind-Tousled Crop', category: 'Short' },
  { code: 'Side-Parted_Textured', name: 'Side-Parted Textured', category: 'Short' },
  { code: 'FluffyMiddlePart', name: 'Fluffy Middle-Part', category: 'Medium' },
  { code: 'FreshSide-Parted', name: 'Fresh Side-Parted', category: 'Medium' },
  { code: 'Smooth_Crop', name: 'Smooth Crop', category: 'Short' },
  { code: 'Korean_Wavy_Crop', name: 'Korean Wavy Crop', category: 'Short' },
  { code: 'Comma_Hair', name: 'Comma Hair', category: 'Medium' },
  { code: 'Side-Part_Crop', name: 'Side-Part Crop', category: 'Short' },
  { code: 'Natural_Middle_Part', name: 'Natural Middle Part', category: 'Medium' },
];

const femaleHairstyles: HairstyleOption[] = [
  { code: 'ShortPixieWithShavedSides', name: 'Short Pixie With Shaved Sides', category: 'Short' },
  { code: 'ShortNeatBob', name: 'Short Neat Bob', category: 'Short' },
  { code: 'DoubleBun', name: 'Double Bun', category: 'Casual' },
  { code: 'Updo', name: 'Updo', category: 'Formal' },
  { code: 'Spiked', name: 'Spiked', category: 'Short' },
  { code: 'bowlCut', name: 'Bowl Cut', category: 'Short' },
  { code: 'Chignon', name: 'Chignon', category: 'Formal' },
  { code: 'PixieCut', name: 'Pixie Cut', category: 'Short' },
  { code: 'SlickedBack', name: 'Slicked Back', category: 'Medium' },
  { code: 'LongCurly', name: 'Long Curly', category: 'Long' },
  { code: 'CurlyBob', name: 'Curly Bob', category: 'Short' },
  { code: 'StackedCurlsInShortBob', name: 'Stacked Curls in Short Bob', category: 'Short' },
  { code: 'SidePartCombOverHairstyleWithHighFade', name: 'Side Part Comb-Over With High Fade', category: 'Short' },
  { code: 'WavyFrenchBobVibesfrom1920', name: 'Wavy French Bob from 1920', category: 'Short' },
  { code: 'BobCut', name: 'Bob Cut', category: 'Short' },
  { code: 'ShortTwintails', name: 'Short Twintails', category: 'Casual' },
  { code: 'ShortCurlyPixie', name: 'Short Curly Pixie', category: 'Short' },
  { code: 'LongStraight', name: 'Long Straight', category: 'Long' },
  { code: 'LongWavy', name: 'Long Wavy', category: 'Long' },
  { code: 'FishtailBraid', name: 'Fishtail Braid', category: 'Braids' },
  { code: 'TwinBraids', name: 'Twin Braids', category: 'Braids' },
  { code: 'Ponytail', name: 'Ponytail', category: 'Long' },
  { code: 'Dreadlocks', name: 'Dreadlocks', category: 'Long' },
  { code: 'Cornrows', name: 'Cornrows', category: 'Braids' },
  { code: 'ShoulderLengthHair', name: 'Shoulder Length', category: 'Medium' },
  { code: 'LooseCurlyAfro', name: 'Loose Curly Afro', category: 'Curly' },
  { code: 'LongTwintails', name: 'Long Twintails', category: 'Long' },
  { code: 'LongHimeCut', name: 'Long Hime Cut', category: 'Long' },
  { code: 'BoxBraids', name: 'Box Braids', category: 'Braids' },
  { code: 'Layered_Waves', name: 'Layered Waves', category: 'Medium' },
  { code: 'Side_Flip_Perm', name: 'Side Flip Perm', category: 'Medium' },
  { code: 'Textured_Crop', name: 'Textured Crop', category: 'Short' },
  { code: 'Mushroom_Curl', name: 'Mushroom Curl', category: 'Short' },
  { code: 'Vintage_Curls', name: 'Vintage Curls', category: 'Short' },
  { code: 'Magic_Perm', name: 'Magic Perm', category: 'Medium' },
  { code: 'Side-Parted_Waves', name: 'Side-Parted Waves', category: 'Medium' },
  { code: 'Fluffy_Short', name: 'Fluffy Short', category: 'Short' },
  { code: 'Smooth_Inward_Bob', name: 'Smooth Inward Bob', category: 'Short' },
  { code: 'Neat_Short', name: 'Neat Short', category: 'Short' },
  { code: 'Natural_Short', name: 'Natural Short', category: 'Short' },
  { code: 'Chic_Tapered_Bob', name: 'Chic Tapered Bob', category: 'Short' },
  { code: 'Edgy_Textured_Pixie', name: 'Edgy Textured Pixie', category: 'Short' },
  { code: 'Elegant_Wavy_Crop', name: 'Elegant Wavy Crop', category: 'Short' },
  { code: 'Chic_Wavy_Pixie', name: 'Chic Wavy Pixie', category: 'Short' },
  { code: 'Elegant_Side_Wave', name: 'Elegant Side Wave', category: 'Medium' },
  { code: 'Soft_Layered_Curl', name: 'Soft Layered Curl', category: 'Medium' },
  { code: 'Executive_Pixie', name: 'Executive Pixie', category: 'Short' },
  { code: 'Curved_Chic_Bob', name: 'Curved Chic Bob', category: 'Short' },
  { code: 'Airy_Short_Curls', name: 'Airy Short Curls', category: 'Short' },
  { code: 'Playful_Curly_Bob', name: 'Playful Curly Bob', category: 'Short' },
  { code: 'Playful_Wavy_Bob', name: 'Playful Wavy Bob', category: 'Short' },
  { code: 'Elegant_Soft_Curl', name: 'Elegant Soft Curl', category: 'Medium' },
  { code: 'Elegant_Smooth_Bob', name: 'Elegant Smooth Bob', category: 'Short' },
  { code: 'Retro_Airy_Curl', name: 'Retro Airy Curl', category: 'Medium' },
  { code: 'Soft_Wavy_Bob', name: 'Soft Wavy Bob', category: 'Short' },
  { code: 'Light_Inward_Bob', name: 'Light Inward Bob', category: 'Short' },
  { code: 'Neat_Curly_Crop_Cut', name: 'Neat Curly Crop Cut', category: 'Short' },
  { code: 'Elegant_Volumized_Bob', name: 'Elegant Volumized Bob', category: 'Short' },
  { code: 'Modern_Curls_Chic', name: 'Modern Curls Chic', category: 'Medium' },
  { code: 'Mocha_Volume_Pixie', name: 'Mocha Volume Pixie', category: 'Short' },
  { code: 'Elegant_Side_Flow', name: 'Elegant Side Flow', category: 'Short' },
  { code: 'MediumLengthWavy', name: 'Medium Length Wavy', category: 'Medium' },
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
