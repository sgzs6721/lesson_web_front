import React from 'react';
import { Table } from 'antd';
import { Course } from '../types/course';
import { getTableColumns } from '../constants/tableColumns';
import StandardPagination from '@/components/common/StandardPagination';

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
    <>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={false}
      />
      {total > 0 && (
        <StandardPagination
          current={currentPage}
          pageSize={pageSize}
          total={total}
          onChange={onPageChange}
          totalText="个课程"
        />
      )}
    </>
  );
};

export default CourseTable;