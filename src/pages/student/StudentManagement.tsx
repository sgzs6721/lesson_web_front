import React, { useState, useEffect, useCallback } from 'react';
import { Card, ConfigProvider, Form, message, Spin } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import StudentHeader from './components/StudentHeader';
import StudentContent from './components/StudentContent';
import StudentModals from './components/StudentModals';
import { useStudentUI } from './hooks/useStudentUI';
import { useDataForm } from './hooks/useDataForm';
import { Student as ApiStudent } from '@/api/student/types';
import { Student as UiStudent } from '@/pages/student/types/student';
import { SimpleCourse } from '@/api/course/types';
import { getCourseSimpleList } from '@/api/course';
import { student } from '@/api/student';
import { statisticsApi, StudentManagementSummary } from '@/api/statistics';
import { CourseStatus } from '@/api/course/types';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import './student.css';
import './components/StudentManagement.css';
import './index.css'; // 引入全局样式
import { attendance as attendanceApi } from '@/api/attendance';

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
  // 添加状态存储过滤后的课程列表（只包含已发布课程）
  const [filteredCourseList, setFilteredCourseList] = useState<SimpleCourse[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  // 添加统计数据加载状态
  const [loadingStats, setLoadingStats] = useState(true);
  // 添加统计摘要数据
  const [summaryData, setSummaryData] = useState<StudentManagementSummary | null>(null);
  // 新增：记录当前表格排序（用于分页与过滤时透传）
  const [tableSortField, setTableSortField] = useState<string | undefined>('id');
  const [tableSortOrder, setTableSortOrder] = useState<'ascend' | 'descend' | null>('descend');

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
  const ui = useStudentUI(
    df.data.students as UiStudent[], 
    df.data.deleteStudent, 
    dummyAddStudentForUI,
    courseList // 传递courseList给useStudentUI钩子
  );

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

  // 获取统计摘要数据
  const fetchSummaryData = async () => {
    try {
      setLoadingStats(true);
      const response = await statisticsApi.getStudentManagementSummary(1); // 使用campusId=1
      
      if (response.code === 200 && response.data) {
        const summary = response.data as StudentManagementSummary;
        setSummaryData(summary);
        
        console.log('获取统计摘要数据成功:', summary);
      } else {
        console.error('获取统计摘要数据失败:', response);
      }
    } catch (error) {
      console.error('获取统计摘要数据异常:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  // 获取课程列表和学生数据
  useEffect(() => {
    const fetchInitialData = async () => {
      // 设置所有加载状态为true
      setLoadingCourses(true);
      setLoadingStats(true);
      
      try {
        // 同步获取数据，让两个请求一起发出
        const [courseData, studentData] = await Promise.all([
          getCourseSimpleList(undefined, false), // 获取所有状态的课程，用于筛选
          df.data.fetchStudents({
            pageNum: ui.pagination.currentPage,
            pageSize: ui.pagination.pageSize
          })
        ]);
        
        // 更新状态 - 使用所有课程数据
        setCourseList(courseData);
        setFilteredCourseList(courseData); // 筛选框显示所有课程
        
        console.log("初始化数据加载完成: 课程数量=", courseData.length, "学员数量=", studentData?.length || 0);
      } catch (error) {
        console.error('获取初始数据失败:', error);
        message.error('获取数据失败，请刷新页面重试');
      } finally {
        setLoadingCourses(false);
        setLoadingStats(false);
      }
    };

    fetchInitialData();
  }, []); // 只在组件挂载时执行一次，不依赖分页状态

  // 获取统计摘要数据
  useEffect(() => {
    fetchSummaryData();
  }, []);

  // 学员创建成功后的处理函数
  const handleStudentCreated = (event: CustomEvent) => {
    console.log('学员创建成功，刷新数据');
    // 刷新学员列表
    df.data.fetchStudents({
      pageNum: ui.pagination.currentPage,
      pageSize: ui.pagination.pageSize
    });
    // 刷新统计摘要数据
    fetchSummaryData();
  };

  // 监听学员创建成功事件
  useEffect(() => {
    const handleStudentCreatedEvent = (event: Event) => {
      handleStudentCreated(event as CustomEvent);
    };

    const handleRefreshEvent = () => {
      // 刷新列表
      df.data.fetchStudents({
        pageNum: ui.pagination.currentPage,
        pageSize: ui.pagination.pageSize
      });
      // 刷新统计摘要
      fetchSummaryData();
    };

    window.addEventListener('studentCreated', handleStudentCreatedEvent);
    window.addEventListener('student:list-summary:refresh', handleRefreshEvent);

    return () => {
      window.removeEventListener('studentCreated', handleStudentCreatedEvent);
      window.removeEventListener('student:list-summary:refresh', handleRefreshEvent);
    };
  }, [ui.pagination.currentPage, ui.pagination.pageSize]);

  // 监听表头排序变化，仅更新本地排序状态
  const handleTableSortChange = useCallback((field?: string, order?: 'ascend' | 'descend' | null) => {
    // 如果传入的是 name（已取消排序），忽略
    if (field === 'name') return;
    setTableSortField(field || 'id');
    setTableSortOrder(order ?? 'descend');
  }, []);

  // 自定义分页处理函数（携带当前排序）
  const handleCustomPaginationChange = (page: number, pageSize?: number) => {
    console.log('分页变化:', { page, pageSize });
    
    // 更新UI状态
    ui.pagination.handlePaginationChange(page, pageSize);
    
    // 重新获取数据，合并当前排序
    df.data.fetchStudents({
      pageNum: page,
      pageSize: pageSize || ui.pagination.pageSize,
      sortField: tableSortField,
      sortOrder: tableSortOrder === 'ascend' ? 'asc' : 'desc'
    } as any);
  };

  // 学员打卡处理函数
  const handleAttendance = (student: UiStudent & { attendanceCourse?: { id: number | string; name: string } }) => {
    console.log('处理学员打卡:', student);
    
    // 设置选中的学员
    setSelectedStudent(student);
    
    // 显示打卡模态框
    setAttendanceModalVisible(true);
  };

  // 学员打卡确认处理函数
  const handleAttendanceOk = (checkInData: { studentId: number; courseId: number; duration: number; type?: string }) => {
    console.log('学员打卡确认:', checkInData);
    
    try {
      // 调用本地更新函数
      df.data.updateStudentAttendanceLocally(
        checkInData.studentId,
        checkInData.courseId,
        checkInData.duration
      );
      
      // 关闭模态框
      setAttendanceModalVisible(false);
      
      // 显示成功消息
      message.success('打卡成功');
      
      // 刷新统计摘要数据
      fetchSummaryData();

      // 触发出勤记录列表与统计刷新（使用当前校区与简单默认分页）
      try {
        const campusId = Number(localStorage.getItem('currentCampusId')) || 1;
        // 并行触发，无需等待
        attendanceApi.getList({ campusId, pageNum: 1, pageSize: 10 });
        attendanceApi.getStatistics({ campusId, pageNum: 1, pageSize: 10 });
      } catch {}

      // 并行刷新学生列表（不阻塞 UI）
      df.data.fetchStudents({
        pageNum: ui.pagination.currentPage,
        pageSize: ui.pagination.pageSize
      });
      // 同时广播一下，便于其他模块监听
      try { window.dispatchEvent(new Event('student:list-summary:refresh')); } catch {}
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

  return (
    <ConfigProvider locale={zhCN}>
      <div className="student-management">
        <Card className="student-management-card">
          {/* 页面头部组件 */}
          <StudentHeader
            totalStudents={summaryData?.totalStudents || 0}
            studyingStudents={summaryData?.studyingStudents || 0}
            graduatedStudents={summaryData?.graduatedStudents || 0}
            expiredStudents={summaryData?.expiredStudents || 0}
            refundedStudents={summaryData?.refundedStudents || 0}
            pendingRenewalStudents={summaryData?.pendingRenewalStudents || 0}
            courseCount={summaryData?.totalStudentCourses || 0}
            loadingStats={loadingStats}
            loadingCourses={loadingCourses}
            onAddStudent={df.form.showAddModal}
          />

          {/* 页面主体内容组件 */}
          <StudentContent
            students={df.data.students as UiStudent[]}
            courseList={courseList}
            loadingCourses={loadingCourses}
            loading={df.data.loading}
            totalStudents={df.data.totalStudents}
            currentPage={ui.pagination.currentPage}
            pageSize={ui.pagination.pageSize}
            onPageChange={handleCustomPaginationChange}
            searchParams={df.search.params}
            onSearch={() => {
              // 使用当前排序进行搜索
              df.search.handleSearch();
            }}
            onReset={df.search.handleReset}
            onExport={() => ui.export.handleExport(df.data.students as UiStudent[])}
            onTextChange={df.search.setSearchText}
            onStatusChange={df.search.setSelectedStatus}
            onCourseChange={df.search.setSelectedCourse}
            onMonthChange={df.search.setEnrollMonth}
            onEdit={(record) => df.form.showEditModal(record as any)}
            onClassRecord={(record) => ui.classRecord.showClassRecordModal(record as any)}
            onPayment={(record) => ui.payment.showPaymentModal(record as any)}
            onRefund={(record) => ui.refund.handleRefund(record as any)}
            onTransfer={(record) => ui.transfer.handleTransfer(record as any, record.selectedCourseId)}
            onTransferClass={(record) => ui.transferClass.handleTransferClass(record as any)}
            onDelete={(record) => ui.deleteConfirm.showDeleteConfirm(record)}
            onAttendance={handleAttendance}
            onDetails={handleStudentDetails}
            onSortChange={handleTableSortChange}
          />
        </Card>

        {/* 所有模态框组件 */}
        <StudentModals
          df={df}
          ui={ui}
          courseList={courseList}
          filteredCourseList={filteredCourseList}
          loadingCourses={loadingCourses}
          attendanceModalVisible={attendanceModalVisible}
          selectedStudent={selectedStudent}
          attendanceForm={attendanceForm}
          detailsVisible={detailsVisible}
          currentStudentId={currentStudentId}
          handleAttendanceOk={handleAttendanceOk}
          handleDetailsModalClose={handleDetailsModalClose}
          setAttendanceModalVisible={setAttendanceModalVisible}
        />
      </div>
    </ConfigProvider>
  );
};

export default StudentManagement;