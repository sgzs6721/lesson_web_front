import { useState, useCallback } from 'react';
import { Student, AttendanceRecordDTO, AttendanceListParams } from '@/api/student/types';
import { API } from '@/api';
import { message } from 'antd';
import { TablePaginationConfig } from 'antd/es/table';

// 定义UI层使用的打卡记录类型 (可以添加格式化后的字段)
export interface UIAttendanceRecord extends AttendanceRecordDTO {
  key: string | number; // 添加 key 用于表格
}

/**
 * 课程记录模态框相关的hook
 * @returns 课程记录模态框相关的状态和函数
 */
export const useClassRecordModal = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [records, setRecords] = useState<UIAttendanceRecord[]>([]);
  const [pagination, setPagination] = useState<{
    current: number;
    pageSize: number;
    total: number;
  }>({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [courseSummaries, setCourseSummaries] = useState<{ courseName: string; count: number }[]>([]); // 新增：课程统计状态

  // 获取记录的函数
  const fetchRecords = useCallback(async (studentId: number, page: number, pageSize: number, courseId?: string, courseName?: string) => {
    setLoading(true);
    setCourseSummaries([]); // 重置统计
    try {
      const campusId = Number(localStorage.getItem('currentCampusId'));
      if (!campusId) {
        message.warning('请先选择校区');
        setLoading(false);
        return;
      }
      
      const params: AttendanceListParams = {
        studentId,
        pageNum: page,
        pageSize,
        campusId
      };
      
      // 在调用 API 前打印参数，以便调试
      console.log('即将发送给 getAttendanceList API 的参数:', params);
      
      const response = await API.student.getAttendanceList(params);
      
      if (response && response.list) {
        let uiRecords = response.list.map((record, index) => ({
          ...record,
          key: record.recordId || `${page}-${index}`
        }));

        // 如果指定了课程名称，则过滤记录
        if (courseName) {
          console.log('按课程名称过滤记录:', courseName);
          uiRecords = uiRecords.filter(record => 
            record.courseName && record.courseName.includes(courseName)
          );
        }

        // 对记录进行排序：先按课程名称，再按上课日期（降序）
        uiRecords.sort((a, b) => {
          const courseNameCompare = (a.courseName || '').localeCompare(b.courseName || '');
          if (courseNameCompare !== 0) {
            return courseNameCompare;
          }
          // 课程名称相同，按日期降序排
          return (b.courseDate || '').localeCompare(a.courseDate || '');
        });

        // ★ 计算课程统计信息
        const summaries: { [key: string]: number } = {};
        uiRecords.forEach(record => {
          const courseName = record.courseName || '未指定课程';
          summaries[courseName] = (summaries[courseName] || 0) + 1;
        });
        const summaryArray = Object.entries(summaries).map(([courseName, count]) => ({
          courseName,
          count,
        })); 
        setCourseSummaries(summaryArray);

        setRecords(uiRecords); // 设置排序后的记录
        setPagination(prev => ({
          current: response.pageNum ?? prev.current ?? 1,
          pageSize: response.pageSize ?? prev.pageSize ?? 10,
          total: response.total ?? 0,
        }));
      } else {
        setRecords([]);
        setPagination(prev => ({ total: 0, current: 1, pageSize: prev.pageSize }));
      }
    } catch (error) {
      console.error('获取课程记录失败:', error);
      message.error('获取课程记录失败');
      setRecords([]);
      setPagination(prev => ({ total: 0, current: 1, pageSize: prev.pageSize }));
    } finally {
      setLoading(false);
    }
  }, []);

  // 显示模态框并获取第一页数据
  const showModal = useCallback((student: Student, courseId?: string) => {
    // ★ 确保使用 studentId (number)
    const studentId = student.studentId ? Number(student.studentId) : Number(student.id);
    if (isNaN(studentId)) {
      message.error('无效的学员ID，无法查看记录');
      return;
    }
    
    // 根据课程ID找到课程名称
    let courseName: string | undefined;
    if (courseId && student.courses) {
      const course = student.courses.find(c => String(c.courseId) === String(courseId));
      courseName = course?.courseName;
    }
    
    // 将课程信息存储到学生对象中，以便分页时使用
    const studentWithCourseInfo = { 
      ...student, 
      selectedCourseId: courseId,
      selectedCourseName: courseName
    };
    setCurrentStudent(studentWithCourseInfo);
    setVisible(true);
    // 重置分页到第一页并获取数据
    setPagination(prev => ({ current: 1, total: prev.total, pageSize: prev.pageSize }));
    fetchRecords(studentId, 1, pagination.pageSize || 10, courseId, courseName);
  }, [fetchRecords, pagination.pageSize]);

  // 关闭模态框
  const hideModal = useCallback(() => {
    setVisible(false);
    setCurrentStudent(null);
    setRecords([]);
    setCourseSummaries([]); // 重置统计
    setPagination(prev => ({ current: 1, total: 0, pageSize: prev.pageSize }));
  }, []);

  // 处理表格分页变化
  const handleTableChange = useCallback((newPagination: TablePaginationConfig) => {
    if (currentStudent) {
       const studentId = currentStudent.studentId ? Number(currentStudent.studentId) : Number(currentStudent.id);
       if (!isNaN(studentId)) {
         const page = newPagination.current || 1;
         const pageSize = newPagination.pageSize || 10;
         // 从当前学生信息中获取课程信息（如果有的话）
         const courseId = (currentStudent as any).selectedCourseId;
         const courseName = (currentStudent as any).selectedCourseName;
         fetchRecords(studentId, page, pageSize, courseId, courseName);
       }
    }
  }, [currentStudent, fetchRecords]);

  return {
    classRecordModalVisible: visible,
    // 更新返回的结构，分离 student 和 records
    currentStudent: currentStudent, 
    classRecords: records,
    classRecordLoading: loading,
    classRecordPagination: pagination, // 返回包含 showTotal 的分页配置
    courseSummaries: courseSummaries, // ★ 返回课程统计信息
    showClassRecordModal: showModal,
    handleClassRecordModalCancel: hideModal,
    handleClassRecordTableChange: handleTableChange // 返回分页处理函数
  };
};