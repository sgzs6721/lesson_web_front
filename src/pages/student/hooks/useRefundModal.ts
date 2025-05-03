import { useState } from 'react';
import { Form } from 'antd';
import { Student, CourseSummary } from '../types/student';
import { getStudentAllCourses } from '../utils/student';
import { SimpleCourse } from '@/api/course/types';

/**
 * 退费模态框钩子
 * @param studentList 学生列表
 * @param courseList 课程列表，从API获取的动态课程列表
 * @param onRefresh 刷新回调函数
 */
export default function useRefundModal(
  studentList: Student[],
  courseList: SimpleCourse[] = [],
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

  // 处理展示退费模态框
  const handleRefund = (student: Student) => {
    console.log('处理退费操作，学生:', student.name);
    
    // 重置表单
    form.resetFields();
    
    // 设置当前学生
    setCurrentStudent(student);
    
    // 获取学生的所有课程
    const courses = getStudentAllCourses(student);
    setStudentCourses(courses);
    
    // 打开模态框
    setVisible(true);
  };

  // 关闭模态框
  const handleCancel = () => {
    console.log('关闭退费模态框');
    setVisible(false);
    setCurrentStudent(null);
    setStudentCourses([]);
    form.resetFields();
  };

  // 提交表单
  const handleSubmit = async () => {
    console.log('提交退费表单');
    try {
      // 验证表单
      const values = await form.validateFields();
      console.log('表单数据:', values);
      
      // TODO: 实际提交逻辑 (已在页面中实现)
      
      // 关闭模态框
      handleCancel();
      
      // 刷新列表
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
    handleRefund,
    handleCancel,
    handleSubmit,
    courseList
  };
} 