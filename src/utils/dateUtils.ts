export function getRemainingDays(purchaseDate: string, shelfLifeDays: number): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const purchase = new Date(purchaseDate);
  purchase.setHours(0, 0, 0, 0);
  
  const expiryDate = new Date(purchase);
  expiryDate.setDate(expiryDate.getDate() + shelfLifeDays);
  
  const diffTime = expiryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

export function getTodayISO(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

export function formatRelativeDay(remainingDays: number): string {
  if (remainingDays > 0) {
    return `还剩 ${remainingDays} 天`;
  } else if (remainingDays === 0) {
    return '今天到期';
  } else {
    return `已过期 ${Math.abs(remainingDays)} 天`;
  }
}
