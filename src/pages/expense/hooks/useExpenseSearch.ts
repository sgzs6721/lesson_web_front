import { useState } from 'react';
import dayjs from 'dayjs';
import { ExpenseSearchParams } from '../types/expense';

export const useExpenseSearch = (onSearch: (params: ExpenseSearchParams) => void) => {
  const [text, setText] = useState('');
  const [searchCategories, setSearchCategories] = useState<string[]>([]);
  const [searchType, setSearchType] = useState<'EXPEND' | 'INCOME' | null>(null);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  
  const handleSearch = () => {
    const params: ExpenseSearchParams = {
      text,
      searchCategories,
      dateRange,
      type: searchType
    };
    onSearch(params);
  };
  
  // 切换交易类型时清空类别选择
  const handleTypeChange = (type: 'EXPEND' | 'INCOME' | null | undefined) => {
    // 将 undefined 转换为 null，保持一致性
    const normalizedType = type === undefined ? null : type;
    setSearchType(normalizedType);
    setSearchCategories([]); // 清空类别选择
  };
  
  const handleReset = () => {
    setText('');
    setSearchCategories([]);
    setSearchType(null);
    setDateRange(null);
    
    onSearch({
      text: '',
      searchCategories: [],
      dateRange: null,
      type: null
    });
  };
  
  return {
    searchParams: {
      text,
      searchCategories,
      dateRange,
      type: searchType
    },
    setSearchText: setText,
    setSearchCategories,
    setSearchType: handleTypeChange,
    setDateRange,
    handleSearch,
    handleReset
  };
};