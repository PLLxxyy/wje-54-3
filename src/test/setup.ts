import '@testing-library/jest-dom/vitest';
import { beforeEach, afterEach, vi } from 'vitest';

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
  const mockDate = new Date('2026-06-08');
  vi.setSystemTime(mockDate);
});

afterEach(() => {
  localStorage.clear();
  vi.useRealTimers();
});
