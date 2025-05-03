import { useState, useEffect, useCallback } from 'react';
import { Form, message } from 'antd';
import { Student, CourseInfo } from '../types/student'; // 导入 CourseInfo
import { SimpleCourse } from '@/api/course/types'; // 导入 SimpleCourse
import { getStudentAllCourses } from '../utils/student'; // 导入辅助函数
import dayjs from 'dayjs';
// import API from '@/api';

/**
 * 转班（同一学员转课程）模态框 Hook
 * @param courseList 全局课程列表
 * @returns 转班模态框相关的状态和函数
 */
export const useTransferClassModal = (
  courseList?: SimpleCourse[]
) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [availableCourses, setAvailableCourses] = useState<SimpleCourse[]>([]); // 可选目标课程
  const [loading, setLoading] = useState(false);
  // 原始课程 ID，类型应为 string | number | null
  const [originalCourseId, setOriginalCourseId] = useState<string | number | null>(null);
  const [maxTransferHours, setMaxTransferHours] = useState<number>(0); // 最大可转课时

  // 辅助函数：确保 ID 为 string | number | null
  const normalizeCourseId = (id: string | number | undefined | null): string | number | null => {
    return id ?? null;
  };

  // 计算当前学员的课程列表和最大可转课时
  const calculateStudentCourseInfo = useCallback((student: Student | null) => {
    if (!student) return { courses: [], maxHours: 0 };
    const studentCourses = getStudentAllCourses(student).filter(
      course => course.status !== '未报名'
    );
    const defaultCourse = studentCourses.length > 0 ? studentCourses[0] : null;
    let remainingHours = 0;
    if (defaultCourse) {
      if (student.courses) {
        const courseInfo = student.courses.find((c: CourseInfo) => String(c.courseId) === String(defaultCourse.id));
        if (courseInfo && courseInfo.remainingHours !== undefined) {
          remainingHours = courseInfo.remainingHours;
        } else if (defaultCourse.remainingClasses) { // 兼容旧数据结构
          const parts = defaultCourse.remainingClasses.split('/');
          if (parts.length > 0 && !isNaN(Number(parts[0]))) remainingHours = Number(parts[0]);
        }
      } else if (student.remainingClasses) { // 兼容最外层数据
         const parts = student.remainingClasses.split('/');
         if (parts.length > 0 && !isNaN(Number(parts[0]))) remainingHours = Number(parts[0]);
      }
    }
    return { courses: studentCourses, maxHours: remainingHours > 0 ? remainingHours : 0 };
  }, []);

  // 副作用：更新可选课程
  useEffect(() => {
    if (currentStudent && courseList) {
      console.log('[TransferClassModal] 当前学员:', currentStudent);
      const currentCourseIdNorm = normalizeCourseId(originalCourseId); // 使用 state 中的 originalCourseId
      // 过滤掉原课程
      const filteredCourses = courseList.filter(course => String(course.id) !== String(currentCourseIdNorm));
      setAvailableCourses(filteredCourses);
      console.log('[TransferClassModal] 可选目标课程:', filteredCourses);
    }
  }, [currentStudent, courseList, originalCourseId]); // 依赖 originalCourseId

  const showModal = useCallback((student: Student) => {
    console.log('[TransferClassModal] 打开模态框，学员:', student);
    setCurrentStudent(student);
    form.resetFields(); // 重置表单

    const { courses: studentCourses, maxHours } = calculateStudentCourseInfo(student);
    setMaxTransferHours(maxHours);

    const defaultCourse = studentCourses.length > 0 ? studentCourses[0] : null;
    const originalId = normalizeCourseId(defaultCourse?.id);
    const originalName = defaultCourse?.name ?? '未知课程';
    setOriginalCourseId(originalId); // 设置 state

    let expireDate = defaultCourse?.expireDate ?? student.expireDate ?? '';
    if (defaultCourse && student.courses) {
        const courseInfo = student.courses.find((c: CourseInfo) => String(c.courseId) === String(defaultCourse.id));
        if (courseInfo && !expireDate && courseInfo.endDate) expireDate = courseInfo.endDate;
    }

    const formValues: any = {
      studentName: student.name,
      fromCourseId: originalName, // 显示原课程名
      _courseId: originalId,     // 隐藏原课程ID
      toCourseId: undefined,     // 清空目标课程
      transferClassHours: maxHours > 0 ? maxHours : 1, // 默认转所有剩余课时或 1
      refundClassHours: maxHours > 0 ? maxHours : 1, // 隐藏字段，用于UI显示最大值
      priceDifference: 0,
      reason: undefined,
    };

    if (expireDate) {
      try {
        const dateObj = dayjs(expireDate);
        if (dateObj.isValid()) {
          formValues.validUntil = dateObj; // 设置默认有效期
        }
      } catch (error) { console.error('设置有效期失败:', error); }
    }

    form.setFieldsValue(formValues);
    setIsModalVisible(true);
  }, [form, calculateStudentCourseInfo]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      console.log('[TransferClassModal] 表单验证通过:', values);
      console.log('[TransferClassModal] 原始课程 ID:', originalCourseId);

      if (!currentStudent?.id) {
        message.error('未找到学员信息');
        setLoading(false);
        return;
      }
      if (originalCourseId === null) {
          message.error('无法获取原始课程信息');
          setLoading(false);
          return;
      }

      // 查找原始课程在 student.courses 中的记录 ID (如果存在)
      const studentCourseRecord = currentStudent?.courses?.find((c: CourseInfo) => String(c.courseId) === String(originalCourseId));
      const studentCourseId = (studentCourseRecord as any)?.id; // 这个 ID 可能用于某些 API

      // 获取目标课程名称
      let toCourseName = `课程${values.toCourseId}`;
      const toCourse = courseList?.find(c => String(c.id) === String(values.toCourseId));
      if (toCourse) toCourseName = toCourse.name;

      const params = {
        sourceCourseId: studentCourseId ? String(studentCourseId) : undefined, // 可能需要，也可能不需要
        studentId: currentStudent.id,
        fromCourseId: originalCourseId, // 原始课程 ID
        targetCourseId: values.toCourseId, // 目标课程 ID
        targetClassName: toCourseName, // 目标课程名称
        transferClassHours: values.transferClassHours,
        priceDifference: values.priceDifference,
        validUntil: values.validUntil ? values.validUntil.format('YYYY-MM-DD') : '',
        reason: values.reason,
        // ... 其他可能需要的参数，如 operatorId
      };

      console.log('[TransferClassModal] 构造 API 参数:', params);
      // --- API 调用 (转班/转课程) ---
      // await API.student.transferClass(params); // 替换为实际 API
      await new Promise(resolve => setTimeout(resolve, 500));
      // --- API 调用结束 ---

      message.success('转班成功');
      setIsModalVisible(false);
      form.resetFields();
      setCurrentStudent(null);
      setOriginalCourseId(null);
      setMaxTransferHours(0);
    } catch (errorInfo) {
      console.error('[TransferClassModal] 表单验证/API错误:', errorInfo);
      message.error('转班失败，请检查表单或联系管理员');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = useCallback(() => {
    console.log('[TransferClassModal] 关闭模态框');
    setIsModalVisible(false);
    form.resetFields();
    setCurrentStudent(null);
    setOriginalCourseId(null);
    setMaxTransferHours(0);
  }, [form]);

  return {
    isTransferClassModalVisible: isModalVisible,
    transferClassForm: form,
    currentStudentForTransferClass: currentStudent,
    availableCoursesForTransferClass: availableCourses, // 注意这里是 Course 列表
    transferClassLoading: loading,
    originalCourseIdForTransferClass: originalCourseId, // 返回原始课程ID
    maxTransferHoursForTransferClass: maxTransferHours, // 返回最大可转课时
    showTransferClassModal: showModal,
    handleTransferClassOk: handleOk,
    handleTransferClassCancel: handleCancel,
  };
}; 