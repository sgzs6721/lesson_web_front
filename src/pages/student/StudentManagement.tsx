import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Row, Col, Button, ConfigProvider, Statistic, Space, Form, message } from 'antd';
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
import { Student as ApiStudent } from '@/api/student/types';
import { Student as UiStudent } from '@/pages/student/types/student';
import { SimpleCourse } from '@/api/course/types';
import { getCourseSimpleList } from '@/api/course';
import { student } from '@/api/student';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import './student.css';
import './components/StudentManagement.css';

const { Title, Text } = Typography;

// 设置 dayjs 使用中文
dayjs.locale('zh-cn');

// 类型转换函数
const convertApiStudentToUiStudent = (apiStudent: ApiStudent): UiStudent => {
  // 确保教练信息存在
  const coach = apiStudent.coach ?? '';
  if (!coach) {
    console.warn('学员缺少教练信息:', apiStudent.id);
  }

  return {
    ...apiStudent, // 先复制所有兼容的属性
    // 显式转换或提供默认值给不兼容或 UI 特有的字段
    courseType: apiStudent.courseType ?? '',
    course: apiStudent.course ?? [],
    coach: coach, // 确保教练信息被正确传递
    lastClassDate: apiStudent.lastClassDate ?? '',
    expireDate: apiStudent.expireDate ?? '',
    // 将 number? 转换为 string，并提供默认值 '0'
    remainingClasses: apiStudent.remainingClasses?.toString() ?? '0',
    status: apiStudent.status ?? 'normal',
    campusName: apiStudent.campusName ?? '',
    createdTime: apiStudent.createdTime ?? '',
    updatedTime: apiStudent.updatedTime ?? '',
    scheduleTimes: apiStudent.scheduleTimes ?? [],
    payments: apiStudent.payments ?? [],
    courseGroups: apiStudent.courseGroups ?? [],
    // 确保所有 UiStudent 必需的字段都被覆盖
    id: apiStudent.id,
    name: apiStudent.name,
    gender: apiStudent.gender,
    age: apiStudent.age,
    phone: apiStudent.phone,
    enrollDate: apiStudent.enrollDate,
    campusId: apiStudent.campusId
  };
};

const StudentManagement: React.FC = () => {
  // 添加状态存储课程列表和加载状态
  const [courseList, setCourseList] = useState<SimpleCourse[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  // --- Pass student.createWithCourse as the API function ---
  const df = useDataForm(courseList, student.createWithCourse);
  // -------------------------------------------------------

  const uiStudents: UiStudent[] = df.data.students.map(convertApiStudentToUiStudent);

  // 状态类型使用 UiStudent
  const [selectedStudent, setSelectedStudent] = useState<UiStudent | null>(null);

  // Define a dummy add function that matches the expected type signature for useStudentUI
  // but relies on df.form.handleSubmit for the actual API call.
  const dummyAddStudentForUI = (
    // Match the expected signature more closely, note the return type is Student, not Promise<Student>
    studentData: Omit<ApiStudent, 'id'> & { remainingClasses?: string; lastClassDate?: string }
  ): ApiStudent => {
      console.warn("dummyAddStudentForUI called, but actual add logic is in handleSubmit. This shouldn't happen if UI buttons trigger df.form.showAddModal.");
      // Return a placeholder/dummy ApiStudent to satisfy the type
      // Ensure all required ApiStudent fields have default/dummy values
      // 确保教练信息存在
      const coach = studentData.coach ?? '';
      if (!coach) {
        console.warn('学员缺少教练信息，尝试从课程中获取');
      }

      return {
          ...(studentData as Omit<ApiStudent, 'id'>), // Spread assuming input matches ApiStudent structure now
          id: 'temp-' + Date.now().toString(), // Temporary ID as string
          // Provide defaults for fields potentially missing in Omit<...> & {...}
          courseType: studentData.courseType ?? '',
          course: studentData.course ?? [],
          coach: coach, // 确保教练信息被正确传递
          lastClassDate: studentData.lastClassDate ?? '',
          expireDate: studentData.expireDate ?? '',
          // Correct remainingClasses type to string
          remainingClasses: String(studentData.remainingClasses || '0'), // Ensure it's a string
          status: studentData.status ?? 'NORMAL',
          campusId: studentData.campusId ?? 1, // Assuming campusId is needed
          campusName: studentData.campusName ?? '',
          createdTime: studentData.createdTime ?? '',
          updatedTime: studentData.updatedTime ?? '',
          scheduleTimes: studentData.scheduleTimes ?? [],
          payments: studentData.payments ?? [],
          courseGroups: studentData.courseGroups ?? []
          // Ensure all required fields from ApiStudent are present
       } as ApiStudent; // Cast to ApiStudent
  };

  // Pass df.data.deleteStudent and the dummy add function
  const ui = useStudentUI(uiStudents, df.data.deleteStudent, dummyAddStudentForUI);

  // 添加打卡相关状态
  const [attendanceModalVisible, setAttendanceModalVisible] = useState(false);
  const [attendanceForm] = Form.useForm();

  // 获取课程列表
  useEffect(() => {
    const fetchCourses = async () => {
      setLoadingCourses(true);
      try {
        const data = await getCourseSimpleList();
        setCourseList(data);
      } catch (error) {
        console.error("Failed to load courses in StudentManagement", error);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  // 监听学员创建事件，直接将新学员添加到列表开头
  useEffect(() => {
    const handleStudentCreated = (event: CustomEvent) => {
      console.log('Student created event detected, adding to list:', event.detail?.student);

      if (event.detail?.student) {
        // 直接将新学员添加到列表开头，而不是重新调用 API
        df.data.addNewStudentToList(event.detail.student);
      }
    };

    // 添加事件监听器
    window.addEventListener('studentCreated', handleStudentCreated as EventListener);

    // 清理函数
    return () => {
      window.removeEventListener('studentCreated', handleStudentCreated as EventListener);
    };
  }, []);

  // 在组件挂载时获取学员列表，使用useRef确保只调用一次
  const isInitialMount = useRef(true);
  const isLoadingRef = useRef(false); // 添加一个引用来跟踪加载状态

  // 自定义分页处理函数，确保分页变化时正确调用fetchStudents函数
  const handleCustomPaginationChange = (page: number, pageSize?: number) => {
    // 首先更新UI组件的分页状态
    ui.pagination.handlePaginationChange(page, pageSize);

    // 然后调用fetchStudents函数获取数据
    // 使用isLoadingRef来避免重复调用
    if (!isLoadingRef.current) {
      isLoadingRef.current = true;
      df.data.fetchStudents({
        page,
        pageSize: pageSize || ui.pagination.pageSize
      }).catch(error => {
        console.error('分页加载失败:', error);
        message.error('分页加载失败');
      }).finally(() => {
        isLoadingRef.current = false;
      });
    }
  };

  useEffect(() => {
    // 只在首次挂载时获取学员列表
    if (isInitialMount.current) {
      isInitialMount.current = false;

      df.data.fetchStudents({
        page: ui.pagination.currentPage,
        pageSize: ui.pagination.pageSize
      }).catch(error => {
        console.error('加载学员列表失败:', error);
        message.error('加载学员列表失败');
      });
    }
  }, []);

  const handleAttendance = (student: UiStudent) => {
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
        <Card className="student-management-card">
          <div className="student-header">
            <Space align="baseline" size="middle">
              <Title level={4} className="student-title">学员管理</Title>
              <Text type="secondary">学员总数: <Text strong>{df.data.totalStudents}</Text></Text>
              <Text type="secondary">课程总数: <Text strong>{courseList.length}</Text></Text>
            </Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={df.form.showAddModal}
              className="add-student-button"
              style={{
                background: 'linear-gradient(135deg, #52c41a, #1890ff)',
                border: 'none',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                fontWeight: 500,
                borderRadius: '8px',
                transition: 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)'
              }}
            >
              添加学员
            </Button>
          </div>
          {/* 搜索栏 */}
          <StudentSearchBar
            params={df.search.params}
            onSearch={df.search.handleSearch}
            onReset={df.search.handleReset}
            onExport={() => ui.export.handleExport(uiStudents)}
            onTextChange={df.search.setSearchText}
            onStatusChange={df.search.setSelectedStatus}
            onCourseChange={df.search.setSelectedCourse}
            onMonthChange={df.search.setEnrollMonth}
            onSortOrderChange={df.search.setSortOrder}
            courseList={courseList}
            loadingCourses={loadingCourses}
          />

          {/* 数据表格 */}
          <StudentTable
            data={uiStudents}
            loading={df.data.loading}
            pagination={{
              current: ui.pagination.currentPage,
              pageSize: ui.pagination.pageSize,
              total: df.data.totalStudents,
              onChange: handleCustomPaginationChange, // 使用自定义分页处理函数
            }}
            onEdit={(record: UiStudent) => df.form.showEditModal(record as ApiStudent)}
            onClassRecord={(record: UiStudent) => ui.classRecord.showClassRecordModal(record as ApiStudent)}
            onPayment={(record: UiStudent) => ui.payment.showPaymentModal(record as ApiStudent)}
            onRefund={(record: UiStudent) => ui.refundTransfer.handleRefund(record as ApiStudent)}
            onTransfer={(record: UiStudent) => ui.refundTransfer.handleTransfer(record as ApiStudent)}
            onTransferClass={(record: UiStudent) => ui.refundTransfer.handleTransferClass(record as ApiStudent)}
            onDelete={ui.deleteConfirm.showDeleteConfirm}
            onAttendance={handleAttendance}
          />
        </Card>

        {/* 添加/编辑模态框 */}
        <StudentFormModal
          visible={df.form.visible}
          form={df.form.form}
          editingStudent={df.form.editingStudent ? convertApiStudentToUiStudent(df.form.editingStudent) : null}
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
          courseList={courseList}
          loadingCourses={loadingCourses}
          loading={df.form.loading}
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
          student={ui.classRecord.studentClassRecords.student ? convertApiStudentToUiStudent(ui.classRecord.studentClassRecords.student) : null}
          records={ui.classRecord.studentClassRecords.records}
          loading={(ui.classRecord as any)?.classRecordLoading ?? false}
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
          student={ui.payment.currentStudent ? convertApiStudentToUiStudent(ui.payment.currentStudent) : null}
          form={ui.payment.paymentForm}
          coursesList={ui.payment.currentStudent ? getStudentAllCourses(ui.payment.currentStudent) : []}
          selectedCourse={ui.payment.selectedPaymentCourse}
          selectedCourseName={ui.payment.selectedPaymentCourseName}
          currentClassHours={ui.payment.currentClassHours}
          newClassHours={ui.payment.newClassHours}
          totalClassHours={ui.payment.totalClassHours}
          newValidUntil={ui.payment.newValidUntil}
          loading={(ui.payment as any)?.paymentLoading ?? false}
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
          student={ui.refundTransfer.currentStudent ? convertApiStudentToUiStudent(ui.refundTransfer.currentStudent) : null}
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
          students={uiStudents}
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