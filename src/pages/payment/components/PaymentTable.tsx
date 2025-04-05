import React from 'react';
import { Table } from 'antd';
import { Payment } from '../types/payment';
import { getTableColumns } from '../constants/tableColumns';

interface PaymentTableProps {
  data: Payment[];
  onViewReceipt: (record: Payment) => void;
  onDelete: (id: string) => void;
}

const PaymentTable: React.FC<PaymentTableProps> = ({
  data,
  onViewReceipt,
  onDelete
}) => {
  const columns = getTableColumns(onViewReceipt, onDelete);
  
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

export default PaymentTable; 