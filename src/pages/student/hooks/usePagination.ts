import { useState } from 'react';

/**
 * 分页状态管理hook
 * @param defaultCurrentPage 默认当前页码
 * @param defaultPageSize 默认每页条数
 * @returns 分页相关状态和处理函数
 */
export const usePagination = (defaultCurrentPage = 1, defaultPageSize = 10) => {
  const [currentPage, setCurrentPage] = useState<number>(defaultCurrentPage);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  
  // 处理分页变化
  const handlePaginationChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) setPageSize(size);
  };
  
  return {
    currentPage,
    pageSize,
    handlePaginationChange
  };
}; 