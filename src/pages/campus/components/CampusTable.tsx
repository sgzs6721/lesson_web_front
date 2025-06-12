import React from 'react';
import { Table } from 'antd';
import { Campus } from '../types/campus';
import { getTableColumns } from '../constants/tableColumns';
import StandardPagination from '@/components/common/StandardPagination';

interface CampusTableProps {
  data: Campus[];
  loading: boolean;
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;
  onEdit: (record: Campus) => void;
  onToggleStatus: (record: Campus) => void;
  onDelete: (id: string, name: string) => void;
}

const CampusTable: React.FC<CampusTableProps> = ({
  data,
  loading,
  total,
  currentPage,
  pageSize,
  onPageChange,
  onEdit,
  onToggleStatus,
  onDelete
}) => {
  // 添加调试日志
  console.log('校区表格数据:', data);
  console.log('校区表格加载状态:', loading);
  console.log('校区表格总数:', total);

  const columns = getTableColumns(onEdit, onToggleStatus, onDelete);

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={false}
      />
      <StandardPagination
        current={currentPage}
        pageSize={pageSize}
        total={total}
        onChange={onPageChange}
        totalText="个校区"
      />
    </>
  );
};

export default CampusTable;