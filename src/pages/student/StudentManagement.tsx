import React, { useState } from 'react';
import { Card, Typography, Row, Col, Button, ConfigProvider, Statistic, Space, Form } from 'antd';
import { PlusOutlined, ExportOutlined } from '@ant-design/icons';
import zhCN from 'antd/locale/zh_CN';
import StudentSearchBar from './components/StudentSearchBar';
import StudentTable from './components/StudentTable';
import StudentFormModal from './components/StudentFormModal';
import StudentDeleteModal from './components/StudentDeleteModal';
import ClassRecordModal from './components/ClassRecordModal';
import ScheduleModal from './components/ScheduleModal';
import PaymentModal from './components/PaymentModal';
import RefundTransferModal from './components/RefundTransferModal';
import AttendanceModal from './components/AttendanceModal';
import { useStudentUI } from './hooks/useStudentUI';
import { useDataForm } from './hooks/useDataForm';
import { getStudentAllCourses } from './utils/student';
import { courseOptions } from '@/pages/student/constants/options';
import { Student } from './types/student';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import './student.css';

const { Title, Text } = Typography;

// 设置 dayjs 使用中文
dayjs.locale('zh-cn');

const StudentManagement: React.FC = () => {
  // 使用数据和表单管理钩子（整合了数据、搜索、表单相关功能）
  const df = useDataForm();

  // 使用UI管理钩子（整合了分页、删除确认、课程记录、课表、缴费、退费转课、导出等功能）
  const ui = useStudentUI(df.data.students, df.data.deleteStudent, df.data.addStudent);

  const [attendanceModalVisible, setAttendanceModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [attendanceForm] = Form.useForm();

  const handleAttendance = (student: Student) => {
    setSelectedStudent(student);
    setAttendanceModalVisible(true);
  };

  const handleAttendanceOk = (values: any) => {
    console.log('打卡信息:', values);
    // TODO: 调用打卡 API
    setAttendanceModalVisible(false);
  };

  return (
    <ConfigProvider locale={zhCN}>
      <div className="student-management">
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Space align="baseline" size="middle">
              <Title level={4} style={{ marginBottom: 0 }}>学员管理</Title>
              <Text type="secondary">学员总数: <Text strong>{df.data.totalStudents}</Text></Text>
              <Text type="secondary">课程总数: <Text strong>{courseOptions.length}</Text></Text>
            </Space>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={df.form.showAddModal}
              style={{ marginRight: 8 }}
            >
              添加学员
            </Button>
          </Col>
        </Row>

        <Card style={{ marginBottom: 16 }}>
          {/* 搜索栏 */}
          <StudentSearchBar
            params={df.search.params}
            onSearch={df.search.handleSearch}
            onReset={df.search.handleReset}
            onExport={() => ui.export.handleExport(df.data.students)}
            onTextChange={df.search.setSearchText}
            onStatusChange={df.search.setSelectedStatus}
            onCourseChange={df.search.setSelectedCourse}
            onMonthChange={df.search.setEnrollMonth}
            onSortOrderChange={df.search.setSortOrder}
          />

          {/* 数据表格 */}
          <StudentTable
            data={df.data.students}
            loading={df.data.loading}
            pagination={{
              current: ui.pagination.currentPage,
              pageSize: ui.pagination.pageSize,
              total: df.data.totalStudents,
              onChange: ui.pagination.handlePaginationChange,
            }}
            onEdit={df.form.showEditModal}
            onClassRecord={ui.classRecord.showClassRecordModal}
            onPayment={ui.payment.showPaymentModal}
            onRefund={ui.refundTransfer.handleRefund}
            onTransfer={ui.refundTransfer.handleTransfer}
            onTransferClass={ui.refundTransfer.handleTransferClass}
            onDelete={ui.deleteConfirm.showDeleteConfirm}
            onAttendance={handleAttendance}
          />
        </Card>

        {/* 添加/编辑模态框 */}
        <StudentFormModal
          visible={df.form.visible}
          form={df.form.formInstance}
          editingStudent={df.form.editingStudent}
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
        />

        {/* 删除确认模态框 */}
        <StudentDeleteModal
          visible={ui.deleteConfirm.deleteModalVisible}
          onConfirm={ui.deleteConfirm.handleDeleteConfirm}
          onCancel={ui.deleteConfirm.handleCancelDelete}
        />

        {/* 课程记录模态框 */}
        <ClassRecordModal
          visible={ui.classRecord.classRecordModalVisible}
          student={ui.classRecord.studentClassRecords.student}
          records={ui.classRecord.studentClassRecords.records}
          onCancel={ui.classRecord.handleClassRecordModalCancel}
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
          student={ui.payment.currentStudent}
          form={ui.payment.paymentForm}
          coursesList={ui.payment.currentStudent ? getStudentAllCourses(ui.payment.currentStudent) : []}
          selectedCourse={ui.payment.selectedPaymentCourse}
          selectedCourseName={ui.payment.selectedPaymentCourseName}
          currentClassHours={ui.payment.currentClassHours}
          newClassHours={ui.payment.newClassHours}
          totalClassHours={ui.payment.totalClassHours}
          newValidUntil={ui.payment.newValidUntil}
          onOk={ui.payment.handlePaymentOk}
          onCancel={ui.payment.handlePaymentCancel}
          onCourseChange={ui.payment.handlePaymentCourseChange}
          onClassHoursChange={ui.payment.handleClassHoursChange}
          onValidUntilChange={ui.payment.handleValidUntilChange}
        />

        {/* 退费转课模态框 */}
        <RefundTransferModal
          visible={ui.refundTransfer.isRefundTransferModalVisible}
          form={ui.refundTransfer.refundTransferForm}
          operationType={ui.refundTransfer.refundTransferForm.getFieldValue('operationType') || 'refund'}
          student={ui.refundTransfer.currentStudent}
          studentCourses={ui.refundTransfer.currentStudent ? getStudentAllCourses(ui.refundTransfer.currentStudent).filter(
            course => course.status !== '未报名'
          ) : []}
          transferStudentSearchResults={ui.refundTransfer.transferStudentSearchResults}
          isSearchingTransferStudent={ui.refundTransfer.isSearchingTransferStudent}
          selectedTransferStudent={ui.refundTransfer.selectedTransferStudent}
          onCancel={ui.refundTransfer.handleRefundTransferCancel}
          onOk={ui.refundTransfer.handleRefundTransferOk}
          onSearchTransferStudent={ui.refundTransfer.handleSearchTransferStudent}
          onSelectTransferStudent={ui.refundTransfer.handleSelectTransferStudent}
          students={df.data.students}
          isQuickAddStudentModalVisible={ui.refundTransfer.isQuickAddStudentModalVisible}
          quickAddStudentForm={ui.refundTransfer.quickAddStudentForm}
          showQuickAddStudentModal={ui.refundTransfer.showQuickAddStudentModal}
          handleQuickAddStudentOk={ui.refundTransfer.handleQuickAddStudentOk}
          handleQuickAddStudentCancel={ui.refundTransfer.handleQuickAddStudentCancel}
        />

        <AttendanceModal
          visible={attendanceModalVisible}
          student={selectedStudent}
          form={attendanceForm}
          onCancel={() => setAttendanceModalVisible(false)}
          onOk={handleAttendanceOk}
        />
      </div>
    </ConfigProvider>
  );
};

export default StudentManagement;