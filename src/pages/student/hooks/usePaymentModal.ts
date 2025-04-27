import { useState } from 'react';
import { Form, message } from 'antd';
import { Student, PaymentRecord } from '@/api/student/types';
import { getStudentAllCourses } from '@/pages/student/utils/student';
import { API } from '@/api';
import dayjs from 'dayjs';

/**
 * 缴费模态框相关的hook
 * @returns 缴费模态框相关的状态和函数
 */
export const usePaymentModal = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [paymentForm] = Form.useForm();
  const [selectedPaymentCourse, setSelectedPaymentCourse] = useState<string | number>('');
  const [selectedPaymentCourseName, setSelectedPaymentCourseName] = useState<string>('');
  const [currentClassHours, setCurrentClassHours] = useState<number>(0);
  const [newClassHours, setNewClassHours] = useState<number>(0);
  const [totalClassHours, setTotalClassHours] = useState<number>(0);
  const [newValidUntil, setNewValidUntil] = useState<string>('—');

  // 显示缴费模态框
  const showModal = (student: Student) => {
    setCurrentStudent(student);
    paymentForm.resetFields();

    // 获取学生所有课程
    const courses = getStudentAllCourses(student);

    // 直接使用固定的课程ID和名称
    const defaultCourseId = 1; // 使用数字1作为courseId
    const defaultCourseName = '杨教练大课';
    const defaultCourseType = '一对一';

    // 设置选中的课程
    setSelectedPaymentCourse(defaultCourseId);
    setSelectedPaymentCourseName(defaultCourseName);

    console.log('缴费模态框 - 选中课程:', {
      id: defaultCourseId,
      name: defaultCourseName,
      type: defaultCourseType
    });

    // 设置初始值
    paymentForm.setFieldsValue({
      courseType: defaultCourseType || student.courseType,
      courseId: defaultCourseId,
      student: student.id,
      // 不设置缴费类型和支付方式的默认值
      transactionDate: dayjs(),
      validUntil: dayjs().add(180, 'day'),
      regularClasses: 0,
      bonusClasses: 0,
    });

    // 设置课时预览初始值
    const remainingHours = parseInt(student.remainingClasses.split('/')[0]) || 0;
    setCurrentClassHours(remainingHours);
    setNewClassHours(0);
    setTotalClassHours(remainingHours);
    setNewValidUntil(dayjs().add(180, 'day').format('YYYY-MM-DD'));

    setVisible(true);
  };

  // 处理课时变化
  const handleClassHoursChange = () => {
    const regularClasses = paymentForm.getFieldValue('regularClasses') || 0;
    const bonusClasses = paymentForm.getFieldValue('bonusClasses') || 0;
    setNewClassHours(regularClasses + bonusClasses);
    setTotalClassHours(currentClassHours + regularClasses + bonusClasses);
  };

  // 处理有效期变化
  const handleValidUntilChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      setNewValidUntil(date.format('YYYY-MM-DD'));
    } else {
      setNewValidUntil('—');
    }
  };

  // 处理课程改变
  const handlePaymentCourseChange = (courseId: string | number) => {
    // 无论选择什么课程，都使用固定的ID和名称
    setSelectedPaymentCourse(1); // 使用数字1作为courseId
    setSelectedPaymentCourseName('杨教练大课');

    // 设置固定的课程类型
    paymentForm.setFieldsValue({
      courseType: '一对一',
    });
  };

  // 处理缴费提交
  const handlePaymentOk = async () => {
    try {
      setLoading(true);
      const values = await paymentForm.validateFields();

      if (!currentStudent) {
        message.error('学生信息不存在');
        return;
      }

      // 验证缴费类型和支付方式是否已选择
      if (!values.paymentType) {
        message.error('请选择缴费类型');
        return;
      }

      if (!values.paymentMethod) {
        message.error('请选择支付方式');
        return;
      }

      // 确保使用正确的枚举值
      const paymentType = values.paymentType;
      const paymentMethod = values.paymentMethod;

      console.log('原始缴费类型:', paymentType);
      console.log('原始支付方式:', paymentMethod);

      // 验证课程ID是否已选择
      if (!values.courseId) {
        message.error('请选择缴费课程');
        return;
      }

      // 准备缴费数据
      const paymentData = {
        studentId: Number(currentStudent.id),
        courseId: Number(values.courseId || 1), // 确保courseId是数字类型
        paymentType: paymentType,
        amount: values.amount,
        paymentMethod: paymentMethod,
        transactionDate: values.transactionDate.format('YYYY-MM-DD'),
        courseHours: values.regularClasses || 0,
        giftHours: values.bonusClasses || 0,
        validUntil: values.validUntil.format('YYYY-MM-DD'),
        giftItems: Array.isArray(values.gift) ? values.gift.join(',') : values.gift || '',
        notes: values.remarks || ''
      };

      console.log('使用学生对象中的courseId:', currentStudent.courseId);

      console.log('缴费课程ID:', values.courseId);

      console.log('最终缴费数据:', JSON.stringify(paymentData, null, 2));

      // 调用缴费API
      await API.student.addPayment(paymentData);

      message.success('缴费信息已保存');
      setVisible(false);

      // 重置表单和状态
      setCurrentStudent(null);
      paymentForm.resetFields();
    } catch (error) {
      console.error('缴费失败:', error);
      if (error instanceof Error) {
        message.error(`缴费失败: ${error.message}`);
      } else {
        message.error('缴费失败');
      }
    } finally {
      setLoading(false);
    }
  };

  // 关闭缴费模态框
  const handlePaymentCancel = () => {
    setVisible(false);
    setCurrentStudent(null);
    paymentForm.resetFields();
  };

  return {
    paymentModalVisible: visible,
    paymentLoading: loading,
    currentStudent,
    paymentForm,
    selectedPaymentCourse,
    selectedPaymentCourseName,
    currentClassHours,
    newClassHours,
    totalClassHours,
    newValidUntil,
    showPaymentModal: showModal,
    handlePaymentOk,
    handlePaymentCancel,
    handlePaymentCourseChange,
    handleClassHoursChange,
    handleValidUntilChange
  };
};