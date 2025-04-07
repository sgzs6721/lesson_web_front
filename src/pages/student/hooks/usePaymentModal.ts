import { useState } from 'react';
import { Form, message } from 'antd';
import { Student, PaymentRecord } from '@/pages/student/types/student';
import { getStudentAllCourses } from '@/pages/student/utils/student';
import dayjs from 'dayjs';

/**
 * 缴费模态框相关的hook
 * @returns 缴费模态框相关的状态和函数
 */
export const usePaymentModal = () => {
  const [visible, setVisible] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [paymentForm] = Form.useForm();
  const [selectedPaymentCourse, setSelectedPaymentCourse] = useState<string>('');
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
    
    // 如果有课程，默认选择第一个
    if (courses.length > 0) {
      const defaultCourse = courses[0];
      setSelectedPaymentCourse(defaultCourse.id || '');
      setSelectedPaymentCourseName(defaultCourse.name);
    }
    
    // 设置初始值
    paymentForm.setFieldsValue({
      courseType: student.courseType,
      courseId: courses.length > 0 ? courses[0].id : '',
      student: student.id,
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
  const handlePaymentCourseChange = (courseId: string) => {
    setSelectedPaymentCourse(courseId);
    // 获取课程名称
    const courses = getStudentAllCourses(currentStudent);
    const course = courses.find(c => c.id === courseId);
    if (course) {
      setSelectedPaymentCourseName(course.name);
    }
    
    // 获取对应课程类型
    paymentForm.setFieldsValue({
      courseType: course?.type || '',
    });
  };
  
  // 处理缴费提交
  const handlePaymentOk = () => {
    paymentForm.validateFields()
      .then(values => {
        const paymentRecord: PaymentRecord = {
          id: `PAY${Date.now()}`,
          studentId: currentStudent?.id || '',
          paymentType: values.paymentType,
          amount: values.amount,
          paymentMethod: values.paymentMethod,
          transactionDate: values.transactionDate.format('YYYY-MM-DD'),
          regularClasses: values.regularClasses || 0,
          bonusClasses: values.bonusClasses || 0,
          validUntil: values.validUntil.format('YYYY-MM-DD'),
          gift: values.gift || '',
          remarks: values.remarks || '',
          courseId: values.courseId,
          courseName: selectedPaymentCourseName,
        };

        if (currentStudent) {
          // 在实际应用中，这里会调用API更新学生信息
          // 以下是模拟更新学生记录的代码
          const originalRemaining = parseInt(currentStudent.remainingClasses.split('/')[0]) || 0;
          const originalTotal = parseInt(currentStudent.remainingClasses.split('/')[1]) || 0;
          const newRemaining = originalRemaining + values.regularClasses + values.bonusClasses;
          const newTotal = originalTotal + values.regularClasses + values.bonusClasses;
          
          // 更新学生的剩余课时和有效期
          currentStudent.remainingClasses = `${newRemaining}/${newTotal}`;
          currentStudent.expireDate = values.validUntil.format('YYYY-MM-DD');
          
          // 添加支付记录
          currentStudent.payments = [...(currentStudent.payments || []), paymentRecord];
        }

        message.success('缴费信息已保存');
        setVisible(false);
        
        // 重置表单和状态
        setCurrentStudent(null);
        paymentForm.resetFields();
      })
      .catch(error => {
        console.error('表单验证失败:', error);
      });
  };
  
  // 关闭缴费模态框
  const handlePaymentCancel = () => {
    setVisible(false);
    setCurrentStudent(null);
    paymentForm.resetFields();
  };

  return {
    paymentModalVisible: visible,
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