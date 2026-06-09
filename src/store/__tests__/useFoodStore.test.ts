import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useFoodStore } from '../useFoodStore';
import { FoodItem, ArchiveReason } from '@/types';

const STORAGE_KEY = 'fridge_foods_v2';

function createTestFoodData(name: string, purchaseDate: string, shelfLifeDays: number) {
  return {
    name,
    purchaseDate,
    shelfLifeDays,
    location: 'fridge' as const,
    quantity: 1,
    unit: '个',
    emoji: '🥬',
  };
}

describe('状态管理Store - 吃完/丢弃进入历史', () => {
  beforeEach(() => {
    localStorage.clear();
    useFoodStore.setState({ foods: [] });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('添加食材后应能查询到活跃食材', () => {
    const { addFood, getActiveFoods } = useFoodStore.getState();

    addFood(createTestFoodData('牛奶', '2026-06-05', 7));

    const activeFoods = getActiveFoods();
    expect(activeFoods).toHaveLength(1);
    expect(activeFoods[0].name).toBe('牛奶');
    expect(activeFoods[0].isArchived).toBe(false);
  });

  it('标记"吃完了"后，食材应进入历史记录', () => {
    const { addFood, archiveFood, getActiveFoods, getArchivedFoods } = useFoodStore.getState();

    addFood(createTestFoodData('苹果', '2026-06-01', 30));
    const foodId = useFoodStore.getState().foods[0].id;

    archiveFood(foodId, 'eaten');

    expect(getActiveFoods()).toHaveLength(0);

    const archivedFoods = getArchivedFoods();
    expect(archivedFoods).toHaveLength(1);
    expect(archivedFoods[0].isArchived).toBe(true);
    expect(archivedFoods[0].archiveReason).toBe('eaten');
    expect(archivedFoods[0].archivedAt).toBeDefined();
  });

  it('标记"丢弃"后，食材应进入历史记录', () => {
    const { addFood, archiveFood, getActiveFoods, getArchivedFoods } = useFoodStore.getState();

    addFood(createTestFoodData('过期牛奶', '2026-05-28', 7));
    const foodId = useFoodStore.getState().foods[0].id;

    archiveFood(foodId, 'discarded');

    expect(getActiveFoods()).toHaveLength(0);

    const archivedFoods = getArchivedFoods();
    expect(archivedFoods).toHaveLength(1);
    expect(archivedFoods[0].archiveReason).toBe('discarded');
  });

  it('历史记录应按归档时间降序排列', () => {
    const { addFood, archiveFood, getArchivedFoods } = useFoodStore.getState();

    addFood(createTestFoodData('早添加的', '2026-06-01', 7));
    const food1Id = useFoodStore.getState().foods[0].id;
    vi.advanceTimersByTime(1000);

    addFood(createTestFoodData('晚添加的', '2026-06-01', 7));
    const food2Id = useFoodStore.getState().foods[1].id;
    vi.advanceTimersByTime(1000);

    archiveFood(food1Id, 'eaten');
    vi.advanceTimersByTime(1000);
    archiveFood(food2Id, 'discarded');

    const archivedFoods = getArchivedFoods();
    expect(archivedFoods.map((f) => f.name)).toEqual(['晚添加的', '早添加的']);
  });

  it('从历史记录恢复食材', () => {
    const { addFood, archiveFood, restoreFood, getActiveFoods, getArchivedFoods } = useFoodStore.getState();

    addFood(createTestFoodData('可恢复的', '2026-06-01', 7));
    const foodId = useFoodStore.getState().foods[0].id;

    archiveFood(foodId, 'eaten');
    expect(getActiveFoods()).toHaveLength(0);
    expect(getArchivedFoods()).toHaveLength(1);

    restoreFood(foodId);

    const activeFoods = getActiveFoods();
    expect(activeFoods).toHaveLength(1);
    expect(activeFoods[0].isArchived).toBe(false);
    expect(activeFoods[0].archiveReason).toBeUndefined();
    expect(activeFoods[0].archivedAt).toBeUndefined();
    expect(getArchivedFoods()).toHaveLength(0);
  });

  it('清空历史记录', () => {
    const { addFood, archiveFood, clearArchived, getArchivedFoods } = useFoodStore.getState();

    addFood(createTestFoodData('食材1', '2026-06-01', 7));
    addFood(createTestFoodData('食材2', '2026-06-01', 7));
    const foods = useFoodStore.getState().foods;

    archiveFood(foods[0].id, 'eaten');
    archiveFood(foods[1].id, 'discarded');

    expect(getArchivedFoods()).toHaveLength(2);

    clearArchived();

    expect(getArchivedFoods()).toHaveLength(0);
  });

  it('删除食材应完全移除', () => {
    const { addFood, deleteFood, getActiveFoods, getArchivedFoods } = useFoodStore.getState();

    addFood(createTestFoodData('要删除的', '2026-06-01', 7));
    const foodId = useFoodStore.getState().foods[0].id;

    deleteFood(foodId);

    expect(getActiveFoods()).toHaveLength(0);
    expect(getArchivedFoods()).toHaveLength(0);
  });

  it('更新食材信息', () => {
    const { addFood, updateFood, getActiveFoods } = useFoodStore.getState();

    addFood(createTestFoodData('原名', '2026-06-01', 7));
    const foodId = useFoodStore.getState().foods[0].id;

    updateFood(foodId, {
      name: '新名',
      quantity: 5,
      unit: '斤',
    });

    const updatedFood = getActiveFoods()[0];
    expect(updatedFood.name).toBe('新名');
    expect(updatedFood.quantity).toBe(5);
    expect(updatedFood.unit).toBe('斤');
  });

  it('统计数据应正确计算各状态数量', () => {
    const { addFood, getStats } = useFoodStore.getState();

    addFood(createTestFoodData('安全食材', '2026-05-25', 30));
    addFood(createTestFoodData('注意食材', '2026-06-04', 7));
    addFood(createTestFoodData('危险食材', '2026-06-07', 2));
    addFood(createTestFoodData('过期食材', '2026-05-25', 7));

    const stats = getStats();
    expect(stats.total).toBe(4);
    expect(stats.safe).toBe(1);
    expect(stats.warning).toBe(1);
    expect(stats.danger).toBe(1);
    expect(stats.expired).toBe(1);
  });

  it('按状态筛选食材', () => {
    const { addFood, getFoodsByStatus } = useFoodStore.getState();

    addFood(createTestFoodData('安全1', '2026-05-25', 30));
    addFood(createTestFoodData('安全2', '2026-05-20', 40));
    addFood(createTestFoodData('注意', '2026-06-04', 7));
    addFood(createTestFoodData('危险', '2026-06-07', 2));

    expect(getFoodsByStatus('safe')).toHaveLength(2);
    expect(getFoodsByStatus('warning')).toHaveLength(1);
    expect(getFoodsByStatus('danger')).toHaveLength(1);
    expect(getFoodsByStatus('expired')).toHaveLength(0);
  });
});

describe('状态管理Store - 本地持久化读写', () => {
  beforeEach(() => {
    localStorage.clear();
    useFoodStore.setState({ foods: [] });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('添加食材后应自动保存到localStorage', () => {
    const { addFood } = useFoodStore.getState();

    addFood(createTestFoodData('持久化测试', '2026-06-08', 7));

    const storedData = localStorage.getItem(STORAGE_KEY);
    expect(storedData).not.toBeNull();

    const parsed = JSON.parse(storedData!);
    expect(parsed.state.foods).toHaveLength(1);
    expect(parsed.state.foods[0].name).toBe('持久化测试');
  });

  it('应从localStorage恢复数据', () => {
    const testFood: FoodItem = {
      id: 'test-id-123',
      name: '恢复测试',
      purchaseDate: '2026-06-01',
      shelfLifeDays: 14,
      location: 'fridge',
      quantity: 2,
      unit: '盒',
      emoji: '🥛',
      createdAt: '2026-06-01T10:00:00Z',
      isArchived: false,
    };

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        state: { foods: [testFood] },
        version: 0,
      })
    );

    useFoodStore.persist.rehydrate();

    const { foods } = useFoodStore.getState();
    expect(foods).toHaveLength(1);
    expect(foods[0].id).toBe('test-id-123');
    expect(foods[0].name).toBe('恢复测试');
    expect(foods[0].quantity).toBe(2);
  });

  it('归档操作应同步到localStorage', () => {
    const { addFood, archiveFood } = useFoodStore.getState();

    addFood(createTestFoodData('同步测试', '2026-06-01', 7));
    const foodId = useFoodStore.getState().foods[0].id;

    archiveFood(foodId, 'eaten');

    const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(storedData.state.foods[0].isArchived).toBe(true);
    expect(storedData.state.foods[0].archiveReason).toBe('eaten');
  });

  it('删除操作应同步到localStorage', () => {
    const { addFood, deleteFood } = useFoodStore.getState();

    addFood(createTestFoodData('删除测试', '2026-06-01', 7));
    const foodId = useFoodStore.getState().foods[0].id;

    deleteFood(foodId);

    const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(storedData.state.foods).toHaveLength(0);
  });

  it('多次操作后数据一致性', () => {
    const { addFood, updateFood, archiveFood, getActiveFoods } = useFoodStore.getState();

    addFood(createTestFoodData('食材A', '2026-06-01', 7));
    addFood(createTestFoodData('食材B', '2026-06-01', 14));
    addFood(createTestFoodData('食材C', '2026-06-01', 30));

    const foods = useFoodStore.getState().foods;
    expect(foods).toHaveLength(3);

    updateFood(foods[0].id, { quantity: 5 });
    archiveFood(foods[1].id, 'eaten');

    const activeFoods = getActiveFoods();
    expect(activeFoods).toHaveLength(2);
    expect(activeFoods.find((f) => f.name === '食材A')?.quantity).toBe(5);

    const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(storedData.state.foods).toHaveLength(3);
    expect(storedData.state.foods[0].quantity).toBe(5);
    expect(storedData.state.foods[1].isArchived).toBe(true);
  });

  it('初始状态下食材列表应为空', () => {
    useFoodStore.setState({ foods: [] });
    localStorage.removeItem(STORAGE_KEY);

    const { foods, getActiveFoods } = useFoodStore.getState();
    expect(foods).toHaveLength(0);
    expect(getActiveFoods()).toHaveLength(0);
  });

  it('localStorage数据损坏时应优雅处理', () => {
    localStorage.setItem(STORAGE_KEY, 'invalid json data');

    expect(() => {
      useFoodStore.persist.rehydrate();
    }).not.toThrow();

    const { foods } = useFoodStore.getState();
    expect(foods).toBeDefined();
  });
});

describe('综合流程测试', () => {
  beforeEach(() => {
    localStorage.clear();
    useFoodStore.setState({ foods: [] });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('完整生命周期：添加→查看→编辑→归档→恢复→删除', () => {
    const {
      addFood,
      updateFood,
      archiveFood,
      restoreFood,
      deleteFood,
      getActiveFoods,
      getArchivedFoods,
      getStats,
    } = useFoodStore.getState();

    addFood(createTestFoodData('测试食材', '2026-06-01', 7));
    let foodId = useFoodStore.getState().foods[0].id;
    expect(getActiveFoods()).toHaveLength(1);
    expect(getStats().total).toBe(1);

    updateFood(foodId, { name: '更新后名称', quantity: 3, unit: '包' });
    expect(getActiveFoods()[0].name).toBe('更新后名称');
    expect(getActiveFoods()[0].quantity).toBe(3);

    archiveFood(foodId, 'discarded');
    expect(getActiveFoods()).toHaveLength(0);
    expect(getArchivedFoods()).toHaveLength(1);
    expect(getStats().total).toBe(0);

    restoreFood(foodId);
    expect(getActiveFoods()).toHaveLength(1);
    expect(getArchivedFoods()).toHaveLength(0);
    expect(getStats().total).toBe(1);

    foodId = useFoodStore.getState().foods[0].id;
    deleteFood(foodId);
    expect(getActiveFoods()).toHaveLength(0);
    expect(getArchivedFoods()).toHaveLength(0);

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(stored.state.foods).toHaveLength(0);
  });

  it('多个食材混合状态的完整流程', () => {
    const { addFood, archiveFood, getActiveFoods, getArchivedFoods, getStats } = useFoodStore.getState();

    addFood(createTestFoodData('苹果', '2026-05-20', 30));
    addFood(createTestFoodData('牛奶', '2026-06-05', 7));
    addFood(createTestFoodData('鸡肉', '2026-06-07', 2));
    addFood(createTestFoodData('过期面包', '2026-05-25', 7));

    const initialStats = getStats();
    expect(initialStats.total).toBe(4);
    expect(initialStats.safe).toBe(1);
    expect(initialStats.warning).toBe(1);
    expect(initialStats.danger).toBe(1);
    expect(initialStats.expired).toBe(1);

    const foods = useFoodStore.getState().foods;
    archiveFood(foods[1].id, 'eaten');
    archiveFood(foods[3].id, 'discarded');

    const afterArchiveStats = getStats();
    expect(afterArchiveStats.total).toBe(2);
    expect(getArchivedFoods()).toHaveLength(2);

    const activeNames = getActiveFoods().map((f) => f.name);
    expect(activeNames).toContain('苹果');
    expect(activeNames).toContain('鸡肉');

    const archivedNames = getArchivedFoods().map((f) => f.name);
    expect(archivedNames).toContain('牛奶');
    expect(archivedNames).toContain('过期面包');
  });
});
