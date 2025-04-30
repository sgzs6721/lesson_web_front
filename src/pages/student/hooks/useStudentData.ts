import { useState, useEffect } from 'react';
import { StudentSearchParams, StudentUISearchParams } from '@/api/student/types';
import { Student } from '@/pages/student/types/student'; // 使用前端Student类型
import { API } from '@/api';
import { message } from 'antd';

export const useStudentData = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [total, setTotal] = useState(0);
  // 使用简单的loading状态，与教练管理页面保持一致
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 获取学员列表
  const fetchStudents = async (params?: StudentSearchParams) => {
    try {
      // 设置加载状态为true
      setLoading(true);

      // 确保有校区ID
      const currentCampusId = localStorage.getItem('currentCampusId');
      if (!currentCampusId) {
        console.warn('未选择校区，无法获取学员列表');
        message.warning('请先选择校区');
        setLoading(false);
        return [];
      }

      // 添加默认的倒序排序参数
      const defaultParams: StudentSearchParams = {
        ...params,
        // 强制按ID倒序排序，确保新增学员总是显示在最前面
        sortField: 'id',
        sortOrder: 'desc',
        // 添加校区ID
        campusId: Number(currentCampusId)
      };

      // 调用API获取学员列表
      const response = await API.student.getList(defaultParams);

      if (response && response.list) {
        // 更新状态
        setStudents(response.list);
        setFilteredStudents(response.list);
        setTotal(response.total);
      } else {
        console.error('学员列表响应格式不正确:', response);
        setStudents([]);
        setFilteredStudents([]);
        setTotal(0);
      }

      return response?.list || [];
    } catch (error) {
      console.error('获取学员列表失败:', error);
      message.error('获取学员列表失败');

      // 重置状态
      setStudents([]);
      setFilteredStudents([]);
      setTotal(0);

      return [];
    } finally {
      // 无论成功还是失败，都关闭加载状态
      setLoading(false);
    }
  };

  // 不在这里自动获取学员列表，而是由组件调用

  // 添加学员
  const addStudent = async (student: Omit<Student, 'id'>) => {
    try {
      setLoading(true);
      const newStudent = await API.student.add(student);

      // 重新获取学员列表，确保数据最新
      await fetchStudents({
        pageNum: currentPage,
        pageSize: pageSize
      });

      message.success('学员添加成功');
      return newStudent;
    } catch (error) {
      console.error('添加学员失败:', error);
      message.error('添加学员失败');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 更新学员
  const updateStudent = async (id: string, updatedData: Partial<Student> | any) => {
    try {
      setLoading(true);
      console.log('更新学员参数:', id, updatedData);

      // 检查是否是学员及课程更新请求（来自嵌套结构的表单）
      if (updatedData && updatedData.studentId !== undefined && updatedData.courseId !== undefined && updatedData.studentInfo && updatedData.courseInfo) {
        // 使用 updateWithCourse 方法
        console.log('使用 updateWithCourse 方法更新学员及课程:', updatedData);
        await API.student.updateWithCourse(updatedData);
      } else {
        // 使用原来的 update 方法
        console.log('使用原来的 update 方法更新学员:', updatedData);
        // 确保ID不为空
        if (!id) {
          id = String(updatedData.id || updatedData.studentId);
          if (!id) {
            console.error('更新学员失败: 无法获取学员ID', updatedData);
            message.error('更新学员失败: 无法获取学员ID');
            setLoading(false);
            return;
          }
        }
        await API.student.update(id, updatedData);
      }

      // 重新获取学员列表，确保数据最新
      await fetchStudents({
        pageNum: currentPage,
        pageSize: pageSize
      });
    } catch (error) {
      console.error('更新学员失败:', error);
      message.error('更新学员失败');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 删除学员
  const deleteStudent = async (id: string) => {
    try {
      setLoading(true);
      await API.student.delete(id);

      // 重新获取学员列表，确保数据最新
      await fetchStudents({
        pageNum: currentPage,
        pageSize: pageSize
      });

      message.success('学员已删除');
    } catch (error) {
      console.error('删除学员失败:', error);
      message.error('删除学员失败');
    } finally {
      setLoading(false);
    }
  };

  // 将前端搜索参数转换为API搜索参数
  const convertToApiSearchParams = (uiParams: StudentUISearchParams): StudentSearchParams => {
    const apiParams: StudentSearchParams = {
      pageNum: currentPage,
      pageSize: pageSize,
      // 默认按创建时间倒序排序
      sortField: 'createdTime',
      sortOrder: 'desc'
    };

    // 处理搜索文本
    if (uiParams.searchText) {
      apiParams.keyword = uiParams.searchText;
    }

    // 处理状态
    if (uiParams.selectedStatus) {
      // 根据状态值进行映射
      const statusMap: Record<string, 'normal' | 'expired' | 'graduated' | 'STUDYING'> = {
        'active': 'normal',
        'ACTIVE': 'normal',
        'inactive': 'expired',
        'INACTIVE': 'expired',
        'pending': 'graduated',
        'PENDING': 'graduated',
        'STUDYING': 'STUDYING',
        'normal': 'normal',
        'expired': 'expired',
        'graduated': 'graduated'
      };

      apiParams.status = statusMap[uiParams.selectedStatus] || 'normal';
    }

    // 处理课程
    if (uiParams.selectedCourse) {
      apiParams.courseId = uiParams.selectedCourse;
    }

    // 处理报名月份
    if (uiParams.enrollMonth) {
      const year = uiParams.enrollMonth.year();
      const month = uiParams.enrollMonth.month() + 1;
      const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
      const endDate = uiParams.enrollMonth.endOf('month').format('YYYY-MM-DD');

      apiParams.enrollDateStart = startDate;
      apiParams.enrollDateEnd = endDate;
    }

    // 处理排序
    if (uiParams.sortOrder) {
      switch(uiParams.sortOrder) {
        case 'enrollDateAsc':
          apiParams.sortField = 'enrollDate';
          apiParams.sortOrder = 'asc';
          break;
        case 'enrollDateDesc':
          apiParams.sortField = 'enrollDate';
          apiParams.sortOrder = 'desc';
          break;
        case 'ageAsc':
          apiParams.sortField = 'age';
          apiParams.sortOrder = 'asc';
          break;
        case 'ageDesc':
          apiParams.sortField = 'age';
          apiParams.sortOrder = 'desc';
          break;
        case 'remainingClassesAsc':
          apiParams.sortField = 'remainingClasses';
          apiParams.sortOrder = 'asc';
          break;
        case 'remainingClassesDesc':
          apiParams.sortField = 'remainingClasses';
          apiParams.sortOrder = 'desc';
          break;
        case 'lastClassDateAsc':
          apiParams.sortField = 'lastClassDate';
          apiParams.sortOrder = 'asc';
          break;
        case 'lastClassDateDesc':
          apiParams.sortField = 'lastClassDate';
          apiParams.sortOrder = 'desc';
          break;
      }
    }

    return apiParams;
  };

  // 过滤学员数据
  const filterStudents = async (uiParams: StudentUISearchParams) => {
    try {
      // 设置加载状态为true
      setLoading(true);

      // 确保有校区ID
      const currentCampusId = localStorage.getItem('currentCampusId');
      if (!currentCampusId) {
        console.warn('未选择校区，无法过滤学员数据');
        message.warning('请先选择校区');
        setLoading(false);
        return [];
      }

      // 将UI搜索参数转换为API搜索参数
      const apiParams = convertToApiSearchParams(uiParams);
      // 添加校区ID
      apiParams.campusId = Number(currentCampusId);

      // 调用API获取过滤后的学员列表
      const response = await API.student.getList(apiParams);

      if (response && response.list) {
        // 更新状态
        setFilteredStudents(response.list);
        setTotal(response.total);
      } else {
        console.error('过滤学员数据响应格式不正确:', response);
        setFilteredStudents([]);
        setTotal(0);
      }

      return response?.list || [];
    } catch (error) {
      console.error('过滤学员数据失败:', error);
      message.error('过滤学员数据失败');

      // 重置状态
      setFilteredStudents([]);
      setTotal(0);

      return [];
    } finally {
      // 无论成功还是失败，都关闭加载状态
      setLoading(false);
    }
  };

  // 重置数据
  const resetData = async () => {
    setCurrentPage(1);

    try {
      await fetchStudents({
        pageNum: 1,
        pageSize: pageSize
      });
    } catch (error) {
      console.error('重置数据失败:', error);
      message.error('重置数据失败');
    }
  };

  // 处理分页变化
  const handlePageChange = async (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) setPageSize(size);

    try {
      await fetchStudents({
        pageNum: page,
        pageSize: size || pageSize
      });
    } catch (error) {
      console.error('分页变化失败:', error);
      message.error('分页变化失败');
    }
  };

  // 直接将新创建的学员添加到列表开头
  const addNewStudentToList = (newStudent: Student) => {
    try {
      console.log('添加新学员到列表:', newStudent);

      // 确保教练信息存在
      if (!newStudent.coach) {
        console.warn('新学员缺少教练信息，尝试从课程中获取');
      }

      // 无论当前在哪一页，都将新学员添加到列表开头
      setStudents(prevStudents => [newStudent, ...prevStudents]);
      setFilteredStudents(prevStudents => [newStudent, ...prevStudents]);
      // 更新总数
      setTotal(prevTotal => prevTotal + 1);

      // 如果当前不在第一页，则自动跳转到第一页
      if (currentPage !== 1) {
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('添加学员到列表失败:', error);
      message.error('添加学员到列表失败');
    }
  };

  // 新增：本地更新学员打卡后的课时信息
  const updateStudentAttendanceLocally = (studentId: number, courseId: number, consumedDuration: number) => {
    console.log(`[updateLocally]尝试更新：学员ID=${studentId}, 课程ID=${courseId}, 消耗时长=${consumedDuration}`);

    const updateState = (prevState: Student[]) => {
      let stateChanged = false;
      const newState = prevState.map(student => {
        // ★ 修改 ID 比较逻辑：优先用 studentId (number)，否则用 id (string 转 number)
        const studentMatches = (student.studentId !== undefined && student.studentId === studentId) || 
                             (student.studentId === undefined && student.id !== undefined && Number(student.id) === studentId);

        if (studentMatches) { 
          let studentCoursesChanged = false;
          const originalCourses = student.courses ?? [];
          const updatedCourses = originalCourses.map(course => {
            // ★ 转换为数字进行比较
            if (Number(course.courseId) === courseId) { 
              const currentRemaining = course.remainingHours ?? 0;
              const newRemaining = Math.max(0, currentRemaining - consumedDuration);
              if (newRemaining !== currentRemaining) { 
                console.log(`[updateLocally] 找到课程并更新: ${course.courseName} (ID: ${course.courseId}), 原剩余: ${currentRemaining}, 新剩余: ${newRemaining}`);
                studentCoursesChanged = true; 
                return {
                  ...course,
                  remainingHours: newRemaining,
                };
              } else {
                 console.log(`[updateLocally] 找到课程但课时未变: ${course.courseName}`);
              }
            }
            return course; 
          });

          if (studentCoursesChanged) {
            console.log(`[updateLocally] 找到学员并更新其 courses: ${student.name} (ID: ${student.studentId})`);
            stateChanged = true;
            return {
              ...student, 
              courses: updatedCourses, 
            };
          } else {
             console.log(`[updateLocally] 找到学员但其课程未更新: ${student.name}`);
          }
        }
        return student; 
      });

      // ★ 修改这里的逻辑：即使 stateChanged 为 false (因为ID不匹配或课时未变)，
      // 但既然 API 调用成功且 duration > 0，我们仍然应该返回 newState 以强制更新引用。
      // 只有在 consumedDuration 为 0 时，才考虑返回 prevState。
      if (consumedDuration !== 0) {
          if (!stateChanged) {
              console.warn(`[updateLocally] ID匹配失败或课时未变，但强制更新引用，因为 duration=${consumedDuration}`);
          }
          console.log(`[updateLocally] 返回新数组引用 (强制或因改变)`);
          return newState; // 强制返回新数组
      } else {
          // 如果消耗课时为0，则按原来的逻辑判断是否返回新引用
          if (stateChanged) {
            console.log(`[updateLocally] 状态已改变 (duration=0)，返回新数组引用`);
            return newState;
          }
          console.log(`[updateLocally] 状态未改变 (duration=0)，返回原数组引用`);
          return prevState; 
      }
    };

    // 更新状态，React 会比较新旧状态引用，如果不同则触发重渲染
    setStudents(updateState);
    setFilteredStudents(updateState);

    console.log(`[updateLocally] 更新调用完成`);
  };

  return {
    students: filteredStudents,
    totalStudents: total,
    loading,
    currentPage,
    pageSize,
    addStudent,
    updateStudent,
    deleteStudent,
    filterStudents,
    resetData,
    handlePageChange,
    fetchStudents,
    addNewStudentToList, // 新增方法
    updateStudentAttendanceLocally // 新增方法
  };
};