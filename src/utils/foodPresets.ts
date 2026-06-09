import { FoodPreset } from '@/types';

export const foodPresets: Record<string, FoodPreset[]> = {
  vegetables: [
    { name: '生菜', shelfLife: 7, emoji: '🥬' },
    { name: '西红柿', shelfLife: 10, emoji: '🍅' },
    { name: '胡萝卜', shelfLife: 14, emoji: '🥕' },
    { name: '西兰花', shelfLife: 7, emoji: '🥦' },
    { name: '黄瓜', shelfLife: 7, emoji: '🥒' },
    { name: '茄子', shelfLife: 5, emoji: '🍆' },
    { name: '菠菜', shelfLife: 5, emoji: '🥬' },
    { name: '白菜', shelfLife: 10, emoji: '🥬' },
    { name: '土豆', shelfLife: 30, emoji: '🥔' },
    { name: '洋葱', shelfLife: 60, emoji: '🧅' },
    { name: '青椒', shelfLife: 7, emoji: '🫑' },
    { name: '玉米', shelfLife: 5, emoji: '🌽' },
  ],
  fruits: [
    { name: '苹果', shelfLife: 30, emoji: '🍎' },
    { name: '香蕉', shelfLife: 5, emoji: '🍌' },
    { name: '草莓', shelfLife: 3, emoji: '🍓' },
    { name: '橙子', shelfLife: 21, emoji: '🍊' },
    { name: '葡萄', shelfLife: 7, emoji: '🍇' },
    { name: '西瓜', shelfLife: 7, emoji: '🍉' },
    { name: '桃子', shelfLife: 5, emoji: '🍑' },
    { name: '梨', shelfLife: 21, emoji: '🍐' },
    { name: '樱桃', shelfLife: 3, emoji: '🍒' },
    { name: '蓝莓', shelfLife: 7, emoji: '🫐' },
    { name: '芒果', shelfLife: 7, emoji: '🥭' },
    { name: '菠萝', shelfLife: 14, emoji: '🍍' },
  ],
  meat: [
    { name: '鸡蛋', shelfLife: 21, emoji: '🥚' },
    { name: '猪肉', shelfLife: 3, emoji: '🥩' },
    { name: '牛肉', shelfLife: 4, emoji: '🥩' },
    { name: '鸡肉', shelfLife: 2, emoji: '🍗' },
    { name: '鸭肉', shelfLife: 2, emoji: '🦆' },
    { name: '羊肉', shelfLife: 3, emoji: '🍖' },
    { name: '培根', shelfLife: 7, emoji: '🥓' },
    { name: '香肠', shelfLife: 14, emoji: '🌭' },
    { name: '鱼', shelfLife: 2, emoji: '🐟' },
    { name: '虾', shelfLife: 2, emoji: '🦐' },
  ],
  dairy: [
    { name: '牛奶', shelfLife: 7, emoji: '🥛' },
    { name: '酸奶', shelfLife: 14, emoji: '🥛' },
    { name: '奶酪', shelfLife: 60, emoji: '🧀' },
    { name: '黄油', shelfLife: 30, emoji: '🧈' },
    { name: '冰淇淋', shelfLife: 90, emoji: '🍦' },
  ],
  cooked: [
    { name: '米饭', shelfLife: 3, emoji: '🍚' },
    { name: '面条', shelfLife: 2, emoji: '🍜' },
    { name: '剩菜', shelfLife: 2, emoji: '🥡' },
    { name: '饺子', shelfLife: 3, emoji: '🥟' },
    { name: '包子', shelfLife: 3, emoji: '🥟' },
    { name: '披萨', shelfLife: 3, emoji: '🍕' },
  ],
  others: [
    { name: '面包', shelfLife: 7, emoji: '🍞' },
    { name: '豆腐', shelfLife: 3, emoji: '🧈' },
    { name: '蛋糕', shelfLife: 3, emoji: '🍰' },
    { name: '饼干', shelfLife: 180, emoji: '🍪' },
    { name: '巧克力', shelfLife: 180, emoji: '🍫' },
    { name: '蜂蜜', shelfLife: 365, emoji: '🍯' },
    { name: '果酱', shelfLife: 90, emoji: '🍇' },
    { name: '番茄酱', shelfLife: 180, emoji: '🍅' },
  ],
};

export const categoryNames: Record<string, string> = {
  vegetables: '🥬 蔬菜类',
  fruits: '🍎 水果类',
  meat: '🥩 肉蛋类',
  dairy: '🥛 乳制品',
  cooked: '🍚 熟食类',
  others: '🍞 其他',
};

export const locationNames: Record<string, string> = {
  fridge: '冷藏',
  freezer: '冷冻',
  pantry: '常温',
};

export const unitOptions = ['个', '斤', '盒', '瓶', '袋', '包', '块', '片', '把', '颗', 'g', 'kg', 'ml', 'L'];

export function findPresetByName(name: string): FoodPreset | undefined {
  const lowerName = name.toLowerCase();
  for (const category of Object.values(foodPresets)) {
    const preset = category.find(p => p.name.toLowerCase() === lowerName);
    if (preset) return preset;
  }
  return undefined;
}
