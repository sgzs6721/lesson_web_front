import React from 'react';
import { Form } from 'antd';
import StudentFormModal from './StudentFormModal';
import StudentDeleteModal from './StudentDeleteModal';
import ClassRecordModal from './ClassRecordModal';
import ScheduleModal from './ScheduleModal';
import PaymentModal from './PaymentModal';
import RefundModal from './RefundModal';
import TransferModal from './TransferModal';
import TransferClassModal from './TransferClassModal';
import AttendanceModal from './AttendanceModal';
import QuickAddStudentModal from './QuickAddStudentModal';
import StudentDetailsModal from './StudentDetailsModal';
import { SimpleCourse } from '@/api/course/types';
import { Student as UiStudent } from '@/pages/student/types/student';
import { getStudentAllCourses } from '../utils/student';

interface StudentModalsProps {
  // 数据表单相关
  df: any;
  // UI状态与操作相关
  ui: any;
  // 课程列表
  courseList: SimpleCourse[];
  // 过滤后的课程列表（只包含已发布课程）
  filteredCourseList: SimpleCourse[];
  // 加载状态
  loadingCourses: boolean;
  // 打卡相关
  attendanceModalVisible: boolean;
  selectedStudent: UiStudent | null;
  attendanceForm: any;
  // 详情相关
  detailsVisible: boolean;
  currentStudentId: string | null;
  // 处理函数
  handleAttendanceOk: (checkInData: { studentId: number; courseId: number; duration: number }) => void;
  handleDetailsModalClose: () => void;
  setAttendanceModalVisible: (visible: boolean) => void;
}

/**
 * 学员管理页面所有模态框组件
 */
const StudentModals: React.FC<StudentModalsProps> = ({
  df,
  ui,
  courseList,
  filteredCourseList,
  loadingCourses,
  attendanceModalVisible,
  selectedStudent,
  attendanceForm,
  detailsVisible,
  currentStudentId,
  handleAttendanceOk,
  handleDetailsModalClose,
  setAttendanceModalVisible
}) => {
  return (
    <>
      {/* 添加/编辑模态框 */}
      <StudentFormModal
        visible={df.form.visible}
        form={df.form.form}
        editingStudent={df.form.editingStudent as any}
        courseGroups={df.form.courseGroups}
        tempCourseGroup={df.form.tempCourseGroup}
        currentEditingGroupIndex={df.form.currentEditingGroupIndex}
        isEditing={df.form.isEditing}
        onCancel={df.form.handleCancel}
        onSubmit={df.form.handleSubmit}
        updateTempCourseGroup={df.form.updateTempCourseGroup}
        updateCourseGroup={df.form.updateCourseGroup}
        confirmAddCourseGroup={df.form.confirmAddCourseGroup}
        cancelAddCourseGroup={df.form.cancelAddCourseGroup}
        editCourseGroup={df.form.editCourseGroup}
        removeCourseGroup={df.form.removeCourseGroup}
        startAddCourseGroup={df.form.startAddCourseGroup}
        courseList={df.form.courseList}
        loadingCourses={loadingCourses}
        loading={df.form.loading}
      />

      {/* 删除确认模态框 */}
      <StudentDeleteModal
        visible={ui.deleteConfirm.deleteModalVisible}
        onConfirm={ui.deleteConfirm.handleDeleteConfirm}
        onCancel={ui.deleteConfirm.handleCancelDelete}
        student={ui.deleteConfirm.recordToDelete || undefined}
      />

      {/* 课程记录模态框 */}
      <ClassRecordModal
        visible={ui.classRecord.classRecordModalVisible}
        student={ui.classRecord.currentStudent}
        records={ui.classRecord.classRecords}
        loading={ui.classRecord.classRecordLoading}
        pagination={ui.classRecord.classRecordPagination}
        onCancel={ui.classRecord.handleClassRecordModalCancel}
        onTableChange={ui.classRecord.handleClassRecordTableChange}
        courseSummaries={ui.classRecord.classRecords.reduce((acc: { courseName: string; count: number }[], record: any) => {
          if (!record.courseName) return acc;
          const existingCourse = acc.find(item => item.courseName === record.courseName);
          if (existingCourse) {
            existingCourse.count += 1;
          } else {
            acc.push({ courseName: record.courseName, count: 1 });
          }
          return acc;
        }, [])}
      />

      {/* 课表模态框 */}
      <ScheduleModal
        visible={ui.schedule.scheduleModalVisible}
        student={ui.schedule.studentSchedule.student}
        schedules={ui.schedule.studentSchedule.schedules}
        onCancel={ui.schedule.handleScheduleModalCancel}
      />

      {/* 缴费模态框 */}
      <PaymentModal
        visible={ui.payment.paymentModalVisible}
        student={ui.payment.currentStudent as any}
        form={ui.payment.paymentForm}
        coursesList={ui.payment.currentStudent ? getStudentAllCourses(ui.payment.currentStudent) : []}
        selectedCourse={ui.payment.selectedPaymentCourse}
        selectedCourseName={ui.payment.selectedPaymentCourseName}
        currentClassHours={ui.payment.currentClassHours}
        newClassHours={ui.payment.newClassHours}
        totalClassHours={ui.payment.totalClassHours}
        newValidUntil={ui.payment.newValidUntil}
        loading={(ui.payment as any)?.paymentLoading ?? false}
        onSuccess={ui.payment.handlePaymentOk}
        onCancel={ui.payment.handlePaymentCancel}
        onCourseChange={ui.payment.handlePaymentCourseChange}
        onClassHoursChange={ui.payment.handleClassHoursChange}
        onValidUntilChange={ui.payment.handleValidUntilChange}
      />

      {/* 退费模态框 */}
      <RefundModal
        visible={ui.refund.visible}
        form={ui.refund.form}
        student={ui.refund.currentStudent as any}
        studentCourses={ui.refund.studentCourses}
        onCancel={ui.refund.handleCancel}
        onOk={ui.refund.handleSubmit}
        submitting={ui.refund.submitting}
      />

      {/* 转课模态框 */}
      <TransferModal
        visible={ui.transfer.visible}
        form={ui.transfer.form}
        student={ui.transfer.currentStudent}
        studentCourses={ui.transfer.studentCourses}
        transferStudentSearchResults={ui.transfer.searchResults}
        isSearchingTransferStudent={ui.transfer.searchLoading}
        selectedTransferStudent={null}
        selectedCourseId={ui.transfer.currentStudent?.selectedCourseId}
        selectedCourseName={ui.transfer.currentStudent?.selectedCourseName}
        onCancel={ui.transfer.handleCancel}
        onOk={ui.transfer.handleSubmit}
        onSearchTransferStudent={ui.transfer.handleSearch}
        onSelectTransferStudent={() => {}}
        students={df.data.students as UiStudent[]}
        courseList={filteredCourseList}
        loading={ui.transfer.loading}
        setLoading={ui.transfer.setLoading}
      />

      {/* 转班模态框 */}
      <TransferClassModal
        visible={ui.transferClass.visible}
        form={ui.transferClass.form}
        student={ui.transferClass.currentStudent as any}
        studentCourses={ui.transferClass.studentCourses}
        selectedCourseId={ui.transferClass.currentStudent?.selectedCourseId}
        selectedCourseName={ui.transferClass.currentStudent?.selectedCourseName}
        onCancel={ui.transferClass.handleCancel}
        onOk={ui.transferClass.handleSubmit}
        setLoading={ui.transferClass.setLoading}
        courseList={filteredCourseList}
        loading={ui.transferClass.loading}
      />

      {/* 学员打卡模态框 */}
      {attendanceModalVisible && (
        <AttendanceModal
          visible={attendanceModalVisible}
          student={selectedStudent}
          form={attendanceForm}
          onCancel={() => setAttendanceModalVisible(false)}
          onOk={handleAttendanceOk}
        />
      )}

      {/* 学员详情模态框 */}
      <StudentDetailsModal
        visible={detailsVisible}
        student={df.data.students.find((s: UiStudent) => s.id === currentStudentId) || null}
        onCancel={handleDetailsModalClose}
      />
    </>
  );
};

export default StudentModals;