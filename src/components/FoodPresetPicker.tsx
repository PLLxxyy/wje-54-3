import { foodPresets, categoryNames, findPresetByName } from '@/utils/foodPresets';
import { FoodPreset } from '@/types';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FoodPresetPickerProps {
  onSelect: (preset: FoodPreset) => void;
  selectedName?: string;
}

export default function FoodPresetPicker({ onSelect, selectedName }: FoodPresetPickerProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('vegetables');
  const [searchTerm, setSearchTerm] = useState('');

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const filteredPresets = (presets: FoodPreset[]) => {
    if (!searchTerm) return presets;
    return presets.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleQuickSearch = () => {
    if (searchTerm) {
      const preset = findPresetByName(searchTerm);
      if (preset) {
        onSelect(preset);
      }
    }
  };

  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        🥗 常见食材快捷选择
      </label>

      <div className="relative mb-3">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleQuickSearch()}
          placeholder="搜索食材名称..."
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
        />
      </div>

      <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
        {Object.entries(foodPresets).map(([category, presets]) => {
          const filtered = filteredPresets(presets);
          if (searchTerm && filtered.length === 0) return null;

          return (
            <div key={category} className="border border-gray-100 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                <span>{categoryNames[category]}</span>
                {expandedCategory === category ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>

              {expandedCategory === category && (
                <div className="p-2 flex flex-wrap gap-1">
                  {filtered.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => onSelect(preset)}
                      className={`px-2 py-1 rounded-lg text-xs font-medium transition-all hover:scale-105 ${
                        selectedName === preset.name
                          ? 'bg-green-500 text-white'
                          : 'bg-white border border-gray-200 hover:border-green-300 hover:bg-green-50'
                      }`}
                    >
                      <span className="mr-1">{preset.emoji}</span>
                      {preset.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
