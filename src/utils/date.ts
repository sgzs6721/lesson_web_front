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

export default {
  safeDayjs,
  formatDate,
  isValidDate,
  compareDates
}; 