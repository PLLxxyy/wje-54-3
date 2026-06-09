import { useState, useMemo } from 'react';
import { ArrowLeft, RotateCcw, Trash2, Utensils, Package, Search } from 'lucide-react';
import { useFoodStore } from '@/store/useFoodStore';
import { formatDate } from '@/utils/dateUtils';
import { getRemainingDays, formatRelativeDay } from '@/utils/dateUtils';
import { getStatus, getStatusTextColor } from '@/utils/statusUtils';
import { locationNames } from '@/utils/foodPresets';
import { ArchiveFilterType } from '@/types';

interface HistoryPageProps {
  onNavigate: (page: string) => void;
}

export default function HistoryPage({ onNavigate }: HistoryPageProps) {
  const { getArchivedFoods, restoreFood, clearArchived } = useFoodStore();
  const archivedFoods = getArchivedFoods();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<ArchiveFilterType>('all');

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

  const filteredFoods = useMemo(() => {
    let result = [...archivedFoods];

    if (activeFilter !== 'all') {
      result = result.filter((f) => f.archiveReason === activeFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter((f) => f.name.toLowerCase().includes(term));
    }

    return result;
  }, [archivedFoods, activeFilter, searchTerm]);

  const eatenCount = archivedFoods.filter((f) => f.archiveReason === 'eaten').length;
  const discardedCount = archivedFoods.filter((f) => f.archiveReason === 'discarded').length;

  const archiveFilterOptions: { value: ArchiveFilterType; label: string; emoji: string }[] = [
    { value: 'all', label: '全部', emoji: '📋' },
    { value: 'eaten', label: '已吃完', emoji: '🍽️' },
    { value: 'discarded', label: '已丢弃', emoji: '🗑️' },
  ];

  const getFilterCount = (filter: ArchiveFilterType): number => {
    if (filter === 'all') return archivedFoods.length;
    return archivedFoods.filter((f) => f.archiveReason === filter).length;
  };

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
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索食材名称..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 outline-none transition-all bg-white shadow-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {archiveFilterOptions.map((option) => {
              const count = getFilterCount(option.value);
              const isActive = activeFilter === option.value;

              return (
                <button
                  key={option.value}
                  onClick={() => setActiveFilter(option.value)}
                  className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                    isActive
                      ? 'text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-gray-50 hover:shadow border border-gray-200'
                  }`}
                  style={{
                    backgroundColor: isActive
                      ? option.value === 'all'
                        ? '#6b7280'
                        : option.value === 'eaten'
                        ? '#22c55e'
                        : '#f97316'
                      : undefined,
                    boxShadow: isActive
                      ? `0 4px 14px ${
                          option.value === 'all'
                            ? '#6b7280'
                            : option.value === 'eaten'
                            ? '#22c55e'
                            : '#f97316'
                        }40`
                      : undefined,
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
        </div>

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
        ) : filteredFoods.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-600 mb-2">没有找到匹配的记录</h3>
            <p className="text-gray-400 mb-6">试试其他搜索词或筛选条件</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveFilter('all');
              }}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors"
            >
              重置筛选
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFoods.map((food, index) => {
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
