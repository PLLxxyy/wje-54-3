import { describe, it, expect } from 'vitest';
import {
  getStatus,
  getStatusColor,
  getStatusBgColor,
  getStatusLightBgColor,
  getStatusBorderColor,
  getStatusText,
  getStatusTextColor,
  isTodayExpiring,
} from '../statusUtils';
import { FoodStatus } from '@/types';

describe('状态判断工具', () => {
  describe('getStatus - 状态颜色分级', () => {
    it('剩余8天，应为safe（绿色）', () => {
      expect(getStatus(8)).toBe('safe');
    });

    it('剩余15天，应为safe（绿色）', () => {
      expect(getStatus(15)).toBe('safe');
    });

    it('剩余7天，应为warning（黄色）', () => {
      expect(getStatus(7)).toBe('warning');
    });

    it('剩余5天，应为warning（黄色）', () => {
      expect(getStatus(5)).toBe('warning');
    });

    it('剩余3天，应为warning（黄色）', () => {
      expect(getStatus(3)).toBe('warning');
    });

    it('剩余2天，应为danger（红色）', () => {
      expect(getStatus(2)).toBe('danger');
    });

    it('剩余1天，应为danger（红色）', () => {
      expect(getStatus(1)).toBe('danger');
    });

    it('剩余0天（今天到期），应为expired（灰色）', () => {
      expect(getStatus(0)).toBe('expired');
    });

    it('剩余-1天（已过期），应为expired（灰色）', () => {
      expect(getStatus(-1)).toBe('expired');
    });

    it('剩余-5天（已过期5天），应为expired（灰色）', () => {
      expect(getStatus(-5)).toBe('expired');
    });
  });

  describe('getStatusColor - 获取状态颜色', () => {
    it('safe状态应为绿色#22c55e', () => {
      expect(getStatusColor('safe')).toBe('#22c55e');
    });

    it('warning状态应为黄色#eab308', () => {
      expect(getStatusColor('warning')).toBe('#eab308');
    });

    it('danger状态应为红色#ef4444', () => {
      expect(getStatusColor('danger')).toBe('#ef4444');
    });

    it('expired状态应为灰色#6b7280', () => {
      expect(getStatusColor('expired')).toBe('#6b7280');
    });
  });

  describe('getStatusBgColor - 获取状态背景颜色类名', () => {
    it('safe状态应为bg-green-500', () => {
      expect(getStatusBgColor('safe')).toBe('bg-green-500');
    });

    it('warning状态应为bg-yellow-500', () => {
      expect(getStatusBgColor('warning')).toBe('bg-yellow-500');
    });

    it('danger状态应为bg-red-500', () => {
      expect(getStatusBgColor('danger')).toBe('bg-red-500');
    });

    it('expired状态应为bg-gray-500', () => {
      expect(getStatusBgColor('expired')).toBe('bg-gray-500');
    });
  });

  describe('getStatusLightBgColor - 获取状态浅色背景颜色类名', () => {
    it('safe状态应为bg-green-50', () => {
      expect(getStatusLightBgColor('safe')).toBe('bg-green-50');
    });

    it('warning状态应为bg-yellow-50', () => {
      expect(getStatusLightBgColor('warning')).toBe('bg-yellow-50');
    });

    it('danger状态应为bg-red-50', () => {
      expect(getStatusLightBgColor('danger')).toBe('bg-red-50');
    });

    it('expired状态应为bg-gray-100', () => {
      expect(getStatusLightBgColor('expired')).toBe('bg-gray-100');
    });
  });

  describe('getStatusBorderColor - 获取状态边框颜色类名', () => {
    it('safe状态应为border-green-400', () => {
      expect(getStatusBorderColor('safe')).toBe('border-green-400');
    });

    it('warning状态应为border-yellow-400', () => {
      expect(getStatusBorderColor('warning')).toBe('border-yellow-400');
    });

    it('danger状态应为border-red-400', () => {
      expect(getStatusBorderColor('danger')).toBe('border-red-400');
    });

    it('expired状态应为border-gray-400', () => {
      expect(getStatusBorderColor('expired')).toBe('border-gray-400');
    });
  });

  describe('getStatusText - 获取状态文字', () => {
    it('safe状态应为"新鲜"', () => {
      expect(getStatusText('safe')).toBe('新鲜');
    });

    it('warning状态应为"尽快食用"', () => {
      expect(getStatusText('warning')).toBe('尽快食用');
    });

    it('danger状态应为"即将过期"', () => {
      expect(getStatusText('danger')).toBe('即将过期');
    });

    it('expired状态应为"已过期"', () => {
      expect(getStatusText('expired')).toBe('已过期');
    });
  });

  describe('getStatusTextColor - 获取状态文字颜色类名', () => {
    it('safe状态应为text-green-700', () => {
      expect(getStatusTextColor('safe')).toBe('text-green-700');
    });

    it('warning状态应为text-yellow-700', () => {
      expect(getStatusTextColor('warning')).toBe('text-yellow-700');
    });

    it('danger状态应为text-red-700', () => {
      expect(getStatusTextColor('danger')).toBe('text-red-700');
    });

    it('expired状态应为text-gray-600', () => {
      expect(getStatusTextColor('expired')).toBe('text-gray-600');
    });
  });

  describe('isTodayExpiring - 是否今天到期', () => {
    it('剩余0天，应为true（今天到期）', () => {
      expect(isTodayExpiring(0)).toBe(true);
    });

    it('剩余1天，应为false', () => {
      expect(isTodayExpiring(1)).toBe(false);
    });

    it('剩余-1天，应为false（已过期）', () => {
      expect(isTodayExpiring(-1)).toBe(false);
    });

    it('剩余7天，应为false', () => {
      expect(isTodayExpiring(7)).toBe(false);
    });
  });

  describe('综合测试：状态转换链', () => {
    it('从剩余10天到过期的完整状态转换', () => {
      const testCases: { remaining: number; expectedStatus: FoodStatus; expectedColor: string }[] = [
        { remaining: 10, expectedStatus: 'safe', expectedColor: '#22c55e' },
        { remaining: 8, expectedStatus: 'safe', expectedColor: '#22c55e' },
        { remaining: 7, expectedStatus: 'warning', expectedColor: '#eab308' },
        { remaining: 5, expectedStatus: 'warning', expectedColor: '#eab308' },
        { remaining: 3, expectedStatus: 'warning', expectedColor: '#eab308' },
        { remaining: 2, expectedStatus: 'danger', expectedColor: '#ef4444' },
        { remaining: 1, expectedStatus: 'danger', expectedColor: '#ef4444' },
        { remaining: 0, expectedStatus: 'expired', expectedColor: '#6b7280' },
        { remaining: -1, expectedStatus: 'expired', expectedColor: '#6b7280' },
      ];

      testCases.forEach(({ remaining, expectedStatus, expectedColor }) => {
        const status = getStatus(remaining);
        expect(status).toBe(expectedStatus);
        expect(getStatusColor(status)).toBe(expectedColor);
      });
    });
  });
});
