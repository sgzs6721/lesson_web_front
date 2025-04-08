import React from 'react';
import { Table } from 'antd';
import { Expense } from '../types/expense';
import { getTableColumns } from '../constants/tableColumns';

interface FinanceTableProps {
  data: Expense[];
  onEdit: (record: Expense) => void;
  onDelete: (id: string) => void;
  onViewDetails: (record: Expense) => void;
}

const FinanceTable: React.FC<FinanceTableProps> = ({
  data,
  onEdit,
  onDelete,
  onViewDetails
}) => {
  const columns = getTableColumns(onEdit, onDelete, onViewDetails);
  
  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      pagination={{ pageSize: 10 }}
      locale={{
        triggerDesc: '点击降序',
        triggerAsc: '点击升序',
        cancelSort: '取消排序'
      }}
    />
  );
};

export default FinanceTable; 