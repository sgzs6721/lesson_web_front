import { useState } from 'react';
import { StudentSearchParams } from '../types/student';
import dayjs from 'dayjs';

export const useStudentSearch = (
  onSearch: (params: StudentSearchParams) => void
) => {
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [selectedCourse, setSelectedCourse] = useState<string | undefined>(undefined);
  const [enrollMonth, setEnrollMonth] = useState<dayjs.Dayjs | null>(null);
  const [sortOrder, setSortOrder] = useState<StudentSearchParams['sortOrder']>(undefined);

  // 处理搜索
  const handleSearch = () => {
    const params: StudentSearchParams = {
      searchText,
      selectedStatus,
      selectedCourse,
      enrollMonth,
      sortOrder
    };
    onSearch(params);
  };
  
  // 处理重置
  const handleReset = () => {
    setSearchText('');
    setSelectedStatus(undefined);
    setSelectedCourse(undefined);
    setEnrollMonth(null);
    setSortOrder(undefined);
    
    // 重置后自动搜索
    onSearch({
      searchText: '',
      selectedStatus: undefined,
      selectedCourse: undefined,
      enrollMonth: null,
      sortOrder: undefined
    });
  };
  
  return {
    searchParams: {
      searchText,
      selectedStatus,
      selectedCourse,
      enrollMonth,
      sortOrder
    },
    setSearchText,
    setSelectedStatus,
    setSelectedCourse,
    setEnrollMonth,
    setSortOrder,
    handleSearch,
    handleReset
  };
}; 