import { describe, it, expect } from 'vitest';
import {
  getRemainingDays,
  formatDate,
  getTodayISO,
  formatRelativeDay,
} from '../dateUtils';

describe('日期计算工具', () => {
  describe('getRemainingDays - 剩余天数计算', () => {
    it('今天购买，保质期7天，应返回7天', () => {
      const result = getRemainingDays('2026-06-08', 7);
      expect(result).toBe(7);
    });

    it('昨天购买，保质期7天，应返回6天', () => {
      const result = getRemainingDays('2026-06-07', 7);
      expect(result).toBe(6);
    });

    it('7天前购买，保质期7天，应返回0天（今天到期）', () => {
      const result = getRemainingDays('2026-06-01', 7);
      expect(result).toBe(0);
    });

    it('8天前购买，保质期7天，应返回-1天（已过期1天）', () => {
      const result = getRemainingDays('2026-05-31', 7);
      expect(result).toBe(-1);
    });

    it('10天前购买，保质期5天，应返回-5天（已过期5天）', () => {
      const result = getRemainingDays('2026-05-29', 5);
      expect(result).toBe(-5);
    });

    it('保质期30天，还剩23天', () => {
      const result = getRemainingDays('2026-06-01', 30);
      expect(result).toBe(23);
    });

    it('跨月份计算：5月31日购买，保质期7天，应返回0天', () => {
      const result = getRemainingDays('2026-06-01', 7);
      expect(result).toBe(0);
    });

    it('跨月份计算：2026年5月25日购买，保质期30天，应返回16天', () => {
      const result = getRemainingDays('2026-05-25', 30);
      expect(result).toBe(16);
    });

    it('保质期1天，今天购买，应返回1天', () => {
      const result = getRemainingDays('2026-06-08', 1);
      expect(result).toBe(1);
    });

    it('保质期1天，昨天购买，应返回0天（今天到期）', () => {
      const result = getRemainingDays('2026-06-07', 1);
      expect(result).toBe(0);
    });
  });

  describe('formatDate - 日期格式化', () => {
    it('格式化日期为中文格式', () => {
      const result = formatDate('2026-06-08');
      expect(result).toBe('2026/06/08');
    });

    it('格式化单 digit 月份和日期', () => {
      const result = formatDate('2026-01-05');
      expect(result).toBe('2026/01/05');
    });
  });

  describe('getTodayISO - 获取今天ISO日期', () => {
    it('应返回当前模拟日期的ISO格式', () => {
      const result = getTodayISO();
      expect(result).toBe('2026-06-08');
    });
  });

  describe('formatRelativeDay - 相对日期格式化', () => {
    it('剩余7天，应显示"还剩 7 天"', () => {
      expect(formatRelativeDay(7)).toBe('还剩 7 天');
    });

    it('剩余1天，应显示"还剩 1 天"', () => {
      expect(formatRelativeDay(1)).toBe('还剩 1 天');
    });

    it('剩余0天，应显示"今天到期"', () => {
      expect(formatRelativeDay(0)).toBe('今天到期');
    });

    it('过期1天，应显示"已过期 1 天"', () => {
      expect(formatRelativeDay(-1)).toBe('已过期 1 天');
    });

    it('过期5天，应显示"已过期 5 天"', () => {
      expect(formatRelativeDay(-5)).toBe('已过期 5 天');
    });
  });
});
