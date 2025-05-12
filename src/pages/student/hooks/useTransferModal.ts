import { useState, useMemo } from 'react';
import { Form } from 'antd';
import { Student, CourseSummary } from '../types/student';
import { getStudentAllCourses } from '../utils/student';
import { SimpleCourse } from '@/api/course/types';
import dayjs from 'dayjs';
import { message } from 'antd';
import { API } from '@/api';
import { Constant } from '@/api/constants/types';

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
  // 搜索文本
  const [searchText, setSearchText] = useState('');
  // 添加有效期选项状态
  const [validityPeriodOptions, setValidityPeriodOptions] = useState<Constant[]>([]);

  // 加载有效期类型选项
  const fetchValidityPeriodOptions = async () => {
    try {
      console.log('获取有效期选项');
      const data = await API.constants.getList('VALIDITY_PERIOD');
      console.log('获取到有效期选项:', data);
      setValidityPeriodOptions(data);
    } catch (error) {
      console.error('获取有效期类型选项失败:', error);
    }
  };

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
  const handleTransfer = (student: Student, selectedCourseId?: string) => {
    console.log('处理转课操作，学生:', student.name, '指定课程ID:', selectedCourseId, '类型:', typeof selectedCourseId);
    
    // 检查是否存在selectedCourseName（从tableColumns.tsx传递）
    const selectedCourseName = (student as any).selectedCourseName;
    if (selectedCourseName) {
      console.log('获取到课程名称:', selectedCourseName);
    }
    
    // 重置表单
    form.resetFields();
    
    // 设置当前学生
    setCurrentStudent(student);
    
    // 获取学生的所有课程
    const courses = getStudentAllCourses(student).filter(
      // 只显示已报名的课程
      course => course.status !== '未报名'
    );
    console.log('学生所有课程:', JSON.stringify(courses, null, 2));
    setStudentCourses(courses);
    
    // 获取要转出的课程 - 如果有指定selectedCourseId，优先使用该课程
    const defaultCourse = selectedCourseId 
      ? courses.find(course => {
          const courseIdMatches = String(course.id) === String(selectedCourseId);
          console.log(`比较课程ID: ${course.id} (${typeof course.id}) 与 ${selectedCourseId} (${typeof selectedCourseId}): ${courseIdMatches}`);
          console.log('课程完整信息:', JSON.stringify(course, null, 2));
          return courseIdMatches;
        }) 
      : (courses.length > 0 ? courses[0] : null);
      
    console.log('选择的课程:', defaultCourse ? JSON.stringify(defaultCourse, null, 2) : '未找到匹配课程');
    
    // 确保有课程被选中
    if (!defaultCourse && courses.length > 0) {
      console.log('未找到匹配课程ID，使用第一个可用课程:', courses[0]);
    } else if (!defaultCourse) {
      console.error('无法找到有效的课程进行转课操作!');
      message.error('无法找到有效的课程进行转课操作');
      return;
    }
    
    // 如果有selectedCourseName，可能是从表格中直接选择的特定课程
    const courseName = selectedCourseName || (defaultCourse ? defaultCourse.name : '');
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
        
        // 使用String转换确保类型匹配
        const coursesInfo = student.courses.find(c => {
          const courseIdMatches = String(c.courseId) === String(defaultCourse.id);
          console.log(`比较课程信息: ${c.courseId} (${typeof c.courseId}) 与 ${defaultCourse.id} (${typeof defaultCourse.id}): ${courseIdMatches}`);
          return courseIdMatches;
        });
        
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
    
    console.log('最终确定的转课课时数:', remainingHours);
    
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
    
    // 获取有效期选项
    fetchValidityPeriodOptions();
    
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

  // 处理添加新学生
  const handleAddStudent = (student: Student) => {
    if (onAddStudent) {
      onAddStudent(student);
    }
    
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
      
      // 调用转课API
      try {
        // 获取当前校区ID
        const campusId = localStorage.getItem('currentCampusId');
        
        // 解析有效期时长
        let validityPeriod: number | undefined;
        if (values.validityPeriodId) {
          // 检查是否是数字字符串，如果是则转换为数字
          if (!isNaN(Number(values.validityPeriodId))) {
            validityPeriod = Number(values.validityPeriodId);
          } else {
            // 如果不是数字，尝试从常量选项中获取数值
            const option = validityPeriodOptions.find(opt => opt.id === values.validityPeriodId);
            if (option && !isNaN(Number(option.constantValue))) {
              validityPeriod = Number(option.constantValue);
            }
          }
        }
        
        console.log('解析的有效期时长:', validityPeriod);
        
        // 构建转课请求参数
        const transferData = {
          studentId: Number(currentStudent?.id),
          targetStudentId: Number(values.targetStudentId),
          courseId: Number(values._courseId), // 原课程ID
          targetCourseId: Number(values.toCourseId), // 目标课程ID
          transferHours: Number(values.transferClassHours), // 转课课时
          compensationFee: Number(values.priceDifference || 0), // 价格差额
          transferCause: values.reason, // 转课原因
          campusId: campusId ? Number(campusId) : undefined,
          validUntil: values.validUntil ? values.validUntil.format('YYYY-MM-DD') : undefined,
          validityPeriod: validityPeriod // 添加有效期时长参数
        };
        
        console.log('转课请求数据:', transferData);
        
        // 提交转课请求
        await API.student.transferCourse(transferData);
        
        // 关闭模态框
        handleCancel();
        
        // 如果提供了刷新回调，调用它
        if (onRefresh) {
          onRefresh();
        }
      } catch (error) {
        console.error('转课请求失败:', error);
        // API.student.transferCourse中已经有错误处理，这里不需要额外显示错误消息
      }
    } catch (error) {
      console.error('表单验证失败:', error);
      message.error('请检查表单填写是否完整');
    }
  };

  return {
    form,
    visible,
    currentStudent,
    studentCourses,
    searchResults,
    searchLoading,
    availableStudents,
    handleTransfer,
    handleCancel,
    handleAddStudent,
    handleSearch,
    handleSubmit,
    courseList
  };
} 