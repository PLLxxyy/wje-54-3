import { ArrowLeft, RotateCcw, Trash2, Utensils, Package } from 'lucide-react';
import { useFoodStore } from '@/store/useFoodStore';
import { formatDate } from '@/utils/dateUtils';
import { getRemainingDays, formatRelativeDay } from '@/utils/dateUtils';
import { getStatus, getStatusTextColor } from '@/utils/statusUtils';
import { locationNames } from '@/utils/foodPresets';

interface HistoryPageProps {
  onNavigate: (page: string) => void;
}

export default function HistoryPage({ onNavigate }: HistoryPageProps) {
  const { getArchivedFoods, restoreFood, clearArchived } = useFoodStore();
  const archivedFoods = getArchivedFoods();

  const handleRestore = (id: string) => {
    if (window.confirm('确定要恢复这个食材吗？')) {
      restoreFood(id);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('确定要清空所有历史记录吗？此操作不可恢复。')) {
      clearArchived();
    }
  };

  const eatenCount = archivedFoods.filter((f) => f.archiveReason === 'eaten').length;
  const discardedCount = archivedFoods.filter((f) => f.archiveReason === 'discarded').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
      <header className="bg-gradient-to-r from-gray-600 to-gray-700 text-white">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-bold">📜 历史记录</h1>
              <p className="text-sm text-white/80">已吃完或丢弃的食材</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/20 backdrop-blur rounded-xl p-4 text-center">
              <div className="text-3xl mb-1">🍽️</div>
              <div className="text-3xl font-bold">{eatenCount}</div>
              <div className="text-sm text-white/80">已吃完</div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-xl p-4 text-center">
              <div className="text-3xl mb-1">🗑️</div>
              <div className="text-3xl font-bold">{discardedCount}</div>
              <div className="text-sm text-white/80">已丢弃</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {archivedFoods.length > 0 && (
          <div className="flex justify-end mb-4">
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-xl transition-colors"
            >
              <Trash2 size={16} />
              清空历史
            </button>
          </div>
        )}

        {archivedFoods.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-gray-600 mb-2">暂无历史记录</h3>
            <p className="text-gray-400 mb-6">吃完或丢弃食材后会显示在这里</p>
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors"
            >
              返回看板
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {archivedFoods.map((food, index) => {
              const remainingDays = getRemainingDays(food.purchaseDate, food.shelfLifeDays);
              const status = getStatus(remainingDays);
              const isEaten = food.archiveReason === 'eaten';

              return (
                <div
                  key={food.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 transition-all hover:shadow-md"
                  style={{
                    animation: `fadeInUp 0.5s ease forwards ${index * 0.03}s`,
                    opacity: 0,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-gray-100">
                      {food.photo ? (
                        <img
                          src={food.photo}
                          alt={food.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl bg-gradient-to-br from-gray-50 to-gray-100">
                          {food.emoji || '🍽️'}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-800 truncate">
                          {food.emoji && <span className="mr-1">{food.emoji}</span>}
                          {food.name}
                        </h3>
                        <span
                          className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                            isEaten
                              ? 'bg-green-100 text-green-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}
                        >
                          {isEaten ? <Utensils size={12} /> : <Package size={12} />}
                          {isEaten ? '吃完' : '丢弃'}
                        </span>
                      </div>

                      <div className="mt-1 text-xs text-gray-500 space-y-0.5">
                        <div>
                          📍 {locationNames[food.location] || food.location} • 📦 {food.quantity}{' '}
                          {food.unit}
                        </div>
                        <div className={`${getStatusTextColor(status)}`}>
                          {formatRelativeDay(remainingDays)}
                        </div>
                        <div className="text-gray-400">
                          处理时间：{food.archivedAt ? formatDate(food.archivedAt) : '未知'}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRestore(food.id)}
                      className="flex items-center gap-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl transition-colors transition-transform hover:scale-105 active:scale-95"
                    >
                      <RotateCcw size={14} />
                      <span className="hidden sm:inline">恢复</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
