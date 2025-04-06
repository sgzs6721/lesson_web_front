import { useState } from 'react';
import { CourseSearchParams } from '../types/course';

export const useCourseSearch = (onSearch: (params: CourseSearchParams) => void) => {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<string | undefined>(undefined);
  
  // 执行搜索
  const handleSearch = () => {
    const params: CourseSearchParams = {
      searchText,
      selectedCategory,
      selectedStatus,
      sortOrder
    };
    onSearch(params);
  };
  
  // 重置搜索条件
  const handleReset = () => {
    setSearchText('');
    setSelectedCategory(undefined);
    setSelectedStatus(undefined);
    setSortOrder(undefined);
    
    // 重置后自动搜索
    onSearch({
      searchText: '',
      selectedCategory: undefined,
      selectedStatus: undefined,
      sortOrder: undefined
    });
  };
  
  return {
    searchParams: {
      searchText,
      selectedCategory,
      selectedStatus,
      sortOrder
    },
    setSearchText,
    setSelectedCategory,
    setSelectedStatus,
    setSortOrder,
    handleSearch,
    handleReset
  };
}; 