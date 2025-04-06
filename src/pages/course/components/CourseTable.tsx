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

export default CourseTable; 