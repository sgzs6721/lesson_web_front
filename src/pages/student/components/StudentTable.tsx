import React from 'react';
import { Table, Empty, TablePaginationConfig } from 'antd';
import { Student } from '@/pages/student/types/student';
import { getStudentColumns } from '@/pages/student/constants/tableColumns';
import '../student.css';

interface StudentTableProps {
  data: Student[];
  loading: boolean;
  pagination: TablePaginationConfig & {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
    showSizeChanger?: boolean;
    showQuickJumper?: boolean;
    size?: 'default' | 'small';
    showTotal?: (total: number) => string;
    style?: React.CSSProperties;
  };
  onEdit: (record: Student) => void;
  onClassRecord: (student: Student) => void;
  onPayment?: (student: Student) => void;
  onRefund?: (student: Student) => void;
  onTransfer?: (student: Student) => void;
  onTransferClass?: (student: Student) => void;
  onDelete?: (id: string) => void;
  onAttendance?: (student: Student & { selectedCourseIdForAttendance?: number | string }) => void;
}

const StudentTable: React.FC<StudentTableProps> = ({
  data,
  loading,
  pagination,
  onEdit,
  onClassRecord,
  onPayment,
  onRefund,
  onTransfer,
  onTransferClass,
  onDelete,
  onAttendance,
}) => {
  // 创建各个回调函数的安全版本，避免undefined错误
  const safeOnPayment = onPayment || (() => {});
  const safeOnRefund = onRefund || (() => {});
  const safeOnTransfer = onTransfer || (() => {});
  const safeOnTransferClass = onTransferClass || (() => {});
  const safeOnDelete = onDelete || (() => {});
  const safeOnAttendance = onAttendance || ((_: Student & { selectedCourseIdForAttendance?: number | string }) => {});

  const columns = getStudentColumns(
    onEdit,
    onClassRecord,
    safeOnPayment,
    safeOnRefund,
    safeOnTransfer,
    safeOnTransferClass,
    safeOnDelete,
    safeOnAttendance,
  );

  // 不再需要自定义加载图标

  return (
    <div className="student-table-container">
      {/* 使用默认的Table加载效果 */}
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id" // 使用 Student 类型中的 id 字段作为唯一标识符
        loading={loading} // 与教练管理页面保持一致，使用简单的loading属性
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: pagination.showSizeChanger ?? true,
          showQuickJumper: pagination.showQuickJumper ?? true,
          showTotal: pagination.showTotal ?? (total => `共 ${total} 条记录`),
          onChange: pagination.onChange,
          size: pagination.size,
          style: pagination.style
        }}
        locale={{
          emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
        }}
      />
    </div>
  );
};

export default StudentTable;