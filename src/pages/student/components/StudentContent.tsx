import React from 'react';
import { Dispatch, SetStateAction } from 'react';
import StudentSearchBar from './StudentSearchBar';
import StudentTable from './StudentTable';
import { Student as UiStudent } from '@/pages/student/types/student';
import { SimpleCourse } from '@/api/course/types';

// 定义排序类型（已不再使用，但保留类型注释以避免破坏其他引用）
// type SortOrderType =
//   | 'enrollDateAsc'
//   | 'enrollDateDesc'
//   | 'ageAsc'
//   | 'ageDesc'
//   | 'remainingClassesAsc'
//   | 'remainingClassesDesc'
//   | 'lastClassDateAsc'
//   | 'lastClassDateDesc'
//   | undefined;

interface StudentContentProps {
  // 数据和状态
  students: UiStudent[];
  courseList: SimpleCourse[];
  loadingCourses: boolean;
  loading: boolean;
  totalStudents: number;
  
  // 分页
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number, pageSize?: number) => void;
  
  // 搜索相关
  searchParams: any;
  onSearch: () => void;
  onReset: () => void;
  onExport: () => void;
  onTextChange: (text: string) => void;
  onStatusChange: (status: string | undefined) => void;
  onCourseChange: (course: string | undefined) => void;
  onMonthChange: (month: any) => void;
  
  // 操作函数
  onEdit: (record: UiStudent) => void;
  onClassRecord: (record: UiStudent) => void;
  onPayment: (record: UiStudent) => void;
  onRefund: (record: UiStudent) => void;
  onTransfer: (record: UiStudent & { selectedCourseId?: string }) => void;
  onTransferClass: (record: UiStudent) => void;
  onDelete: (record: UiStudent) => void;
  onAttendance: (record: UiStudent & { attendanceCourse?: { id: number | string; name: string } }) => void;
  onDetails: (record: UiStudent) => void;
}

/**
 * 学员管理页面的主体内容组件，包含搜索栏和数据表格
 */
const StudentContent: React.FC<StudentContentProps> = ({
  students,
  courseList,
  loadingCourses,
  loading,
  totalStudents,
  currentPage,
  pageSize,
  onPageChange,
  searchParams,
  onSearch,
  onReset,
  onExport,
  onTextChange,
  onStatusChange,
  onCourseChange,
  onMonthChange,
  onEdit,
  onClassRecord,
  onPayment,
  onRefund,
  onTransfer,
  onTransferClass,
  onDelete,
  onAttendance,
  onDetails
}) => {
  return (
    <>
      {/* 搜索栏 */}
      <StudentSearchBar
        params={searchParams}
        onSearch={onSearch}
        onReset={onReset}
        onExport={onExport}
        onTextChange={onTextChange}
        onStatusChange={onStatusChange}
        onCourseChange={onCourseChange}
        onMonthChange={onMonthChange}
        courseList={courseList}
        loadingCourses={loadingCourses}
      />

      {/* 数据表格 */}
      <StudentTable
        data={students}
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalStudents,
          onChange: onPageChange
        }}
        onEdit={onEdit}
        onClassRecord={onClassRecord}
        onPayment={onPayment}
        onRefund={onRefund}
        onTransfer={onTransfer}
        onTransferClass={onTransferClass}
        onDelete={onDelete}
        onAttendance={onAttendance}
        onDetails={onDetails}
      />
    </>
  );
};

export default StudentContent; 