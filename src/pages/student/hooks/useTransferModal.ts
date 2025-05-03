import { useState, useMemo } from 'react';
import { Form } from 'antd';
import { Student, CourseSummary } from '../types/student';
import { getStudentAllCourses } from '../utils/student';
import { SimpleCourse } from '@/api/course/types';
import dayjs from 'dayjs';

/**
 * 转课模态框钩子
 * @param studentList 学生列表
 * @param courseList 课程列表，从API获取的动态课程列表
 * @param onAddStudent 添加学生回调函数
 * @param onRefresh 刷新回调函数
 */
export default function useTransferModal(
  studentList: Student[],
  courseList: SimpleCourse[] = [],
  onAddStudent?: (student: Student) => void,
  onRefresh?: () => void
) {
  // 表单实例
  const [form] = Form.useForm();
  // 模态框可见状态
  const [visible, setVisible] = useState(false);
  // 当前选中的学生
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  // 当前学生的所有课程
  const [studentCourses, setStudentCourses] = useState<CourseSummary[]>([]);
  // 转课目标搜索结果
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  // 搜索加载状态
  const [searchLoading, setSearchLoading] = useState(false);
  // 快速添加学生模态框可见状态
  const [quickAddVisible, setQuickAddVisible] = useState(false);
  // 搜索文本
  const [searchText, setSearchText] = useState('');

  // 合并学生列表和搜索结果，确保不重复
  const availableStudents = useMemo(() => {
    const allStudents = [...searchResults];
    
    // 如果当前学生不在列表中，添加到列表前面
    if (currentStudent) {
      const exists = allStudents.some(s => s.id === currentStudent.id);
      if (!exists) {
        allStudents.unshift(currentStudent);
      }
    }
    
    // 添加来自studentList的学生，确保不重复
    studentList.forEach(student => {
      const exists = allStudents.some(s => s.id === student.id);
      if (!exists) {
        allStudents.push(student);
      }
    });
    
    return allStudents;
  }, [currentStudent, searchResults, studentList]);

  // 处理展示转课模态框
  const handleTransfer = (student: Student) => {
    console.log('处理转课操作，学生:', student.name);
    
    // 重置表单
    form.resetFields();
    
    // 设置当前学生
    setCurrentStudent(student);
    
    // 获取学生的所有课程
    const courses = getStudentAllCourses(student).filter(
      // 只显示已报名的课程
      course => course.status !== '未报名'
    );
    setStudentCourses(courses);
    
    // 获取第一个课程作为默认值
    const defaultCourse = courses.length > 0 ? courses[0] : null;
    const courseName = defaultCourse ? defaultCourse.name : '';
    const courseId = defaultCourse ? defaultCourse.id : '';
    
    // 获取剩余课时数
    let remainingHours = 0;
    // 获取有效期
    let expireDate = '';
    
    if (defaultCourse) {
      // 获取有效期
      expireDate = defaultCourse.expireDate || '';
      console.log('从defaultCourse获取有效期:', expireDate);
      
      // 尝试从courses数组中获取精确的剩余课时
      if (student.courses && student.courses.length > 0) {
        console.log('尝试从student.courses中获取剩余课时，courses=', student.courses);
        const coursesInfo = student.courses.find(c => String(c.courseId) === String(defaultCourse.id));
        if (coursesInfo && coursesInfo.remainingHours !== undefined) {
          remainingHours = coursesInfo.remainingHours;
          console.log('从学生courses数组中获取剩余课时:', remainingHours);
          
          // 如果从coursesInfo中能获取到剩余课时，也尝试获取有效期
          if (!expireDate && coursesInfo.endDate) {
            expireDate = coursesInfo.endDate;
            console.log('从coursesInfo获取有效期:', expireDate);
          }
        }
      }
      
      // 如果没有找到精确课时，从课程概要中获取
      if (remainingHours === 0 && defaultCourse.remainingClasses) {
        console.log('尝试从defaultCourse.remainingClasses中获取剩余课时:', defaultCourse.remainingClasses);
        const parts = defaultCourse.remainingClasses.split('/');
        if (parts.length > 0 && !isNaN(Number(parts[0]))) {
          remainingHours = Number(parts[0]);
          console.log('从课程概要中获取剩余课时:', remainingHours);
        }
      }
    }
    
    // 如果仍未找到有效期，尝试从学生对象获取
    if (!expireDate && student.expireDate) {
      expireDate = student.expireDate;
      console.log('从student.expireDate获取有效期:', expireDate);
    }
    
    // 如果仍未找到剩余课时，尝试从学生对象直接获取
    if (remainingHours === 0 && student.remainingClasses) {
      console.log('尝试从student.remainingClasses中获取剩余课时:', student.remainingClasses);
      const parts = student.remainingClasses.split('/');
      if (parts.length > 0 && !isNaN(Number(parts[0]))) {
        remainingHours = Number(parts[0]);
        console.log('从学生对象中获取剩余课时:', remainingHours);
      }
    }
    
    // 准备表单值
    const formValues: any = {
      studentId: student.id,
      studentName: student.name,
      fromCourseId: courseName, // 显示课程名称，而不是ID
      _courseId: courseId, // 保存课程ID到隐藏字段，以便提交时使用
      operationType: 'transfer', // 设置为转课
      transferClassHours: remainingHours > 0 ? remainingHours : 1, // 设置默认转课课时为实际剩余课时
      priceDifference: 0,
    };
    
    // 如果有有效期，添加到表单值中
    if (expireDate) {
      try {
        const dateObj = dayjs(expireDate);
        if (dateObj.isValid()) {
          formValues.validUntil = dateObj;
        }
      } catch (error) {
        console.error('设置有效期失败:', error);
      }
    }
    
    // 设置表单值
    form.setFieldsValue(formValues);
    
    // 重置搜索结果
    setSearchResults([]);
    
    // 打开模态框
    setVisible(true);
  };

  // 关闭模态框
  const handleCancel = () => {
    console.log('关闭转课模态框');
    setVisible(false);
    setCurrentStudent(null);
    setStudentCourses([]);
    setSearchResults([]);
    form.resetFields();
  };

  // 打开快速添加学生模态框
  const handleQuickAddShow = () => {
    setQuickAddVisible(true);
  };

  // 关闭快速添加学生模态框
  const handleQuickAddCancel = () => {
    setQuickAddVisible(false);
  };

  // 处理添加新学生
  const handleAddStudent = (student: Student) => {
    if (onAddStudent) {
      onAddStudent(student);
    }
    setQuickAddVisible(false);
    
    // 将新添加的学生添加到搜索结果中
    setSearchResults(prev => {
      const exists = prev.some(s => s.id === student.id);
      if (exists) return prev;
      return [student, ...prev];
    });
  };

  // 搜索学员
  const handleSearch = (value: string) => {
    setSearchText(value);

    if (value.trim() === '') {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);

    // 模拟异步搜索
    setTimeout(() => {
      // 搜索结果应该排除当前转出学员
      const results = studentList
        .filter(s => {
          // 排除当前转出学员
          if (currentStudent && s.id === currentStudent.id) return false;
          
          // 匹配搜索条件
          const searchLower = value.toLowerCase();
          return (
            s.name.toLowerCase().includes(searchLower) ||
            s.id.toString().includes(searchLower) ||
            (s.phone && s.phone.includes(value))
          );
        });
      
      setSearchResults(results);
      setSearchLoading(false);
    }, 300);
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // 确保不能选择自己作为转入学员
      if (values.targetStudentId === currentStudent?.id) {
        // 如果选择了自己，显示错误并阻止提交
        form.setFields([
          {
            name: 'targetStudentId',
            errors: ['不能选择当前学员作为转入学员']
          }
        ]);
        return;
      }
      
      console.log('提交转课表单:', values);
      
      // 这里可以添加实际提交到后端的逻辑
      
      // 关闭模态框
      handleCancel();
      
      // 如果提供了刷新回调，调用它
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  return {
    form,
    visible,
    currentStudent,
    studentCourses,
    searchResults,
    searchLoading,
    quickAddVisible,
    availableStudents,
    handleTransfer,
    handleCancel,
    handleQuickAddShow,
    handleQuickAddCancel,
    handleAddStudent,
    handleSearch,
    handleSubmit,
    courseList
  };
} 