import React from 'react';
import { Table } from 'antd';
import { Campus } from '../types/campus';
import { getTableColumns } from '../constants/tableColumns';

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
  const columns = getTableColumns(onEdit, onToggleStatus, onDelete);
  
  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      pagination={{
        current: currentPage,
        pageSize: pageSize,
        total: total,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: total => `共 ${total} 条记录`,
        onChange: onPageChange,
      }}
    />
  );
};

export default CampusTable; 