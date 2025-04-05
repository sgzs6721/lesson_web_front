import { useState } from 'react';
import { CampusSearchParams } from '../types/campus';

type FilterFunction = (params: CampusSearchParams) => void;

export const useCampusSearch = (filterData: FilterFunction) => {
  const [searchText, setSearchText] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  
  // 搜索参数
  const searchParams: CampusSearchParams = {
    searchText,
    selectedStatus
  };
  
  // 执行搜索
  const handleSearch = () => {
    filterData(searchParams);
  };
  
  // 重置搜索条件
  const handleReset = () => {
    setSearchText('');
    setSelectedStatus(undefined);
  };
  
  return {
    searchParams,
    setSearchText,
    setSelectedStatus,
    handleSearch,
    handleReset
  };
}; 