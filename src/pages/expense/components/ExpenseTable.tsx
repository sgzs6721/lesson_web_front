import React from 'react';
import { Table } from 'antd';
import { Expense } from '../types/expense';
import { getTableColumns } from '../constants/tableColumns';
import StandardPagination from '@/components/common/StandardPagination';

interface FinanceTableProps {
  data: Expense[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
  };
  onEdit: (record: Expense) => void;
  onDelete: (id: string) => void;
  onViewDetails: (record: Expense) => void;
  onPageChange?: (page: number, pageSize?: number) => void;
}

const FinanceTable: React.FC<FinanceTableProps> = ({
  data,
  loading = false,
  pagination,
  onEdit,
  onDelete,
  onViewDetails,
  onPageChange
}) => {
  const columns = getTableColumns(onEdit, onDelete, onViewDetails);
  
  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={false}
        locale={{
          triggerDesc: '点击降序',
          triggerAsc: '点击升序',
          cancelSort: '取消排序'
        }}
      />
      {pagination && (
        <StandardPagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={(page, pageSize) => onPageChange?.(page, pageSize)}
          totalText="条财务记录"
        />
      )}
    </>
  );
};

export default FinanceTable; 