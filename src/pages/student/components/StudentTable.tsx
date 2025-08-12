import React, { useCallback, memo } from 'react';
import { Table, Empty, TablePaginationConfig } from 'antd';
import { Student } from '@/pages/student/types/student';
import { getStudentColumns } from '@/pages/student/constants/tableColumns';
import StandardPagination from '@/components/common/StandardPagination';
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
  onPayment?: (student: Student) => void;
  onRefund?: (student: Student) => void;
  onTransfer?: (student: Student & { selectedCourseId?: string }) => void;
  onTransferClass?: (student: Student) => void;
  onDelete?: (student: Student) => void;
  onAttendance?: (student: Student & { selectedCourseIdForAttendance?: number | string }) => void;
  onDetails?: (record: Student) => void;
  // 新增：排序变化回调（记录当前排序，供分页时使用）
  onSortChange?: (field?: string, order?: 'ascend' | 'descend' | null) => void;
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
  onSortChange,
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

  // 监听表格的排序变化，仅记录状态，不触发请求
  const handleTableChange = useCallback((_: any, __: any, sorter: any) => {
    const s = Array.isArray(sorter) ? sorter[0] : sorter;
    const fieldFromSorter: string | undefined = s?.columnKey || s?.field;
    const order: 'ascend' | 'descend' | null | undefined = s?.order ?? null;
    onSortChange?.(fieldFromSorter, order ?? null);
  }, [onSortChange]);

  return (
    <div className="student-table-container">
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        onChange={handleTableChange}
        pagination={false} // 禁用内置分页
        locale={{
          emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
        }}
        scroll={{ x: 'max-content' }} // 改为自适应内容宽度，而不是固定宽度
        rowClassName={() => 'student-table-row'} // 添加行类名，用于CSS选择器
      />
      <StandardPagination
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={pagination.total}
        onChange={pagination.onChange}
        totalText="个学员"
      />
    </div>
  );
});

export default StudentTable;