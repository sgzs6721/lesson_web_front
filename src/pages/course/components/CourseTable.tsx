import React from 'react';
import { Table } from 'antd';
import { Course } from '../types/course';
import { getTableColumns } from '../constants/tableColumns';

interface CourseTableProps {
  data: Course[];
  loading: boolean;
  currentPage: number;
  pageSize: number;
  total: number;
  onShowDetail: (record: Course) => void;
  onEdit: (record: Course) => void;
  onDelete: (id: string, name: string) => void;
  onPageChange: (page: number, pageSize: number) => void;
}

const CourseTable: React.FC<CourseTableProps> = ({
  data,
  loading,
  currentPage,
  pageSize,
  total,
  onShowDetail,
  onEdit,
  onDelete,
  onPageChange
}) => {
  const columns = getTableColumns(onEdit, onShowDetail, onDelete);

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      pagination={total > 0 ? {
        current: currentPage,
        pageSize: pageSize,
        total: total,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: total => `共 ${total} 条记录`,
        onChange: onPageChange,
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
      } : false}
    />
  );
};

export default CourseTable;