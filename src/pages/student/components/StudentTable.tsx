import React, { useCallback, memo } from 'react';
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
  onDetails?: (record: Student) => void;
}

// 使用React.memo包装组件以避免不必要的重渲染
const StudentTable: React.FC<StudentTableProps> = memo(({
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
  onDetails,
}) => {
  // 创建各个回调函数的安全版本，避免undefined错误
  const safeOnPayment = onPayment || (() => {});
  const safeOnRefund = onRefund || (() => {});
  const safeOnTransfer = onTransfer || (() => {});
  const safeOnTransferClass = onTransferClass || (() => {});
  const safeOnDelete = onDelete || (() => {});
  const safeOnAttendance = onAttendance || ((_: Student & { selectedCourseIdForAttendance?: number | string }) => {});
  const safeOnDetails = onDetails || (() => {});

  const columns = getStudentColumns(
    onEdit,
    onClassRecord,
    safeOnPayment,
    safeOnRefund,
    safeOnTransfer,
    safeOnTransferClass,
    safeOnDelete,
    safeOnAttendance,
    safeOnDetails,
  );

  // 使用自定义分页器，完全禁用Table组件的内置分页处理机制
  const customPagination = {
    current: pagination.current,
    pageSize: pagination.pageSize,
    total: pagination.total,
    showSizeChanger: pagination.showSizeChanger ?? false,
    showQuickJumper: pagination.showQuickJumper ?? true,
    showTotal: pagination.showTotal ?? (total => `共 ${total} 条记录`),
    size: pagination.size,
    style: pagination.style,
    // 关键：使用我们自己的分页处理函数，直接调用外部传入的onChange
    onChange: (page: number, pageSize?: number) => {
      console.log(`[PAGINATION] 分页器点击: page=${page}, pageSize=${pageSize}`);
      // 直接调用外部传入的onChange
      pagination.onChange(page, pageSize || pagination.pageSize);
    },
    onShowSizeChange: (current: number, size: number) => {
      console.log(`[PAGINATION] 改变每页显示: current=${current}, size=${size}`);
      pagination.onChange(current, size);
    }
  };
  
  // 彻底禁用表格的onChange事件处理
  const handleTableChange = useCallback(() => {
    // 什么都不做，彻底禁用表格的默认onChange行为
    console.log("[TABLE] 表格变化事件被拦截，不执行任何操作");
  }, []);

  return (
    <div className="student-table-container">
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id" 
        loading={loading}
        onChange={handleTableChange} // 使用空函数拦截表格变化事件
        pagination={customPagination} // 使用自定义分页配置
        locale={{
          emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
        }}
      />
    </div>
  );
});

export default StudentTable;