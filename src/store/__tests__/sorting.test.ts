import { describe, it, expect } from 'vitest';
import { sortByRemainingDays } from '../useFoodStore';
import { FoodItem } from '@/types';
import { getRemainingDays } from '@/utils/dateUtils';

function createMockFood(
  id: string,
  name: string,
  purchaseDate: string,
  shelfLifeDays: number,
  createdAt: string
): FoodItem {
  return {
    id,
    name,
    purchaseDate,
    shelfLifeDays,
    location: 'fridge',
    quantity: 1,
    unit: '个',
    emoji: '🥬',
    createdAt,
    isArchived: false,
  };
}

describe('按剩余时间排序', () => {
  it('应按剩余天数升序排列，即将过期的排最前面', () => {
    const foods: FoodItem[] = [
      createMockFood('1', '苹果', '2026-06-01', 30, '2026-06-01T10:00:00Z'),
      createMockFood('2', '牛奶', '2026-06-05', 7, '2026-06-05T10:00:00Z'),
      createMockFood('3', '草莓', '2026-06-06', 3, '2026-06-06T10:00:00Z'),
      createMockFood('4', '鸡肉', '2026-06-07', 2, '2026-06-07T10:00:00Z'),
    ];

    const sorted = sortByRemainingDays(foods);

    expect(sorted.map((f) => f.name)).toEqual(['鸡肉', '草莓', '牛奶', '苹果']);

    const remainingDays = sorted.map((f) =>
      getRemainingDays(f.purchaseDate, f.shelfLifeDays)
    );
    expect(remainingDays).toEqual([1, 1, 4, 23]);
  });

  it('已过期的食材应排在最前面', () => {
    const foods: FoodItem[] = [
      createMockFood('1', '新鲜苹果', '2026-06-01', 30, '2026-06-01T10:00:00Z'),
      createMockFood('2', '已过期牛奶', '2026-05-28', 7, '2026-05-28T10:00:00Z'),
      createMockFood('3', '今天到期草莓', '2026-06-01', 7, '2026-06-01T10:00:00Z'),
      createMockFood('4', '即将过期鸡肉', '2026-06-07', 2, '2026-06-07T10:00:00Z'),
    ];

    const sorted = sortByRemainingDays(foods);

    expect(sorted.map((f) => f.name)).toEqual([
      '已过期牛奶',
      '今天到期草莓',
      '即将过期鸡肉',
      '新鲜苹果',
    ]);

    const remainingDays = sorted.map((f) =>
      getRemainingDays(f.purchaseDate, f.shelfLifeDays)
    );
    expect(remainingDays).toEqual([-4, 0, 1, 23]);
  });

  it('剩余天数相同时，按创建时间降序排列（新创建的排前面）', () => {
    const foods: FoodItem[] = [
      createMockFood('1', '早添加的牛奶', '2026-06-05', 7, '2026-06-05T08:00:00Z'),
      createMockFood('2', '晚添加的牛奶', '2026-06-05', 7, '2026-06-05T12:00:00Z'),
    ];

    const sorted = sortByRemainingDays(foods);

    expect(sorted.map((f) => f.name)).toEqual(['晚添加的牛奶', '早添加的牛奶']);
  });

  it('混合状态的食材应正确排序：过期→今天→危险→注意→安全', () => {
    const foods: FoodItem[] = [
      createMockFood('safe', '安全食材', '2026-05-20', 30, '2026-05-20T10:00:00Z'),
      createMockFood('warning', '注意食材', '2026-06-03', 7, '2026-06-03T10:00:00Z'),
      createMockFood('danger', '危险食材', '2026-06-07', 2, '2026-06-07T10:00:00Z'),
      createMockFood('expired', '过期食材', '2026-05-25', 7, '2026-05-25T10:00:00Z'),
      createMockFood('today', '今天到期', '2026-06-01', 7, '2026-06-01T10:00:00Z'),
    ];

    const sorted = sortByRemainingDays(foods);

    expect(sorted.map((f) => f.id)).toEqual([
      'expired',
      'today',
      'danger',
      'warning',
      'safe',
    ]);
  });

  it('空数组应返回空数组', () => {
    const sorted = sortByRemainingDays([]);
    expect(sorted).toEqual([]);
  });

  it('单个食材应返回原数组', () => {
    const food = createMockFood('1', '测试', '2026-06-08', 7, '2026-06-08T10:00:00Z');
    const sorted = sortByRemainingDays([food]);
    expect(sorted).toHaveLength(1);
    expect(sorted[0].id).toBe('1');
  });

  it('不应修改原始数组', () => {
    const foods: FoodItem[] = [
      createMockFood('1', '苹果', '2026-06-01', 30, '2026-06-01T10:00:00Z'),
      createMockFood('2', '牛奶', '2026-06-05', 7, '2026-06-05T10:00:00Z'),
    ];
    const originalOrder = foods.map((f) => f.id);

    sortByRemainingDays(foods);

    expect(foods.map((f) => f.id)).toEqual(originalOrder);
  });

  it('大量食材排序验证', () => {
    const foods: FoodItem[] = [];
    for (let i = 0; i < 10; i++) {
      const daysAgo = Math.floor(Math.random() * 20);
      const purchaseDate = new Date('2026-06-08');
      purchaseDate.setDate(purchaseDate.getDate() - daysAgo);
      foods.push(
        createMockFood(
          `food-${i}`,
          `食材${i}`,
          purchaseDate.toISOString().split('T')[0],
          Math.floor(Math.random() * 30) + 1,
          `2026-06-08T${String(i).padStart(2, '0')}:00:00Z`
        )
      );
    }

    const sorted = sortByRemainingDays(foods);

    for (let i = 0; i < sorted.length - 1; i++) {
      const currentRemaining = getRemainingDays(
        sorted[i].purchaseDate,
        sorted[i].shelfLifeDays
      );
      const nextRemaining = getRemainingDays(
        sorted[i + 1].purchaseDate,
        sorted[i + 1].shelfLifeDays
      );
      expect(currentRemaining).toBeLessThanOrEqual(nextRemaining);
    }
  });
});
