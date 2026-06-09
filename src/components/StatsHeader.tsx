import { FoodStats } from '@/types';
import { getStatusColor } from '@/utils/statusUtils';

interface StatsHeaderProps {
  stats: FoodStats;
}

export default function StatsHeader({ stats }: StatsHeaderProps) {
  const statItems = [
    { key: 'safe', label: '新鲜', emoji: '✅', count: stats.safe },
    { key: 'warning', label: '注意', emoji: '⚠️', count: stats.warning },
    { key: 'danger', label: '危险', emoji: '🚨', count: stats.danger },
    { key: 'expired', label: '过期', emoji: '❌', count: stats.expired },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {statItems.map((item) => {
        const color = getStatusColor(item.key as any);
        const hasItems = item.count > 0;

        return (
          <div
            key={item.key}
            className="bg-white/80 backdrop-blur rounded-2xl p-4 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{
              borderTop: `4px solid ${color}`,
            }}
          >
            <div className="text-3xl mb-1">{item.emoji}</div>
            <div
              className="text-3xl font-bold"
              style={{ color: hasItems ? color : '#9ca3af' }}
            >
              {item.count}
            </div>
            <div className="text-sm text-gray-500">{item.label}</div>
          </div>
        );
      })}
    </div>
  );
}
