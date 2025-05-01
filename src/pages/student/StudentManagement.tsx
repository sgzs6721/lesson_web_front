import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Card, Typography, Row, Col, Button, ConfigProvider, Statistic, Space, Form, message, Spin, Tooltip, Input, Select, DatePicker, Table, Tag, Modal } from 'antd';
import { PlusOutlined, ExportOutlined, UserOutlined, ReadOutlined, SyncOutlined } from '@ant-design/icons';
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
import QuickAddStudentModal from './components/QuickAddStudentModal';
import StudentDetailsModal from './components/StudentDetailsModal';
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
import './index.css'; // 引入全局样式

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

// 在组件外部创建防抖函数工厂
const createDebounce = (fn: Function, delay: number) => {
  let timer: NodeJS.Timeout | null = null;
  
  return (...args: any[]) => {
    const execId = `debounce_${Date.now()}`;
    console.log(`[${execId}] 触发防抖函数`);
    
    if (timer) {
      console.log(`[${execId}] 清除之前的定时器`);
      clearTimeout(timer);
    }
    
    timer = setTimeout(() => {
      console.log(`[${execId}] 执行实际函数`);
      fn(...args);
      timer = null;
    }, delay);
  };
};

const StudentManagement: React.FC = () => {
  // 添加状态存储课程列表和加载状态
  const [courseList, setCourseList] = useState<SimpleCourse[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  // 添加统计数据加载状态
  const [loadingStats, setLoadingStats] = useState(true);

  // --- Pass student.createWithCourse as the API function ---
  // 使用类型断言解决类型不兼容问题
  const df = useDataForm(courseList, student.createWithCourse as any);
  // -------------------------------------------------------

  // 状态类型使用 UiStudent
  const [selectedStudent, setSelectedStudent] = useState<UiStudent | null>(null);

  // Define a dummy add function that matches the expected type signature for useStudentUI
  // but relies on df.form.handleSubmit for the actual API call.
  const dummyAddStudentForUI = (
    // Match the expected signature more closely, note the return type is Student, not Promise<Student>
    studentData: Omit<UiStudent, 'id'> & { remainingClasses?: string; lastClassDate?: string }
  ): UiStudent => {
      console.warn("dummyAddStudentForUI called, but actual add logic is in handleSubmit. This shouldn't happen if UI buttons trigger df.form.showAddModal.");
      // Return a placeholder/dummy ApiStudent to satisfy the type
      // Ensure all required ApiStudent fields have default/dummy values
      // 确保教练信息存在
      const coach = studentData.coach ?? '';
      if (!coach) {
        console.warn('学员缺少教练信息，尝试从课程中获取');
      }

      return {
          ...(studentData as Omit<UiStudent, 'id'>), // Spread assuming input matches UiStudent structure now
          id: 'temp-' + Date.now().toString(), // Temporary ID as string
          // Provide defaults for fields potentially missing in Omit<...> & {...}
          courseType: studentData.courseType ?? '',
          course: studentData.course ?? [],
          coach: coach, // 确保教练信息被正确传递
          lastClassDate: studentData.lastClassDate ?? '',
          expireDate: studentData.expireDate ?? '',
          // Correct remainingClasses type to string
          remainingClasses: String(studentData.remainingClasses || '0'), // Ensure it's a string
          status: studentData.status ?? 'normal',
          campusId: studentData.campusId ?? 1, // Assuming campusId is needed
          campusName: studentData.campusName ?? '',
          createdTime: studentData.createdTime ?? '',
          updatedTime: studentData.updatedTime ?? '',
          scheduleTimes: studentData.scheduleTimes ?? [],
          payments: studentData.payments ?? [],
          courseGroups: studentData.courseGroups ?? []
          // Ensure all required fields from UiStudent are present
       } as UiStudent; // Cast to UiStudent
  };

  // Pass df.data.deleteStudent and the dummy add function
  const ui = useStudentUI(df.data.students as UiStudent[], df.data.deleteStudent, dummyAddStudentForUI);

  // 修改打卡相关状态
  const [attendanceModalVisible, setAttendanceModalVisible] = useState(false);
  // 只有在模态框打开时才创建表单实例，避免未连接警告
  const [attendanceForm] = Form.useForm();

  // 在useEffect中确保表单实例和模态框状态同步
  useEffect(() => {
    if (!attendanceModalVisible) {
      // 模态框关闭时重置表单，避免内存泄漏
      attendanceForm.resetFields();
    }
  }, [attendanceModalVisible, attendanceForm]);

  // 获取课程列表和学生数据
  useEffect(() => {
    const fetchInitialData = async () => {
      // 设置所有加载状态为true
      setLoadingCourses(true);
      setLoadingStats(true);
      
      try {
        // 同步获取数据，让两个请求一起发出
        const [courseData, studentData] = await Promise.all([
          getCourseSimpleList(),
          df.data.fetchStudents({
            pageNum: ui.pagination.currentPage,
            pageSize: ui.pagination.pageSize
          })
        ]);
        
        // 更新状态
        setCourseList(courseData);
        console.log("初始化数据加载完成: 课程数量=", courseData.length, "学员数量=", studentData?.length || 0);
      } catch (error) {
        console.error("加载初始数据失败:", error);
        message.error("加载数据失败");
      } finally {
        // 同时更新所有loading状态
        setLoadingCourses(false);
        setLoadingStats(false);
      }
    };
    
    fetchInitialData();
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

  // 在组件内部创建防抖版本的分页处理函数
  const debouncedHandlePagination = useCallback((page: number, pageSize?: number) => {
    // 生成唯一操作ID，用于追踪整个分页过程
    const operationId = `page_${Date.now()}`;
    console.log(`[${operationId}] 分页操作执行: page=${page}, pageSize=${pageSize}`);
    
    // 同时设置所有loading状态
    setLoadingStats(true);
    setLoadingCourses(true);
    console.log(`[${operationId}] 已设置所有loading状态为true`);
    
    // 1. 先更新UI组件状态
    ui.pagination.handlePaginationChange(page, pageSize);
    console.log(`[${operationId}] 已更新UI分页状态: currentPage=${ui.pagination.currentPage}`);
    
    // 2. 直接调用API获取新数据
    const finalPageSize = pageSize || ui.pagination.pageSize;
    console.log(`[${operationId}] 即将调用API: pageNum=${page}, pageSize=${finalPageSize}`);
    
    df.data.fetchStudents({
      pageNum: page,
      pageSize: finalPageSize
    }).then(result => {
      console.log(`[${operationId}] API调用成功, 获取到${result?.length || 0}条数据`);
      return result;
    }).catch(error => {
      console.error(`[${operationId}] API调用失败:`, error);
      message.error('分页加载失败');
    }).finally(() => {
      console.log(`[${operationId}] API调用完成，重置所有loading状态`);
      // 同时重置所有loading状态
      setLoadingStats(false);
      setLoadingCourses(false);
    });
    
    console.log(`[${operationId}] 分页处理函数执行完毕`);
  }, [ui.pagination, df.data, setLoadingStats, setLoadingCourses]);

  // 应用防抖
  const handleCustomPaginationChange = createDebounce(debouncedHandlePagination, 200);

  const handleAttendance = (student: UiStudent & { attendanceCourse?: { id: number | string; name: string } }) => {
    // 获取传递过来的课程信息
    const attendanceCourse = student.attendanceCourse;

    // 确保课程信息存在
    if (!attendanceCourse || attendanceCourse.id === undefined || attendanceCourse.id === null) {
        message.error('无法确定要为哪个课程打卡');
        console.error('handleAttendance 缺少 attendanceCourse 信息', student);
        return;
    }

    // 准备传递给模态框的数据
    const studentForModal = {
      ...student,
      // 直接使用传递过来的课程ID和名称
      courseId: String(attendanceCourse.id), 
      courseName: attendanceCourse.name 
    };

    // 移除 studentForModal 中的临时属性，避免传递给 Modal
    delete studentForModal.attendanceCourse;

    console.log('传递给打卡模态框的学员信息:', studentForModal);

    // 先设置选中的学员，再打开模态框
    setSelectedStudent(studentForModal);
    // 打开模态框状态 - 确保Form实例先被创建再使用
    setAttendanceModalVisible(true);
  };

  const handleAttendanceOk = (checkInData: { studentId: number; courseId: number; duration: number }) => {
    // ★ 增加详细日志，检查传入的数据
    console.log('[handleAttendanceOk] 接收到打卡数据:', checkInData);
    if (typeof checkInData.studentId !== 'number' || typeof checkInData.courseId !== 'number' || typeof checkInData.duration !== 'number') {
        console.error('[handleAttendanceOk] 传入的 checkInData 类型不正确!', checkInData);
        message.error('打卡处理失败，数据类型错误');
        setAttendanceModalVisible(false);
        return;
    }
    if (checkInData.duration <= 0) {
      console.warn('[handleAttendanceOk] 消耗课时 duration 为 0 或负数，将不更新本地状态。打卡数据:', checkInData);
      // 可能仍然需要关闭模态框和显示通用成功消息，但不调用本地更新
       setAttendanceModalVisible(false);
       message.success(`${selectedStudent?.name || '学员'} 打卡记录成功（课时未扣除）`);
       // 不调用本地更新
       return; 
    }

    console.log(`[handleAttendanceOk] 准备调用本地更新: studentId=${checkInData.studentId}, courseId=${checkInData.courseId}, duration=${checkInData.duration}`);
    
    // 打卡成功后关闭模态框
    setAttendanceModalVisible(false);

    // 获取打卡学员信息 (用于显示提示)
    if (!selectedStudent) {
      console.warn('[handleAttendanceOk] 无法获取所选学员信息用于提示');
    }

    // 显示成功提示
    message.success(`${selectedStudent?.name || '学员'} 打卡成功，课时已扣除`);

    // 调用本地更新函数
    try {
      df.data.updateStudentAttendanceLocally(
        checkInData.studentId,
        checkInData.courseId,
        checkInData.duration
      );
      console.log('[handleAttendanceOk] 本地课时更新调用成功'); // 日志移到调用后
    } catch (error) {
      console.error('[handleAttendanceOk] 本地更新课时调用失败:', error);
      message.error('更新课时信息失败，请尝试刷新页面');
    }
  };

  // 学员详情处理函数
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState<string | null>(null);
  
  const handleStudentDetails = (student: UiStudent) => {
    console.log('查看学员详情:', student);
    setCurrentStudentId(student.id);
    setDetailsVisible(true);
  };
  
  const handleDetailsModalClose = () => {
    setDetailsVisible(false);
    setCurrentStudentId(null);
  };

  // 添加更多本地样式
  const statCardsStyle = {
    display: 'flex',
    gap: '16px',
    marginLeft: '24px',
  };

  const statCardStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)',
  };

  const studentCountStyle = {
    ...statCardStyle,
    borderLeft: '4px solid #1890ff',
  };

  const courseCountStyle = {
    ...statCardStyle,
    borderLeft: '4px solid #52c41a',
  };

  const statIconStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    fontSize: '20px',
    marginRight: '12px',
  };

  const studentIconStyle = {
    ...statIconStyle,
    backgroundColor: 'rgba(24, 144, 255, 0.1)',
    color: '#1890ff',
  };

  const courseIconStyle = {
    ...statIconStyle,
    backgroundColor: 'rgba(82, 196, 26, 0.1)',
    color: '#52c41a',
  };

  const statContentStyle = {
    display: 'flex',
    flexDirection: 'column',
  };

  const statValueStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#000',
    lineHeight: '1.2',
  };

  const statLabelStyle = {
    fontSize: '14px',
    color: 'rgba(0, 0, 0, 0.45)',
  };

  return (
    <ConfigProvider locale={zhCN}>
      <div className="student-management">
        <Card className="student-management-card">
          <div className="student-header">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Title level={4} className="student-title" style={{ marginRight: '24px', marginBottom: 0 }}>学员管理</Title>
              
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '4px 12px', 
                  backgroundColor: 'rgba(24, 144, 255, 0.1)', 
                  borderRadius: '8px', 
                  borderLeft: '4px solid #1890ff',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
                  height: '32px',
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '50%', 
                    backgroundColor: '#f0f5ff',
                    marginRight: '8px',
                    color: '#1890ff',
                    fontSize: '14px'
                  }}>
                    <UserOutlined />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.65)', marginRight: '8px' }}>
                      学员总数
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff', minWidth: '40px', textAlign: 'right', position: 'relative' }}>
                      {loadingStats ? (
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center',
                          width: '100%',
                          height: '100%'
                        }}>
                          <Spin size="small" />
                        </div>
                      ) : df.data.totalStudents}
                    </div>
                  </div>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '4px 12px', 
                  backgroundColor: 'rgba(82, 196, 26, 0.1)', 
                  borderRadius: '8px', 
                  borderLeft: '4px solid #52c41a',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
                  height: '32px',
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '50%', 
                    backgroundColor: '#f6ffed',
                    marginRight: '8px',
                    color: '#52c41a',
                    fontSize: '14px'
                  }}>
                    <ReadOutlined />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.65)', marginRight: '8px' }}>
                      课程总数
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#52c41a', minWidth: '40px', textAlign: 'right', position: 'relative' }}>
                      {loadingCourses ? (
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center',
                          width: '100%',
                          height: '100%'
                        }}>
                          <Spin size="small" />
                        </div>
                      ) : courseList.length}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
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
            onExport={() => ui.export.handleExport(df.data.students as UiStudent[])}
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
            data={df.data.students as UiStudent[]}
            loading={df.data.loading}
            pagination={{
              current: ui.pagination.currentPage,
              pageSize: ui.pagination.pageSize,
              total: df.data.totalStudents,
              onChange: handleCustomPaginationChange, // 直接传递我们的自定义处理函数
              showSizeChanger: false,
              showQuickJumper: true,
              size: 'small',
              showTotal: (total) => `共 ${total} 条`,
              style: { marginTop: '16px', textAlign: 'right' }
            }}
            onEdit={(record: UiStudent) => df.form.showEditModal(record as any)}
            onClassRecord={(record: UiStudent) => ui.classRecord.showClassRecordModal(record as any)}
            onPayment={(record: UiStudent) => ui.payment.showPaymentModal(record as any)}
            onRefund={(record: UiStudent) => ui.refundTransfer.handleRefund(record as any)}
            onTransfer={(record: UiStudent) => ui.refundTransfer.handleTransfer(record as any)}
            onTransferClass={(record: UiStudent) => ui.refundTransfer.handleTransferClass(record as any)}
            onDelete={(record: UiStudent) => ui.deleteConfirm.showDeleteConfirm(record)}
            onAttendance={handleAttendance}
            onDetails={handleStudentDetails}
          />
        </Card>

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
          courseList={courseList}
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
          courseSummaries={ui.classRecord.classRecords.reduce((acc: { courseName: string; count: number }[], record) => {
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
          operationType={ui.refundTransfer.isRefundTransferModalVisible ? (ui.refundTransfer.refundTransferForm.getFieldValue('operationType') || 'refund') : 'refund'}
          student={ui.refundTransfer.currentStudent as any}
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
          students={df.data.students as UiStudent[]}
          isQuickAddStudentModalVisible={ui.refundTransfer.isQuickAddStudentModalVisible}
          quickAddStudentForm={ui.refundTransfer.quickAddStudentForm}
          showQuickAddStudentModal={ui.refundTransfer.showQuickAddStudentModal}
          handleQuickAddStudentOk={ui.refundTransfer.handleQuickAddStudentOk}
          handleQuickAddStudentCancel={ui.refundTransfer.handleQuickAddStudentCancel}
        />

        {/* 快速添加学员模态框 */}
        <QuickAddStudentModal
          visible={ui.refundTransfer.isQuickAddStudentModalVisible}
          form={ui.refundTransfer.quickAddStudentForm}
          onOk={ui.refundTransfer.handleQuickAddStudentOk}
          onCancel={ui.refundTransfer.handleQuickAddStudentCancel}
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
          student={df.data.students.find(s => s.id === currentStudentId) || null}
          onCancel={handleDetailsModalClose}
        />
      </div>
    </ConfigProvider>
  );
};

export default StudentManagement;