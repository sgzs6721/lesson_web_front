import { useState } from 'react';
import { message } from 'antd';
import { Dayjs } from 'dayjs';
import { CampusFilterParams } from '../types/campus';

export const useCampusFilter = () => {
  // 初始化过滤条件
  const [timeframe, setTimeframe] = useState<'month' | 'quarter' | 'year'>('month');
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  
  // 应用筛选条件
  const applyFilters = () => {
    // 实际项目中，这里应该根据筛选条件重新加载数据
    message.success(`已应用筛选条件：${timeframe}`);
  };
  
  // 重置筛选条件
  const resetFilters = () => {
    setTimeframe('month');
    setDateRange(null);
    // 实际项目中，这里应该重置数据到默认状态
    message.success('已重置筛选条件');
  };
  
  return {
    timeframe,
    dateRange,
    setTimeframe,
    setDateRange,
    applyFilters,
    resetFilters
  };
}; 