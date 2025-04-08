import { useState } from 'react';
import dayjs from 'dayjs';
import { ExpenseSearchParams } from '../types/expense';

export const useExpenseSearch = (onSearch: (params: ExpenseSearchParams) => void) => {
  const [searchText, setSearchText] = useState('');
  const [searchCategories, setSearchCategories] = useState<string[]>([]);
  const [searchType, setSearchType] = useState<'income' | 'expense' | null>(null);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  
  const handleSearch = () => {
    const params: ExpenseSearchParams = {
      searchText,
      searchCategories,
      dateRange,
      type: searchType
    };
    onSearch(params);
  };
  
  const handleReset = () => {
    setSearchText('');
    setSearchCategories([]);
    setSearchType(null);
    setDateRange(null);
    
    // 重置后自动搜索
    onSearch({
      searchText: '',
      searchCategories: [],
      dateRange: null,
      type: null
    });
  };
  
  return {
    searchParams: {
      searchText,
      searchCategories,
      dateRange,
      type: searchType
    },
    setSearchText,
    setSearchCategories,
    setSearchType,
    setDateRange,
    handleSearch,
    handleReset
  };
}; 