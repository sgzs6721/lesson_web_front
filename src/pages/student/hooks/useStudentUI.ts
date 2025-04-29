import { useClassRecordModal } from './useClassRecordModal';
import { useScheduleModal } from './useScheduleModal';
import { usePaymentModal } from './usePaymentModal';
import { useRefundTransferModal } from './useRefundTransferModal';
import { usePagination } from './usePagination';
import { useDeleteConfirm } from './useDeleteConfirm';
import { useExport } from './useExport';
import { Student } from '../types/student';

/**
 * 学员管理UI相关钩子的整合
 * @param students 学生列表
 * @param deleteStudent 删除学生的回调函数
 * @param addStudent 添加学生的回调函数 (新增)
 * @returns 整合的UI相关状态和函数
 */
export const useStudentUI = (
  students: Student[], 
  deleteStudent: (id: string) => void,
  addStudent?: (student: Omit<Student, 'id'> & { remainingClasses?: string; lastClassDate?: string }) => Student // 新增 addStudent 回调
) => {
  // 分页功能
  const paginationProps = usePagination();
  
  // 删除确认功能
  const deleteConfirmProps = useDeleteConfirm(deleteStudent);
  
  // 课程记录模态框功能
  const classRecordProps = useClassRecordModal();
  
  // 课表模态框功能
  const scheduleProps = useScheduleModal();
  
  // 缴费模态框功能
  const paymentProps = usePaymentModal();
  
  // 退费转课模态框功能 (传入 addStudent)
  const refundTransferProps = useRefundTransferModal(students, addStudent);
  
  // 导出功能
  const exportProps = useExport();
  
  return {
    // 分页相关
    pagination: {
      currentPage: paginationProps.currentPage,
      pageSize: paginationProps.pageSize,
      handlePaginationChange: paginationProps.handlePaginationChange
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
    
    // 退费转课相关
    refundTransfer: {
      isRefundTransferModalVisible: refundTransferProps.isRefundTransferModalVisible,
      refundTransferForm: refundTransferProps.refundTransferForm,
      currentStudent: refundTransferProps.currentStudent,
      transferStudentSearchResults: refundTransferProps.transferStudentSearchResults,
      isSearchingTransferStudent: refundTransferProps.isSearchingTransferStudent,
      selectedTransferStudent: refundTransferProps.selectedTransferStudent,
      handleRefund: refundTransferProps.handleRefund,
      handleTransfer: refundTransferProps.handleTransfer,
      handleTransferClass: refundTransferProps.handleTransferClass,
      handleRefundTransferOk: refundTransferProps.handleRefundTransferOk,
      handleRefundTransferCancel: refundTransferProps.handleRefundTransferCancel,
      handleSearchTransferStudent: refundTransferProps.handleSearchTransferStudent,
      handleSelectTransferStudent: refundTransferProps.handleSelectTransferStudent,
      isQuickAddStudentModalVisible: refundTransferProps.isQuickAddStudentModalVisible,
      quickAddStudentForm: refundTransferProps.quickAddStudentForm,
      showQuickAddStudentModal: refundTransferProps.showQuickAddStudentModal,
      handleQuickAddStudentOk: refundTransferProps.handleQuickAddStudentOk,
      handleQuickAddStudentCancel: refundTransferProps.handleQuickAddStudentCancel
    },
    
    // 导出相关
    export: {
      handleExport: exportProps.handleExport
    }
  };
}; 