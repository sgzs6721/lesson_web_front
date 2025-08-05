import { useState } from 'react';
import { CoachSearchParams } from '../types/coach';

export const useCoachSearch = () => {
  // 搜索参数
  const [searchParams, setSearchParams] = useState<CoachSearchParams>({
    searchText: '',
    selectedStatus: undefined,
    selectedJobTitle: undefined,
    sortField: undefined
  });

  // 设置搜索文本
  const setSearchText = (value: string) => {
    setSearchParams(prev => ({ ...prev, searchText: value }));
  };

  // 设置状态过滤
  const setSelectedStatus = (value: string | undefined) => {
    setSearchParams(prev => ({ ...prev, selectedStatus: value }));
  };

  // 设置职位过滤
  const setSelectedJobTitle = (value: string | undefined) => {
    setSearchParams(prev => ({ ...prev, selectedJobTitle: value }));
  };

  // 设置排序字段
  const setSortField = (value: 'coachingDate' | 'hireDate' | 'status' | 'idNumber' | 'jobTitle' | 'gender' | undefined) => {
    setSearchParams(prev => ({ ...prev, sortField: value }));
  };

  // 重置搜索参数
  const resetSearchParams = () => {
    setSearchParams({
      searchText: '',
      selectedStatus: undefined,
      selectedJobTitle: undefined,
      sortField: undefined
    });
  };

  return {
    searchParams,
    setSearchText,
    setSelectedStatus,
    setSelectedJobTitle,
    setSortField,
    resetSearchParams
  };
};