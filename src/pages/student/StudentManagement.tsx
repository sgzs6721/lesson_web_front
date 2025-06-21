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
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import './student.css';
import './components/StudentManagement.css';
import './index.css'; // 引入全局样式

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
  // 添加不同状态的学员数量统计
  const [studyingStudents, setStudyingStudents] = useState(0);
  const [graduatedStudents, setGraduatedStudents] = useState(0);
  const [expiredStudents, setExpiredStudents] = useState(0);
  const [refundedStudents, setRefundedStudents] = useState(0);

  // --- Pass student.createWithCourse as the API function ---
  // 使用类型断言解决类型不兼容问题
  const df = useDataForm(filteredCourseList, student.createWithCourse as any);
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

  // 获取课程列表和学生数据
  useEffect(() => {
    const fetchInitialData = async () => {
      // 设置所有加载状态为true
      setLoadingCourses(true);
      setLoadingStats(true);
      
      try {
        // 同步获取数据，让两个请求一起发出
        const [courseData, studentData] = await Promise.all([
          getCourseSimpleList(undefined, false), // 设置filterPublished为false，获取所有课程
          df.data.fetchStudents({
            pageNum: ui.pagination.currentPage,
            pageSize: ui.pagination.pageSize
          })
        ]);
        
        // 更新状态 - 统一使用所有课程数据
        setCourseList(courseData);
        
        // 过滤出已发布的课程用于添加学员时的课程选择
        const publishedCourses = courseData.filter(course => 
          course.status === '1' || course.status === 'PUBLISHED'
        );
        setFilteredCourseList(publishedCourses);
        
        console.log("初始化数据加载完成: 课程数量=", courseData.length, "已发布课程数量=", publishedCourses.length, "学员数量=", studentData?.length || 0);
        
        // 计算不同状态的学员数量
        if (studentData && Array.isArray(studentData)) {
          const studying = studentData.filter(s => {
            const status = String(s.status).toUpperCase();
            return status === 'NORMAL' || status === 'STUDYING';
          }).length;
          
          const graduated = studentData.filter(s => {
            const status = String(s.status).toUpperCase();
            return status === 'GRADUATED';
          }).length;
          
          const expired = studentData.filter(s => {
            const status = String(s.status).toUpperCase();
            return status === 'EXPIRED';
          }).length;
          
          const refunded = studentData.filter(s => {
            const status = String(s.status).toUpperCase();
            return status === 'REFUNDED';
          }).length;
          
          setStudyingStudents(studying);
          setGraduatedStudents(graduated);
          setExpiredStudents(expired);
          setRefundedStudents(refunded);
        }
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
    // 学员创建事件处理器
    const handleStudentCreated = (event: CustomEvent) => {
      console.log('学员创建事件触发，正在处理...');
      
      try {
        if (!event.detail || !event.detail.student) {
          console.warn('学员创建事件缺少学员数据');
          return;
        }
        
        // 确保学员数据满足最低要求
        const newStudent = event.detail.student;
        if (!newStudent.id) {
          console.warn('新创建的学员缺少ID，无法添加到列表');
          return;
        }
        
        console.log('新创建的学员数据:', newStudent);
        
        // 检查是否已存在相同ID的学员，避免重复添加
        const existingStudent = df.data.students.find(
          s => s.id === newStudent.id || s.studentId === newStudent.studentId
        );
        
        if (existingStudent) {
          console.log('学员已存在，跳过添加:', existingStudent);
          return;
        }
        
        console.log('添加新学员到列表...');
        // 添加学员到列表的第一位
        df.data.addNewStudentToList(event.detail.student);
        
        // 如果在搜索状态下，考虑清除搜索状态并显示所有学员
        if (df.search.params.searchText || df.search.params.selectedStatus) {
          console.log('检测到处于搜索状态，清除搜索参数以显示新添加的学员');
          df.search.handleReset();
        }
      } catch (error) {
        console.error('处理学员创建事件失败:', error);
        message.error('无法显示新添加的学员，请刷新页面');
      }
    };

    // 添加事件监听器
    window.addEventListener('studentCreated', handleStudentCreated as EventListener);

    // 清理函数
    return () => {
      window.removeEventListener('studentCreated', handleStudentCreated as EventListener);
    };
  }, [df.data, df.search]);

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

  const handleAttendanceOk = (checkInData: { studentId: number; courseId: number; duration: number; type?: string }) => {
    // ★ 增加详细日志，检查传入的数据
    console.log('[handleAttendanceOk] 接收到打卡数据:', checkInData);
    if (typeof checkInData.studentId !== 'number' || typeof checkInData.courseId !== 'number' || typeof checkInData.duration !== 'number') {
        console.error('[handleAttendanceOk] 传入的 checkInData 类型不正确!', checkInData);
        message.error('打卡处理失败，数据类型错误');
        setAttendanceModalVisible(false);
        return;
    }

    // 检查是否为请假类型，请假不扣减课时
    const isLeave = checkInData.type === 'LEAVE';
    
    if (checkInData.duration <= 0 || isLeave) {
      const reason = isLeave ? '请假' : '课时为0或负数';
      console.warn(`[handleAttendanceOk] ${reason}，将不更新本地状态。打卡数据:`, checkInData);
      // 关闭模态框并显示相应的成功消息，但不调用本地更新
      setAttendanceModalVisible(false);
      const message_text = isLeave ? '请假记录成功（课时未扣除）' : '打卡记录成功（课时未扣除）';
      message.success(`${selectedStudent?.name || '学员'} ${message_text}`);
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

  return (
    <ConfigProvider locale={zhCN}>
      <div className="student-management">
        <Card className="student-management-card">
          {/* 页面头部组件 */}
          <StudentHeader
            totalStudents={df.data.totalStudents}
            studyingStudents={studyingStudents}
            graduatedStudents={graduatedStudents}
            expiredStudents={expiredStudents}
            refundedStudents={refundedStudents}
            courseCount={courseList.length}
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
            onSearch={df.search.handleSearch}
            onReset={df.search.handleReset}
            onExport={() => ui.export.handleExport(df.data.students as UiStudent[])}
            onTextChange={df.search.setSearchText}
            onStatusChange={df.search.setSelectedStatus}
            onCourseChange={df.search.setSelectedCourse}
            onMonthChange={df.search.setEnrollMonth}
            onSortOrderChange={df.search.setSortOrder}
            onEdit={(record) => df.form.showEditModal(record as any)}
            onClassRecord={(record) => ui.classRecord.showClassRecordModal(record as any)}
            onPayment={(record) => ui.payment.showPaymentModal(record as any)}
            onRefund={(record) => ui.refund.handleRefund(record as any)}
            onTransfer={(record) => ui.transfer.handleTransfer(record as any, record.selectedCourseId)}
            onTransferClass={(record) => ui.transferClass.handleTransferClass(record as any)}
            onDelete={(record) => ui.deleteConfirm.showDeleteConfirm(record)}
            onAttendance={handleAttendance}
            onDetails={handleStudentDetails}
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