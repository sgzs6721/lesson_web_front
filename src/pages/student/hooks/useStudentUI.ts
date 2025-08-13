import { useClassRecordModal } from './useClassRecordModal';
import { useScheduleModal } from './useScheduleModal';
import { usePaymentModal } from './usePaymentModal';
import useRefundModal from './useRefundModal';
import useTransferModal from './useTransferModal';
import useTransferClassModal from './useTransferClassModal';
import { usePagination } from './usePagination';
import { useDeleteConfirm } from './useDeleteConfirm';
import { useExport } from './useExport';
import { Student } from '../types/student';
import { useState, useCallback } from 'react';
import { SimpleCourse } from '@/api/course/types'; // 导入SimpleCourse类型
import useShareModal from './useShareModal';

/**
 * 学员管理UI相关钩子的整合
 * @param students 学生列表
 * @param deleteStudent 删除学生的回调函数
 * @param addStudent 添加学生的回调函数 (新增)
 * @param courseList 课程列表，从API获取的动态课程列表
 * @returns 整合的UI相关状态和函数
 */
export const useStudentUI = (
  students: Student[], 
  deleteStudent: (id: string) => void,
  addStudent?: (student: Omit<Student, 'id'> & { remainingClasses?: string; lastClassDate?: string }) => Student, // 新增 addStudent 回调
  courseList: SimpleCourse[] = [] // 添加courseList参数并设置默认值为空数组
) => {
  // --- 分页处理 ---
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 分页信息变更处理函数
  const handlePaginationChange = useCallback((page: number, size?: number) => {
    console.log(`[分页] 变更页码：当前第${page}页，每页${size || pageSize}条`);
    setCurrentPage(page);
    if (size) {
      setPageSize(size);
    }
  }, [pageSize]);

  // 删除确认功能
  const deleteConfirmProps = useDeleteConfirm(deleteStudent);
  
  // 课程记录模态框功能
  const classRecordProps = useClassRecordModal();
  
  // 课表模态框功能
  const scheduleProps = useScheduleModal();
  
  // 缴费模态框功能
  const paymentProps = usePaymentModal();
  
  // 退费模态框功能
  const refundProps = useRefundModal(
    students,
    courseList, // 传递courseList参数
    // 添加刷新回调函数，通过重新获取第一页数据刷新列表
    () => handlePaginationChange(1, pageSize)
  );
  
  // 转课模态框功能
  const transferProps = useTransferModal(
    students,
    courseList, // 传递courseList参数
    addStudent,
    // 添加刷新回调函数，通过重新获取第一页数据刷新列表
    () => handlePaginationChange(1, pageSize)
  );
  
  // 转班模态框功能
  const transferClassProps = useTransferClassModal(
    students,
    courseList, // 传递courseList参数
    // 添加刷新回调函数，通过重新获取第一页数据刷新列表
    () => handlePaginationChange(1, pageSize)
  );

  // 共享模态框功能
  const shareProps = useShareModal(courseList);
  
  // 导出功能
  const exportProps = useExport();
  
  return {
    // 分页相关
    pagination: {
      currentPage: currentPage,
      pageSize: pageSize,
      handlePaginationChange: handlePaginationChange
    },
    
    // 删除相关
    deleteConfirm: {
      deleteModalVisible: deleteConfirmProps.deleteModalVisible,
      recordToDelete: deleteConfirmProps.recordToDelete,
      showDeleteConfirm: deleteConfirmProps.showDeleteConfirm,
      handleDeleteConfirm: deleteConfirmProps.handleDeleteConfirm,
      handleCancelDelete: deleteConfirmProps.handleCancelDelete
    },
    
    // 课程记录相关
    classRecord: {
      classRecordModalVisible: classRecordProps.classRecordModalVisible,
      currentStudent: classRecordProps.currentStudent,
      classRecords: classRecordProps.classRecords,
      classRecordLoading: classRecordProps.classRecordLoading,
      classRecordPagination: classRecordProps.classRecordPagination,
      showClassRecordModal: classRecordProps.showClassRecordModal,
      handleClassRecordModalCancel: classRecordProps.handleClassRecordModalCancel,
      handleClassRecordTableChange: classRecordProps.handleClassRecordTableChange
    },
    
    // 课表相关
    schedule: {
      scheduleModalVisible: scheduleProps.scheduleModalVisible,
      studentSchedule: scheduleProps.studentSchedule,
      showScheduleModal: scheduleProps.showScheduleModal,
      handleScheduleModalCancel: scheduleProps.handleScheduleModalCancel
    },
    
    // 缴费相关
    payment: {
      paymentModalVisible: paymentProps.paymentModalVisible,
      currentStudent: paymentProps.currentStudent,
      paymentForm: paymentProps.paymentForm,
      selectedPaymentCourse: paymentProps.selectedPaymentCourse,
      selectedPaymentCourseName: paymentProps.selectedPaymentCourseName,
      currentClassHours: paymentProps.currentClassHours,
      newClassHours: paymentProps.newClassHours,
      totalClassHours: paymentProps.totalClassHours,
      newValidUntil: paymentProps.newValidUntil,
      showPaymentModal: paymentProps.showPaymentModal,
      handlePaymentOk: paymentProps.handlePaymentOk,
      handlePaymentCancel: paymentProps.handlePaymentCancel,
      handlePaymentCourseChange: paymentProps.handlePaymentCourseChange,
      handleClassHoursChange: paymentProps.handleClassHoursChange,
      handleValidUntilChange: paymentProps.handleValidUntilChange
    },
    
    // 退费相关
    refund: {
      visible: refundProps.visible,
      form: refundProps.form,
      currentStudent: refundProps.currentStudent,
      studentCourses: refundProps.studentCourses,
      handleRefund: refundProps.handleRefund,
      handleCancel: refundProps.handleCancel,
      handleSubmit: refundProps.handleSubmit
    },
    
    // 转课相关
    transfer: {
      visible: transferProps.visible,
      form: transferProps.form,
      currentStudent: transferProps.currentStudent,
      studentCourses: transferProps.studentCourses,
      searchResults: transferProps.searchResults,
      searchLoading: transferProps.searchLoading,
      availableStudents: transferProps.availableStudents,
      loading: transferProps.loading,
      setLoading: transferProps.setLoading,
      handleTransfer: transferProps.handleTransfer,
      handleCancel: transferProps.handleCancel,
      handleSearch: transferProps.handleSearch,
      handleSubmit: transferProps.handleSubmit,
      handleAddStudent: transferProps.handleAddStudent
    },
    
    // 转班相关
    transferClass: {
      visible: transferClassProps.visible,
      form: transferClassProps.form,
      currentStudent: transferClassProps.currentStudent,
      studentCourses: transferClassProps.studentCourses,
      courseList: transferClassProps.courseList,
      loading: transferClassProps.loading,
      setLoading: transferClassProps.setLoading,
      handleTransferClass: transferClassProps.handleTransferClass,
      handleCancel: transferClassProps.handleCancel,
      handleSubmit: transferClassProps.handleSubmit
    },

    // 共享相关
    share: {
      visible: shareProps.visible,
      form: shareProps.form,
      currentStudent: shareProps.currentStudent,
      loading: shareProps.loading,
      setLoading: shareProps.setLoading,
      handleShare: shareProps.handleShare,
      handleCancel: shareProps.handleCancel,
      handleSubmit: shareProps.handleSubmit
    },
    
    // 导出相关
    export: {
      handleExport: exportProps.handleExport
    }
  };
};