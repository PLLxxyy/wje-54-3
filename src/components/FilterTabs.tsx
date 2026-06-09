import { FilterType } from '@/types';
import { getStatusColor, getStatusText } from '@/utils/statusUtils';

interface FilterTabsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts: {
    total: number;
    safe: number;
    warning: number;
    danger: number;
    expired: number;
  };
}

const filterOptions: { value: FilterType; label: string; emoji: string }[] = [
  { value: 'all', label: '全部', emoji: '📋' },
  { value: 'safe', label: getStatusText('safe'), emoji: '✅' },
  { value: 'warning', label: getStatusText('warning'), emoji: '⚠️' },
  { value: 'danger', label: getStatusText('danger'), emoji: '🚨' },
  { value: 'expired', label: getStatusText('expired'), emoji: '❌' },
];

export default function FilterTabs({
  activeFilter,
  onFilterChange,
  counts,
}: FilterTabsProps) {
  const getCount = (filter: FilterType): number => {
    if (filter === 'all') return counts.total;
    return counts[filter];
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {filterOptions.map((option) => {
        const count = getCount(option.value);
        const isActive = activeFilter === option.value;
        const color =
          option.value === 'all' ? '#0ea5e9' : getStatusColor(option.value as any);

        return (
          <button
            key={option.value}
            onClick={() => onFilterChange(option.value)}
            className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 ${
              isActive
                ? 'text-white shadow-lg'
                : 'bg-white/80 text-gray-600 hover:bg-white hover:shadow'
            }`}
            style={{
              backgroundColor: isActive ? color : undefined,
              boxShadow: isActive ? `0 4px 14px ${color}40` : undefined,
            }}
          >
            <span className="mr-1">{option.emoji}</span>
            {option.label}
            <span
              className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                isActive ? 'bg-white/30' : 'bg-gray-100'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
