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
  // 添加调试日志
  console.log('校区表格数据:', data);
  console.log('校区表格加载状态:', loading);
  console.log('校区表格总数:', total);

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
        pageSizeOptions: ['10', '20', '50', '100'],
        locale: {
          items_per_page: '条/页',
          jump_to: '跳至',
          jump_to_confirm: '确定',
          page: '页',
          prev_page: '上一页',
          next_page: '下一页',
          prev_5: '向前 5 页',
          next_5: '向后 5 页',
          prev_3: '向前 3 页',
          next_3: '向后 3 页'
        }
      }}
    />
  );
};

export default CampusTable;