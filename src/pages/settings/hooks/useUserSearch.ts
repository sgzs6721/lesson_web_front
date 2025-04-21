import { useState } from 'react';
import { UserSearchParams, UserRole } from '../types/user';

export const useUserSearch = (onSearch: (params: UserSearchParams, page: number, pageSize: number) => void) => {
  const [searchText, setSearchText] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole[]>([]);
  const [selectedCampus, setSelectedCampus] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<'ENABLED' | 'DISABLED' | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 处理搜索
  const handleSearch = () => {
    const params: UserSearchParams = {
      searchText,
      selectedRole,
      selectedCampus,
      selectedStatus
    };
    setCurrentPage(1); // 搜索时重置到第一页
    onSearch(params, 1, pageSize);
  };

  // 处理重置
  const handleReset = () => {
    // 重置所有搜索条件
    setSearchText('');
    setSelectedRole([]);
    setSelectedCampus([]);
    setSelectedStatus(undefined);
    setCurrentPage(1);

    // 重置后立即触发搜索，使用空的搜索参数
    const emptyParams: UserSearchParams = {
      searchText: '',
      selectedRole: [],
      selectedCampus: [],
      selectedStatus: undefined
    };

    // 调用搜索函数并传入重置后的参数
    // 注意：在 UserManagement 中，这会触发 resetData 函数
    onSearch(emptyParams, 1, pageSize);
  };

  // 处理页面变化
  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);

    const params: UserSearchParams = {
      searchText,
      selectedRole,
      selectedCampus,
      selectedStatus
    };

    onSearch(params, page, pageSize);
  };

  return {
    searchParams: {
      searchText,
      selectedRole,
      selectedCampus,
      selectedStatus
    },
    pagination: {
      currentPage,
      pageSize,
      handlePageChange
    },
    setSearchText,
    setSelectedRole,
    setSelectedCampus,
    setSelectedStatus,
    handleSearch,
    handleReset
  };
};