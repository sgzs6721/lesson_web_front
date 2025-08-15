import React from 'react';
import { Table } from 'antd';
import { Payment } from '../types/payment';
import { getTableColumns } from '../constants/tableColumns';
import StandardPagination from '@/components/common/StandardPagination';

interface PaymentTableProps {
  data: Payment[];
  loading?: boolean;
  total?: number;
  currentPage?: number;
  pageSize?: number;
  onViewReceipt: (record: Payment) => void;
  onDelete: (id: string) => void;
  onEdit?: (record: Payment) => void;
  onPageChange?: (page: number, pageSize: number) => void;
}

const PaymentTable: React.FC<PaymentTableProps> = ({
  data,
  loading = false,
  total = 0,
  currentPage = 1,
  pageSize = 10,
  onViewReceipt,
  onDelete,
  onEdit,
  onPageChange
}) => {
  const columns = getTableColumns(onViewReceipt, onDelete, onEdit);
  
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
      {onPageChange && (
        <StandardPagination
          current={currentPage}
          pageSize={pageSize}
          total={total}
          onChange={onPageChange}
          totalText="条缴费记录"
        />
      )}
    </>
  );
};

export default PaymentTable; 