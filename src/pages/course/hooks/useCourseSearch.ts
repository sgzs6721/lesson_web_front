import { useState } from 'react';
import { CourseSearchParams } from '../types/course';

export const useCourseSearch = (onSearch: (params: CourseSearchParams) => Promise<any>) => {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<string | undefined>(undefined);

  // 执行搜索
  const handleSearch = async () => {
    const params: CourseSearchParams = {
      searchText,
      selectedCategory,
      selectedStatus,
      sortOrder
    };
    try {
      await onSearch(params);
    } catch (error) {
      console.error('搜索课程失败:', error);
    }
  };

  // 重置搜索条件
  const handleReset = async () => {
    setSearchText('');
    setSelectedCategory(undefined);
    setSelectedStatus(undefined);
    setSortOrder(undefined);

    // 重置后自动搜索
    try {
      await onSearch({
        searchText: '',
        selectedCategory: undefined,
        selectedStatus: undefined,
        sortOrder: undefined
      });
    } catch (error) {
      console.error('重置搜索失败:', error);
    }
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