import { useState } from 'react';
import dayjs from 'dayjs';
import { ExpenseSearchParams } from '../types/expense';

export const useExpenseSearch = (onSearch: (params: ExpenseSearchParams) => void) => {
  const [text, setText] = useState('');
  const [searchCategories, setSearchCategories] = useState<string[]>([]);
  const [searchType, setSearchType] = useState<'income' | 'expense' | null>(null);
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
    setSearchType,
    setDateRange,
    handleSearch,
    handleReset
  };
}; 