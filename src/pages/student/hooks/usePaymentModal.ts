import { useState, useEffect } from 'react';
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
  // 只有在需要Form时才创建Form实例，避免未连接警告
  const [paymentForm] = Form.useForm();
  const [selectedPaymentCourse, setSelectedPaymentCourse] = useState<string | number>('');
  const [selectedPaymentCourseName, setSelectedPaymentCourseName] = useState<string>('');
  const [currentClassHours, setCurrentClassHours] = useState<number>(0);
  const [newClassHours, setNewClassHours] = useState<number>(0);
  const [totalClassHours, setTotalClassHours] = useState<number>(0);
  const [newValidUntil, setNewValidUntil] = useState<string>('—');
  
  // 确保在组件挂载时表单已经连接，防止警告
  useEffect(() => {
    return () => {
      // 在组件卸载时重置表单，以防止内存泄漏
      paymentForm.resetFields();
    };
  }, [paymentForm]);

  // 显示缴费模态框
  const showModal = (student: Student) => {
    setCurrentStudent(student);
    paymentForm.resetFields();

    // 获取学生所有课程
    const courses = getStudentAllCourses(student);
    console.log('获取到的学生课程列表:', courses);

    if (courses.length === 0) {
      // 直接从学生对象中提取基本信息创建默认课程
      console.warn('学生课程列表为空，尝试从学生对象创建默认课程');
      
      // 使用课程ID (如果有)
      let defaultCourseId = '';
      if (student.courseId) {
        defaultCourseId = String(student.courseId);
      } else {
        defaultCourseId = '1'; // 默认ID
      }
      
      // 尝试确定课程名称
      let defaultCourseName = '';
      // 尝试从StudentDTO字段获取（如果有）
      const studentDto = student as any;
      if (studentDto.courseName) {
        defaultCourseName = studentDto.courseName;
      } 
      // 根据学生姓名推断可能的课程
      else if (student.name.includes('杨')) {
        defaultCourseName = '杨教练一对一';
      } 
      // 使用默认课程名
      else {
        defaultCourseName = '一对一课程';
      }
      
      // 确定课程类型
      const defaultCourseType = student.courseType || '一对一';
      
      // 显示警告提示，但不阻止继续操作
      message.warning('该学生缺少完整课程信息，使用默认课程进行缴费');
      
      console.log('使用默认课程信息:', {
        id: defaultCourseId,
        name: defaultCourseName,
        type: defaultCourseType
      });
      
      // 设置选中的课程
      setSelectedPaymentCourse(defaultCourseId);
      setSelectedPaymentCourseName(defaultCourseName);
      
      // 提取并处理剩余课时 - 从student.remainingClasses中提取
      const remainingHours = Number(student.remainingClasses ? student.remainingClasses.split('/')[0] : 0);
      console.log('[课时初始化] 当前剩余课时:', remainingHours);
      
      // 设置课时预览初始值
      setCurrentClassHours(remainingHours);
      setNewClassHours(0);
      setTotalClassHours(remainingHours); // 初始时总课时等于当前剩余课时
      setNewValidUntil(dayjs().add(180, 'day').format('YYYY-MM-DD'));
      
      // 表单值设置（regularClasses和bonusClasses保持为0）
      paymentForm.setFieldsValue({
        courseType: defaultCourseType,
        courseId: defaultCourseId,
        student: student.id,
        transactionDate: dayjs(),
        validUntil: dayjs().add(180, 'day'),
        regularClasses: 0,
        bonusClasses: 0,
      });
      
      setVisible(true);
      return;
    }

    // 使用第一个课程作为默认选中课程
    const defaultCourse = courses[0];
    const courseId = defaultCourse.id || '';
    const courseName = defaultCourse.name || '';
    const courseType = defaultCourse.type || '';

    console.log('选中的课程信息:', {
      id: courseId,
      name: courseName,
      type: courseType
    });

    // 设置选中的课程
    setSelectedPaymentCourse(courseId);
    setSelectedPaymentCourseName(courseName);

    // 查找选中课程对应的API返回的课程信息
    let remainingHours = 0;
    if (student.courses && student.courses.length > 0) {
      const selectedCourseInfo = student.courses.find(course => String(course.courseId) === String(courseId));
      if (selectedCourseInfo && selectedCourseInfo.remainingHours !== undefined) {
        remainingHours = selectedCourseInfo.remainingHours;
        console.log('[课时初始化] 从课程信息中获取剩余课时:', remainingHours);
      } else {
        // 如果找不到对应的课程信息，使用旧的方式获取剩余课时
        remainingHours = Number(student.remainingClasses ? student.remainingClasses.split('/')[0] : 0);
        console.log('[课时初始化] 未找到课程信息，使用学生对象剩余课时:', remainingHours);
      }
    } else {
      // 如果学生没有courses数组，使用旧的方式获取剩余课时
      remainingHours = Number(student.remainingClasses ? student.remainingClasses.split('/')[0] : 0);
      console.log('[课时初始化] 学生缺少courses数组，使用学生对象剩余课时:', remainingHours);
    }
    
    // 设置课时预览初始值
    setCurrentClassHours(remainingHours);
    setNewClassHours(0);
    setTotalClassHours(remainingHours); // 初始时总课时等于当前剩余课时
    setNewValidUntil(dayjs().add(180, 'day').format('YYYY-MM-DD'));

    // 表单值设置（regularClasses和bonusClasses保持为0）
    paymentForm.setFieldsValue({
      courseType: courseType,
      courseId: courseId,
      student: student.id,
      transactionDate: dayjs(),
      validUntil: dayjs().add(180, 'day'),
      regularClasses: 0,
      bonusClasses: 0,
    });

    setVisible(true);
  };

  // 处理课时变化
  const handleClassHoursChange = () => {
    const regularClasses = Number(paymentForm.getFieldValue('regularClasses') || 0);
    const bonusClasses = Number(paymentForm.getFieldValue('bonusClasses') || 0);
    
    // 计算本次新增课时总数 - 确保使用数字类型
    const totalNewClasses = regularClasses + bonusClasses;
    setNewClassHours(totalNewClasses);
    
    // 简化计算：变更后总课时 = 当前剩余课时 + 本次新增课时
    const totalClasses = Number(currentClassHours) + totalNewClasses;
    setTotalClassHours(totalClasses);
    
    console.log('[简化课时计算]', {
      当前剩余课时: Number(currentClassHours),
      本次新增课时: totalNewClasses,
      变更后总课时: totalClasses
    });
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
    if (!currentStudent) return;
    
    // 获取学生所有课程
    const courses = getStudentAllCourses(currentStudent);
    
    // 查找选中的课程
    const selectedCourse = courses.find(course => String(course.id) === String(courseId));
    if (!selectedCourse) return;
    
    // 更新选中的课程信息
    setSelectedPaymentCourse(courseId);
    setSelectedPaymentCourseName(selectedCourse.name);
    
    // 从API返回的课程信息中获取剩余课时
    let remainingHours = 0;
    if (currentStudent.courses && currentStudent.courses.length > 0) {
      const selectedCourseInfo = currentStudent.courses.find(course => String(course.courseId) === String(courseId));
      if (selectedCourseInfo && selectedCourseInfo.remainingHours !== undefined) {
        remainingHours = selectedCourseInfo.remainingHours;
        console.log('[课程变更] 从课程信息中获取剩余课时:', remainingHours);
      } else {
        // 如果找不到对应的课程信息，使用当前显示的剩余课时
        remainingHours = currentClassHours;
        console.log('[课程变更] 未找到课程信息，使用当前剩余课时:', remainingHours);
      }
    } else {
      // 如果学生没有courses数组，使用当前显示的剩余课时
      remainingHours = currentClassHours;
      console.log('[课程变更] 学生缺少courses数组，使用当前剩余课时:', remainingHours);
    }
    
    // 更新剩余课时和总课时
    setCurrentClassHours(remainingHours);
    
    // 获取表单中的正课课时和赠送课时
    const regularClasses = Number(paymentForm.getFieldValue('regularClasses') || 0);
    const bonusClasses = Number(paymentForm.getFieldValue('bonusClasses') || 0);
    const totalNewClasses = regularClasses + bonusClasses;
    
    // 更新总课时 = 选中课程的剩余课时 + 新增课时
    setTotalClassHours(remainingHours + totalNewClasses);
    
    // 更新表单中的课程类型
    paymentForm.setFieldsValue({
      courseType: selectedCourse.type,
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
        courseId: Number(values.courseId), // 确保courseId是数字类型
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