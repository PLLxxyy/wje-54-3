import { useState, useMemo } from 'react';
import { Plus, History, Refrigerator } from 'lucide-react';
import { useFoodStore } from '@/store/useFoodStore';
import { getRemainingDays } from '@/utils/dateUtils';
import { getStatus } from '@/utils/statusUtils';
import { FilterType, FoodItem } from '@/types';
import FoodCard from '@/components/FoodCard';
import FilterTabs from '@/components/FilterTabs';
import StatsHeader from '@/components/StatsHeader';
import AddFoodModal from '@/components/AddFoodModal';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { getActiveFoods, getStats } = useFoodStore();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);

  const activeFoods = getActiveFoods();
  const stats = getStats();

  const filteredFoods = useMemo(() => {
    if (activeFilter === 'all') return activeFoods;
    return activeFoods.filter((food) => {
      const remainingDays = getRemainingDays(food.purchaseDate, food.shelfLifeDays);
      return getStatus(remainingDays) === activeFilter;
    });
  }, [activeFoods, activeFilter]);

  const handleAddClick = () => {
    setEditingFood(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (food: FoodItem) => {
    setEditingFood(food);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFood(null);
  };

  const urgentCount = stats.danger + stats.expired;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-green-50 to-emerald-50">
      <header className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <Refrigerator size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">冰箱食材管理</h1>
                <p className="text-sm text-white/80">让每一餐都新鲜不浪费</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('history')}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
              >
                <History size={18} />
                <span className="hidden sm:inline">历史记录</span>
              </button>
            </div>
          </div>

          {urgentCount > 0 && (
            <div className="bg-red-500/90 backdrop-blur rounded-xl px-4 py-3 mb-4 animate-pulse-slow">
              <p className="text-sm font-medium">
                ⚠️ 有 <span className="font-bold text-lg">{urgentCount}</span> 样食材需要紧急处理！
              </p>
            </div>
          )}

          <button
            onClick={handleAddClick}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white text-green-600 font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all active:scale-[0.98]"
          >
            <Plus size={24} />
            添加食材
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <StatsHeader stats={stats} />

        <div className="mb-6">
          <FilterTabs
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            counts={stats}
          />
        </div>

        {filteredFoods.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🧊</div>
            <h3 className="text-xl font-bold text-gray-600 mb-2">
              {activeFilter === 'all' ? '冰箱里空空如也' : '没有符合条件的食材'}
            </h3>
            <p className="text-gray-400 mb-6">
              {activeFilter === 'all'
                ? '点击上方按钮添加你的第一样食材吧'
                : '试试切换其他筛选条件'}
            </p>
            {activeFilter === 'all' && (
              <button
                onClick={handleAddClick}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors"
              >
                立即添加
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFoods.map((food, index) => (
              <FoodCard
                key={food.id}
                food={food}
                onEdit={handleEditClick}
                index={index}
              />
            ))}
          </div>
        )}
      </main>

      <AddFoodModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editFood={editingFood}
      />
    </div>
  );
}
