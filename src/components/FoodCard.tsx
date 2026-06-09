import { FoodItem } from '@/types';
import { getRemainingDays, formatDate, formatRelativeDay } from '@/utils/dateUtils';
import {
  getStatus,
  getStatusBorderColor,
  getStatusLightBgColor,
  getStatusText,
  getStatusTextColor,
  isTodayExpiring,
} from '@/utils/statusUtils';
import { locationNames } from '@/utils/foodPresets';
import { useFoodStore } from '@/store/useFoodStore';
import { Trash2, Edit3, Utensils, Package } from 'lucide-react';

interface FoodCardProps {
  food: FoodItem;
  onEdit: (food: FoodItem) => void;
  index: number;
}

export default function FoodCard({ food, onEdit, index }: FoodCardProps) {
  const { archiveFood, deleteFood } = useFoodStore();
  const remainingDays = getRemainingDays(food.purchaseDate, food.shelfLifeDays);
  const status = getStatus(remainingDays);
  const isUrgent = remainingDays <= 0 || isTodayExpiring(remainingDays);
  const isExpired = remainingDays < 0;

  const handleArchiveEaten = () => {
    archiveFood(food.id, 'eaten');
  };

  const handleArchiveDiscarded = () => {
    archiveFood(food.id, 'discarded');
  };

  const handleDelete = () => {
    if (window.confirm(`确定要删除「${food.name}」吗？`)) {
      deleteFood(food.id);
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border-l-4 ${getStatusBorderColor(
        status
      )} ${getStatusLightBgColor(status)} transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
        isUrgent ? 'animate-pulse-slow' : ''
      }`}
      style={{
        animationDelay: `${index * 0.05}s`,
        opacity: 0,
        animation: `fadeInUp 0.5s ease forwards ${index * 0.05}s`,
      }}
    >
      {isTodayExpiring(remainingDays) && (
        <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
          ⚠️ 今天到期
        </div>
      )}
      {isExpired && (
        <div className="absolute top-0 right-0 bg-gray-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
          ❌ 已过期
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-white shadow-inner">
            {food.photo ? (
              <img
                src={food.photo}
                alt={food.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-white to-gray-50">
                {food.emoji || '🍽️'}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800 truncate">
                {food.emoji && <span className="mr-1">{food.emoji}</span>}
                {food.name}
              </h3>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full bg-white/60 ${getStatusTextColor(
                  status
                )}`}
              >
                {getStatusText(status)}
              </span>
            </div>

            <div className="mt-2 space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">📍</span>
                <span>{locationNames[food.location] || food.location}</span>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-gray-400">📦</span>
                <span>
                  {food.quantity} {food.unit}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                购买日期：{formatDate(food.purchaseDate)}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center ml-4">
            <div
              className={`text-3xl font-bold ${
                isExpired ? 'text-gray-500' : remainingDays <= 2 ? 'text-red-500' : 'text-gray-800'
              }`}
            >
              {remainingDays > 0 ? (
                <>
                  <span className="text-4xl">{remainingDays}</span>
                  <span className="text-lg ml-1">天</span>
                </>
              ) : remainingDays === 0 ? (
                <span className="text-2xl">今天</span>
              ) : (
                <span className="text-2xl">-{Math.abs(remainingDays)}</span>
              )}
            </div>
            <div
              className={`text-xs mt-1 ${
                isExpired ? 'text-gray-500' : getStatusTextColor(status)
              }`}
            >
              {formatRelativeDay(remainingDays)}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200/50">
          <button
            onClick={handleArchiveEaten}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-xl transition-colors transition-transform hover:scale-105 active:scale-95"
          >
            <Utensils size={16} />
            吃完了
          </button>
          <button
            onClick={handleArchiveDiscarded}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-xl transition-colors transition-transform hover:scale-105 active:scale-95"
          >
            <Package size={16} />
            丢弃
          </button>
          <button
            onClick={() => onEdit(food)}
            className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors transition-transform hover:scale-105 active:scale-95"
            title="编辑"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-2 bg-gray-400 hover:bg-red-500 text-white rounded-xl transition-colors transition-transform hover:scale-105 active:scale-95"
            title="删除"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
