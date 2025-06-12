import React from 'react';
import { Table } from 'antd';
import { Expense } from '../types/expense';
import { getTableColumns } from '../constants/tableColumns';
import StandardPagination from '@/components/common/StandardPagination';

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
    <>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={false}
        locale={{
          triggerDesc: '点击降序',
          triggerAsc: '点击升序',
          cancelSort: '取消排序'
        }}
      />
      <StandardPagination
        current={1}
        pageSize={10}
        total={data.length}
        onChange={(page, pageSize) => {
          // 这里需要费用管理页面传递分页处理函数
          console.log('费用分页变化:', page, pageSize);
        }}
        totalText="条支出记录"
      />
    </>
  );
};

export default FinanceTable; 