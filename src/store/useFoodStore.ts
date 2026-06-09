import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FoodItem, FoodStats, FoodStatus, ArchiveReason, StorageLocation } from '@/types';
import { getRemainingDays } from '@/utils/dateUtils';
import { getStatus } from '@/utils/statusUtils';

interface FoodStore {
  foods: FoodItem[];
  addFood: (food: Omit<FoodItem, 'id' | 'createdAt' | 'isArchived'>) => void;
  updateFood: (id: string, updates: Partial<FoodItem>) => void;
  deleteFood: (id: string) => void;
  archiveFood: (id: string, reason: ArchiveReason) => void;
  restoreFood: (id: string) => void;
  clearArchived: () => void;
  getActiveFoods: () => FoodItem[];
  getArchivedFoods: () => FoodItem[];
  getStats: () => FoodStats;
  getFoodsByStatus: (status: FoodStatus) => FoodItem[];
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function sortByRemainingDays(foods: FoodItem[]): FoodItem[] {
  return [...foods].sort((a, b) => {
    const remainingA = getRemainingDays(a.purchaseDate, a.shelfLifeDays);
    const remainingB = getRemainingDays(b.purchaseDate, b.shelfLifeDays);
    if (remainingA !== remainingB) {
      return remainingA - remainingB;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export const useFoodStore = create<FoodStore>()(
  persist(
    (set, get) => ({
      foods: [],
      
      addFood: (foodData) => {
        const newFood: FoodItem = {
          ...foodData,
          id: generateId(),
          createdAt: new Date().toISOString(),
          isArchived: false,
        };
        set((state) => ({
          foods: [...state.foods, newFood],
        }));
      },
      
      updateFood: (id, updates) => {
        set((state) => ({
          foods: state.foods.map((food) =>
            food.id === id ? { ...food, ...updates } : food
          ),
        }));
      },
      
      deleteFood: (id) => {
        set((state) => ({
          foods: state.foods.filter((food) => food.id !== id),
        }));
      },
      
      archiveFood: (id, reason) => {
        set((state) => ({
          foods: state.foods.map((food) =>
            food.id === id
              ? {
                  ...food,
                  isArchived: true,
                  archiveReason: reason,
                  archivedAt: new Date().toISOString(),
                }
              : food
          ),
        }));
      },
      
      restoreFood: (id) => {
        set((state) => ({
          foods: state.foods.map((food) =>
            food.id === id
              ? {
                  ...food,
                  isArchived: false,
                  archiveReason: undefined,
                  archivedAt: undefined,
                }
              : food
          ),
        }));
      },
      
      clearArchived: () => {
        set((state) => ({
          foods: state.foods.filter((food) => !food.isArchived),
        }));
      },
      
      getActiveFoods: () => {
        const activeFoods = get().foods.filter((food) => !food.isArchived);
        return sortByRemainingDays(activeFoods);
      },
      
      getArchivedFoods: () => {
        return get()
          .foods.filter((food) => food.isArchived)
          .sort(
            (a, b) =>
              new Date(b.archivedAt || 0).getTime() - new Date(a.archivedAt || 0).getTime()
          );
      },
      
      getStats: () => {
        const activeFoods = get().foods.filter((food) => !food.isArchived);
        const stats: FoodStats = {
          total: activeFoods.length,
          safe: 0,
          warning: 0,
          danger: 0,
          expired: 0,
        };
        
        activeFoods.forEach((food) => {
          const remainingDays = getRemainingDays(food.purchaseDate, food.shelfLifeDays);
          const status = getStatus(remainingDays);
          stats[status]++;
        });
        
        return stats;
      },
      
      getFoodsByStatus: (status) => {
        const activeFoods = get().getActiveFoods();
        return activeFoods.filter((food) => {
          const remainingDays = getRemainingDays(food.purchaseDate, food.shelfLifeDays);
          return getStatus(remainingDays) === status;
        });
      },
    }),
    {
      name: 'fridge_foods_v2',
    }
  )
);
