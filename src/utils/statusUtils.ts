import { FoodStatus } from '@/types';

export function getStatus(remainingDays: number): FoodStatus {
  if (remainingDays <= 0) return 'expired';
  if (remainingDays <= 2) return 'danger';
  if (remainingDays <= 7) return 'warning';
  return 'safe';
}

export function getStatusColor(status: FoodStatus): string {
  const colors: Record<FoodStatus, string> = {
    safe: '#22c55e',
    warning: '#eab308',
    danger: '#ef4444',
    expired: '#6b7280'
  };
  return colors[status];
}

export function getStatusBgColor(status: FoodStatus): string {
  const colors: Record<FoodStatus, string> = {
    safe: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
    expired: 'bg-gray-500'
  };
  return colors[status];
}

export function getStatusLightBgColor(status: FoodStatus): string {
  const colors: Record<FoodStatus, string> = {
    safe: 'bg-green-50',
    warning: 'bg-yellow-50',
    danger: 'bg-red-50',
    expired: 'bg-gray-100'
  };
  return colors[status];
}

export function getStatusBorderColor(status: FoodStatus): string {
  const colors: Record<FoodStatus, string> = {
    safe: 'border-green-400',
    warning: 'border-yellow-400',
    danger: 'border-red-400',
    expired: 'border-gray-400'
  };
  return colors[status];
}

export function getStatusText(status: FoodStatus): string {
  const texts: Record<FoodStatus, string> = {
    safe: '新鲜',
    warning: '尽快食用',
    danger: '即将过期',
    expired: '已过期'
  };
  return texts[status];
}

export function getStatusTextColor(status: FoodStatus): string {
  const colors: Record<FoodStatus, string> = {
    safe: 'text-green-700',
    warning: 'text-yellow-700',
    danger: 'text-red-700',
    expired: 'text-gray-600'
  };
  return colors[status];
}

export function isTodayExpiring(remainingDays: number): boolean {
  return remainingDays === 0;
}
