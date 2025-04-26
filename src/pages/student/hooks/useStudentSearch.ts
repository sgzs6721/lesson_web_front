import { useState } from 'react';
import { StudentUISearchParams } from '@/api/student/types';
import dayjs from 'dayjs';

export const useStudentSearch = (
  onSearch: (params: StudentUISearchParams) => Promise<any>
) => {
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [selectedCourse, setSelectedCourse] = useState<string | undefined>(undefined);
  const [enrollMonth, setEnrollMonth] = useState<dayjs.Dayjs | null>(null);
  const [sortOrder, setSortOrder] = useState<StudentUISearchParams['sortOrder']>(undefined);
  const [searching, setSearching] = useState(false);

  // 处理搜索
  const handleSearch = async () => {
    try {
      setSearching(true);
      const params: StudentUISearchParams = {
        searchText,
        selectedStatus,
        selectedCourse,
        enrollMonth,
        sortOrder
      };
      await onSearch(params);
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setSearching(false);
    }
  };

  // 处理重置
  const handleReset = async () => {
    // 重置搜索条件
    setSearchText('');
    setSelectedStatus(undefined);
    setSelectedCourse(undefined);
    setEnrollMonth(null);
    setSortOrder(undefined);

    // 重置后自动搜索，使用空参数
    try {
      setSearching(true);
      // 使用空参数调用搜索函数
      await onSearch({
        searchText: '',
        selectedStatus: undefined,
        selectedCourse: undefined,
        enrollMonth: null,
        sortOrder: undefined
      });
    } catch (error) {
      console.error('重置搜索失败:', error);
    } finally {
      setSearching(false);
    }
  };

  return {
    searchParams: {
      searchText,
      selectedStatus,
      selectedCourse,
      enrollMonth,
      sortOrder
    },
    searching,
    setSearchText,
    setSelectedStatus,
    setSelectedCourse,
    setEnrollMonth,
    setSortOrder,
    handleSearch,
    handleReset
  };
};