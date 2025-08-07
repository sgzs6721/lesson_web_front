import { useState, useEffect } from 'react';
import { CourseSearchParams, CourseType, CourseStatus } from '../types/course';

export const useCourseSearch = (onSearch: (params: CourseSearchParams) => Promise<any>) => {
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState<CourseType[] | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<CourseStatus | undefined>(undefined);
  const [selectedCoach, setSelectedCoach] = useState<number[] | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<string | undefined>(undefined);
  const [sortField, setSortField] = useState<string | undefined>(undefined);
  const [campusId, setCampusId] = useState<number | undefined>(undefined);

  // 从localStorage获取当前校区ID
  useEffect(() => {
    const currentCampusId = localStorage.getItem('currentCampusId');
    if (currentCampusId) {
      setCampusId(Number(currentCampusId));
    }
  }, []);

  // 执行搜索
  const handleSearch = async () => {
    const params: CourseSearchParams = {
      searchText,
      selectedType,
      selectedStatus,
      selectedCoach,
      sortOrder,
      sortField,
      campusId
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
    setSelectedType(undefined);
    setSelectedStatus(undefined);
    setSelectedCoach(undefined);
    setSortOrder(undefined);
    setSortField(undefined);
    // 不重置campusId，保持校区筛选

    // 重置后自动搜索
    try {
      await onSearch({
        searchText: '',
        selectedType: undefined,
        selectedStatus: undefined,
        selectedCoach: undefined,
        sortOrder: undefined,
        sortField: undefined,
        campusId // 保留校区ID
      });
    } catch (error) {
      console.error('重置搜索失败:', error);
    }
  };

  return {
    searchParams: {
      searchText,
      selectedType,
      selectedStatus,
      selectedCoach,
      sortOrder,
      sortField,
      campusId
    },
    setSearchText,
    setSelectedType,
    setSelectedStatus,
    setSelectedCoach,
    setSortOrder,
    setSortField,
    setCampusId,
    handleSearch,
    handleReset
  };
};