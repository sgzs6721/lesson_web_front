import React from 'react';
import { Table } from 'antd';
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

  return (
    <div className="student-table-container">
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: total => `共 ${total} 条记录`,
          onChange: pagination.onChange
        }}
      />
    </div>
  );
};

export default StudentTable; 