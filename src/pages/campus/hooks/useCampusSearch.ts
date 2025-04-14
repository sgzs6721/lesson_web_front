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

  // 重置搜索条件并重新获取数据
  const handleReset = () => {
    setSearchText('');
    setSelectedStatus(undefined);

    // 重置后立即调用接口重新获取数据
    // 使用空的搜索参数
    setTimeout(() => {
      filterData({
        searchText: '',
        selectedStatus: undefined
      });
    }, 0);
  };

  return {
    searchParams,
    setSearchText,
    setSelectedStatus,
    handleSearch,
    handleReset
  };
};