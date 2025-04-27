import React from 'react';
import { Table, Empty } from 'antd';
import { Student } from '@/pages/student/types/student';
import { getStudentColumns } from '@/pages/student/constants/tableColumns';
import '../student.css';

interface StudentTableProps {
  data: Student[];
  loading: boolean;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  onEdit: (record: Student) => void;
  onClassRecord: (student: Student) => void;
  onPayment: (student: Student) => void;
  onRefund: (student: Student) => void;
  onTransfer: (student: Student) => void;
  onTransferClass: (student: Student) => void;
  onDelete: (id: string) => void;
  onAttendance: (student: Student) => void;
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
  const columns = getStudentColumns(
    onEdit,
    onClassRecord,
    onPayment,
    onRefund,
    onTransfer,
    onTransferClass,
    onDelete,
    onAttendance,
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
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: total => `共 ${total} 条记录`,
          onChange: pagination.onChange
        }}
        locale={{
          emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
        }}
      />
    </div>
  );
};

export default StudentTable;