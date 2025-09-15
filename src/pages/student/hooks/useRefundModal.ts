import { useState } from 'react';
import { Form, message } from 'antd';
import { Student, CourseSummary } from '../types/student';
import { getStudentAllCourses } from '../utils/student';
import { SimpleCourse } from '@/api/course/types';
import { API } from '@/api';
import { RefundRequest, RefundMethod } from '@/api/student/types';

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
  // 提交按钮加载状态
  const [submitting, setSubmitting] = useState(false);

  // 处理展示退费模态框
  const handleRefund = (student: Student & { selectedCourseId?: string; selectedCourseName?: string }) => {
    console.log('处理退费操作，学生:', student.name, '课程ID:', student.selectedCourseId, '课程名称:', student.selectedCourseName);
    console.log('学生完整数据:', student);
    
    // 设置当前学生
    setCurrentStudent(student);
    
    // 获取学生的所有课程
    const courses = getStudentAllCourses(student);
    console.log('获取到的课程列表:', courses);
    setStudentCourses(courses);
    
    // 打开模态框
    setVisible(true);
    
    // 使用 setTimeout 确保模态框完全打开后再设置表单值
    setTimeout(() => {
      // 重置表单
      form.resetFields();
      
      // 如果有指定的课程ID，设置表单的默认课程
      if (student.selectedCourseId) {
        console.log('查找课程ID:', student.selectedCourseId, '类型:', typeof student.selectedCourseId);
        console.log('传递的课程名称:', student.selectedCourseName);
        
        // 优先使用传递的课程名称，这样更可靠
        let courseName = student.selectedCourseName;
        let refundHours = '0';
        
        // 尝试从课程列表中找到匹配的课程来获取退费课时
        const selectedCourse = courses.find(course => {
          console.log('比较课程:', {
            courseId: course.id,
            courseIdType: typeof course.id,
            targetId: student.selectedCourseId,
            targetIdType: typeof student.selectedCourseId,
            match: String(course.id) === String(student.selectedCourseId)
          });
          return String(course.id) === String(student.selectedCourseId);
        });
        
        if (selectedCourse) {
          console.log('找到匹配的课程:', selectedCourse);
          // 如果找到匹配的课程，使用课程列表中的信息
          courseName = selectedCourse.name;
          refundHours = selectedCourse.remainingClasses ? selectedCourse.remainingClasses.split('/')[0] : '0';
        } else {
          console.log('未找到匹配的课程，使用传递的课程名称');
          // 如果没找到匹配的课程，尝试从原始课程数据中获取退费课时
          if (student.courses && student.courses.length > 0) {
            const originalCourse = student.courses.find(course => String(course.courseId) === String(student.selectedCourseId));
            if (originalCourse) {
              refundHours = originalCourse.remainingHours ? String(originalCourse.remainingHours) : '0';
              console.log('从原始课程数据获取退费课时:', refundHours);
            }
          }
        }
        
        const formValues = {
          studentId: student.studentId || student.id, // 设置学员ID
          studentName: student.name, // 设置学员姓名
          _courseId: student.selectedCourseId,
          fromCourseId: student.selectedCourseName || courseName || '未知课程', // 优先使用传递的selectedCourseName
          refundClassHours: refundHours
        };
        console.log('最终设置的表单值:', formValues);
        form.setFieldsValue(formValues);
      }
    }, 100); // 延迟100ms确保模态框完全打开
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
      setSubmitting(true);
      
      // 验证表单
      const values = await form.validateFields();
      console.log('表单数据:', values);
      
      // 确保必要的ID已经存在
      if (!values.studentId || !values._courseId) {
        message.error('缺少学员ID或课程ID，无法提交退费申请');
        setSubmitting(false);
        return;
      }

      // 根据API接口格式准备请求数据
      const refundData: RefundRequest = {
        studentId: Number(values.studentId),
        courseId: Number(values._courseId),
        campusId: Number(currentStudent?.campusId) || 0,
        refundHours: Number(values.refundClassHours) || 0,
        refundAmount: Number(values.refundAmount) || 0,
        handlingFee: Number(values.serviceFee) || 0,
        deductionAmount: Number(values.otherFee) || 0,
        refundMethod: values.refundMethod as RefundMethod, // 使用枚举值
        reason: values.reason,
      };
      
      // 调用API
      try {
        // 调用退费API
        const response = await API.student.refund(refundData);
        console.log('退费API响应:', response);
        
        // 检查响应格式：标准API响应格式 { code, data, message }
        if (response && response.code === 200) {
          message.success('退费申请提交成功');
          
          // 关闭模态框
          handleCancel();
          
          // 刷新列表
          if (onRefresh) {
            onRefresh();
          }
        } else {
          // 如果code不是200，显示后端返回的错误信息
          const errorMessage = response?.message || '退费申请提交失败';
          message.error(errorMessage);
        }
      } catch (error) {
        console.error('退费API调用失败:', error);
        message.error(`退费申请提交失败: ${error instanceof Error ? error.message : '请稍后重试'}`);
      } finally {
        setSubmitting(false);
      }
    } catch (error) {
      console.error('表单验证失败:', error);
      setSubmitting(false);
    }
  };

  return {
    form,
    visible,
    submitting,
    currentStudent,
    studentCourses,
    handleRefund,
    handleCancel,
    handleSubmit,
    courseList
  };
} 