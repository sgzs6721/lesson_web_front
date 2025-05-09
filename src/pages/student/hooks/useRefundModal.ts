import { useState } from 'react';
import { Form, message } from 'antd';
import { Student, CourseSummary } from '../types/student';
import { getStudentAllCourses } from '../utils/student';
import { SimpleCourse } from '@/api/course/types';
import { API } from '@/api';
import { RefundRequest } from '@/api/student/types';

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
        refundAmount: values.actualRefund,
        refundReason: values.reason,
        refundDate: new Date().toISOString().split('T')[0], // 格式化为 YYYY-MM-DD
        notes: `手续费类型ID: ${values.handlingFeeTypeId}, 手续费: ${values.serviceFee}, 其他费用: ${values.otherFee}, 退款课时: ${values.refundClassHours}`,
        refundMethod: String(values.refundMethod), // 将ID转为字符串
      };
      
      // 调用API
      try {
        // 调用退费API
        const response = await API.student.refund(refundData);
        
        if (response && response.refundId) {
          message.success('退费申请提交成功');
          
          // 关闭模态框
          handleCancel();
          
          // 刷新列表
          if (onRefresh) {
            onRefresh();
          }
        } else {
          message.error('退费申请提交失败');
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