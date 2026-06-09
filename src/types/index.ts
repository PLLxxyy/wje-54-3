export type FoodStatus = 'safe' | 'warning' | 'danger' | 'expired';

export type StorageLocation = 'fridge' | 'freezer' | 'pantry';

export type ArchiveReason = 'eaten' | 'discarded';

export interface FoodItem {
  id: string;
  name: string;
  purchaseDate: string;
  shelfLifeDays: number;
  location: StorageLocation;
  quantity: number;
  unit: string;
  photo?: string;
  emoji?: string;
  createdAt: string;
  isArchived: boolean;
  archiveReason?: ArchiveReason;
  archivedAt?: string;
}

export interface FoodStats {
  total: number;
  safe: number;
  warning: number;
  danger: number;
  expired: number;
}

export type FilterType = 'all' | FoodStatus;

export interface FoodPreset {
  name: string;
  shelfLife: number;
  emoji: string;
}
