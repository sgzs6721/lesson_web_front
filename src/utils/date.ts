import dayjs, { Dayjs } from 'dayjs';

/**
 * 安全地创建dayjs对象，防止无效日期导致的错误
 * @param date 日期输入（字符串、日期对象、数组等）
 * @param fallback 如果创建失败时的回退值，默认为当前日期
 * @returns dayjs对象
 */
export const safeDayjs = (date: any, fallback: Dayjs = dayjs()): Dayjs => {
  try {
    if (!date) return fallback;

    // 处理日期数组格式 [年, 月, 日]
    if (Array.isArray(date) && date.length >= 3) {
      const [year, month, day] = date;
      // 确保月份和日期格式正确（两位数）
      const formattedMonth = String(month).padStart(2, '0');
      const formattedDay = String(day).padStart(2, '0');
      const dateString = `${year}-${formattedMonth}-${formattedDay}`;
      const result = dayjs(dateString);
      return result.isValid() ? result : fallback;
    }

    // 如果已经是dayjs对象
    if (date && typeof date === 'object' && date.isValid && typeof date.isValid === 'function') {
      return date.isValid() ? date : fallback;
    }

    // 其他情况尝试转换
    const result = dayjs(date);
    return result.isValid() ? result : fallback;
  } catch (error) {
    console.error('日期转换错误:', error);
    return fallback;
  }
};

/**
 * 格式化日期为字符串
 * @param date 要格式化的日期
 * @param format 日期格式，默认为 YYYY-MM-DD
 * @returns 格式化后的日期字符串
 */
export const formatDate = (date: any, format: string = 'YYYY-MM-DD'): string => {
  return safeDayjs(date).format(format);
};

/**
 * 检查日期是否有效
 * @param date 待检查的日期
 * @returns 是否有效
 */
export const isValidDate = (date: any): boolean => {
  try {
    if (!date) return false;
    
    // 处理日期数组格式
    if (Array.isArray(date)) {
      const [year, month, day] = date;
      const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return dayjs(dateString).isValid();
    }
    
    return dayjs(date).isValid();
  } catch (error) {
    return false;
  }
};

/**
 * 比较两个日期
 * @param date1 第一个日期
 * @param date2 第二个日期
 * @returns -1: date1早于date2, 0: 相等, 1: date1晚于date2
 */
export const compareDates = (date1: any, date2: any): number => {
  const d1 = safeDayjs(date1);
  const d2 = safeDayjs(date2);
  
  if (d1.isBefore(d2)) return -1;
  if (d1.isAfter(d2)) return 1;
  return 0;
};

/**
 * 获取当前周度的时间范围
 * @returns { start: string, end: string } 周的开始和结束日期
 */
export const getWeekRange = (): { start: string; end: string } => {
  const now = dayjs();
  const startOfWeek = now.startOf('week'); // 周一
  const endOfWeek = now.endOf('week'); // 周日
  
  return {
    start: startOfWeek.format('YYYY-MM-DD'),
    end: endOfWeek.format('YYYY-MM-DD')
  };
};

/**
 * 获取当前月度的时间范围
 * @returns { start: string, end: string } 月的开始和结束日期
 */
export const getMonthRange = (): { start: string; end: string } => {
  const now = dayjs();
  const startOfMonth = now.startOf('month');
  const endOfMonth = now.endOf('month');
  
  return {
    start: startOfMonth.format('YYYY-MM-DD'),
    end: endOfMonth.format('YYYY-MM-DD')
  };
};

/**
 * 获取当前季度的时间范围
 * @returns { start: string, end: string } 季度的开始和结束日期
 */
export const getQuarterRange = (): { start: string; end: string } => {
  const now = dayjs();
  const month = now.month(); // 0-11
  
  // 计算季度
  let startMonth, endMonth;
  if (month >= 0 && month <= 2) { // Q1: 1-3月
    startMonth = 0;
    endMonth = 2;
  } else if (month >= 3 && month <= 5) { // Q2: 4-6月
    startMonth = 3;
    endMonth = 5;
  } else if (month >= 6 && month <= 8) { // Q3: 7-9月
    startMonth = 6;
    endMonth = 8;
  } else { // Q4: 10-12月
    startMonth = 9;
    endMonth = 11;
  }
  
  const startOfQuarter = now.month(startMonth).startOf('month');
  const endOfQuarter = now.month(endMonth).endOf('month');
  
  return {
    start: startOfQuarter.format('YYYY-MM-DD'),
    end: endOfQuarter.format('YYYY-MM-DD')
  };
};

/**
 * 获取当前年度的时间范围
 * @returns { start: string, end: string } 年的开始和结束日期
 */
export const getYearRange = (): { start: string; end: string } => {
  const now = dayjs();
  const startOfYear = now.startOf('year');
  const endOfYear = now.endOf('year');
  
  return {
    start: startOfYear.format('YYYY-MM-DD'),
    end: endOfYear.format('YYYY-MM-DD')
  };
};

/**
 * 根据时间类型获取时间范围
 * @param timeframe 时间类型
 * @returns { start: string, end: string } 时间范围
 */
export const getTimeRange = (timeframe: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY'): { start: string; end: string } => {
  switch (timeframe) {
    case 'WEEKLY':
      return getWeekRange();
    case 'MONTHLY':
      return getMonthRange();
    case 'QUARTERLY':
      return getQuarterRange();
    case 'YEARLY':
      return getYearRange();
    default:
      return getWeekRange();
  }
};

export default {
  safeDayjs,
  formatDate,
  isValidDate,
  compareDates,
  getWeekRange,
  getMonthRange,
  getQuarterRange,
  getYearRange,
  getTimeRange
}; 