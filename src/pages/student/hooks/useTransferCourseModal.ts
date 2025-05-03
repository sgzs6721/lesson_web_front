import { useState, useEffect, useCallback } from 'react';
import { Form, message } from 'antd';
import { Student } from '../types/student';
import { SimpleCourse } from '@/api/course/types';
import { searchStudentsByKeyword } from '../utils/student'; // 导入搜索工具函数
// import { useQuickAddStudentModal } from './useQuickAddStudentModal'; // 暂时注释，文件不存在
import dayjs from 'dayjs';
// import API from '@/api';

/**
 * 转课模态框 Hook
 * @param students 所有学生列表 (用于目标学员搜索)
 * @param courseList 全局课程列表
 * @param addStudent 快速添加学员的回调
 * @returns 转课模态框相关的状态和函数
 */
export const useTransferCourseModal = (
  students: Student[], // 需要学生列表
  courseList?: SimpleCourse[],
  addStudent?: (student: Omit<Student, 'id'> & { remainingClasses?: string; lastClassDate?: string }) => Student | undefined // 需要 addStudent
) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null); // 转出学员
  const [availableCourses, setAvailableCourses] = useState<SimpleCourse[]>([]);
  const [loading, setLoading] = useState(false);
  // 转课逻辑不直接依赖原始课程ID state，但保留 normalize 函数可能有用
  // const [originalCourseId, setOriginalCourseId] = useState<string | number | null>(null);

  // --- 转课特定状态 ---
  const [transferStudentSearchResults, setTransferStudentSearchResults] = useState<Student[]>([]);
  const [isSearchingTransferStudent, setIsSearchingTransferStudent] = useState<boolean>(false);
  const [selectedTransferStudent, setSelectedTransferStudent] = useState<Student | null>(null);
  const [transferStudentSearchText, setTransferStudentSearchText] = useState<string>('');

  // --- 快速添加学员 Hook (暂时注释) ---
  // const {
  //   isQuickAddStudentModalVisible,
  //   quickAddStudentForm,
  //   showQuickAddStudentModal,
  //   handleQuickAddStudentOk: performQuickAddStudent,
  //   handleQuickAddStudentCancel,
  // } = useQuickAddStudentModal(addStudent);

  // 辅助函数：确保 ID 为 string | number | null
  const normalizeCourseId = (id: string | number | undefined | null): string | number | null => {
    return id ?? null;
  };

  // 副作用：更新可选课程 (转课时显示所有课程)
  useEffect(() => {
    if (courseList) {
      setAvailableCourses(courseList);
      console.log('[TransferCourseModal] 可选目标课程 (所有):', courseList);
    }
  }, [courseList]);

  // 显示转课模态框
  const showModal = useCallback((student: Student) => {
    console.log('[TransferCourseModal] 打开模态框，学员:', student);
    setCurrentStudent(student);
    form.resetFields();
    setSelectedTransferStudent(null);
    setTransferStudentSearchText('');
    setTransferStudentSearchResults([]);

    form.setFieldsValue({
      studentId: student.id, // 设置转出学员ID
      studentName: student.name,
      targetStudentId: undefined, // 清空目标学员
      toCourseId: undefined, // 清空目标课程
      transferClassHours: 1, // 默认转出1课时
      priceDifference: 0,
      // validUntil: dayjs().add(1, 'year'), // 可选：设置默认有效期
      reason: undefined,
    });
    setIsModalVisible(true);
  }, [form]);

  // 搜索目标学员 (转课用)
  const handleSearchTransferStudent = useCallback((value: string) => {
    setTransferStudentSearchText(value);
    if (value.trim() === '') {
      setTransferStudentSearchResults([]);
      setIsSearchingTransferStudent(false);
      return;
    }
    setIsSearchingTransferStudent(true);
    // 模拟异步搜索
    setTimeout(() => {
      const results = searchStudentsByKeyword(students, value, currentStudent?.id); // 排除自己
      setTransferStudentSearchResults(results);
      setIsSearchingTransferStudent(false);
    }, 300);
  }, [students, currentStudent]);

  // 选择目标学员 (转课用)
  const handleSelectTransferStudent = useCallback((studentId: string | number) => {
    const selected = students.find(s => s.id === studentId);
    if (selected) {
      setSelectedTransferStudent(selected);
      setTransferStudentSearchText(''); // 清空搜索文本
      setTransferStudentSearchResults([]); // 清空搜索结果
      form.setFieldsValue({ targetStudentId: selected.id }); // 设置表单值
      console.log('[TransferCourseModal] 选中目标学员:', selected);
    } else {
        console.warn('[TransferCourseModal] 未在列表中找到选中的目标学员ID:', studentId);
    }
  }, [students, form]);

  // --- 快速添加学员 OK 处理 (暂时注释) ---
  // const handleQuickAddStudentOk = () => {
  //   const addedStudent = performQuickAddStudent();
  //   if (addedStudent) {
  //     handleSelectTransferStudent(addedStudent.id);
  //   }
  // };

  // 处理模态框确认（提交转课）
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      console.log('[TransferCourseModal] 表单验证通过，提交数据:', values);

      const targetStudentId = values.targetStudentId; // 确认从表单获取
      if (!targetStudentId) {
          message.error('请选择要转课给哪个学员');
          setLoading(false);
          return;
      }
      const targetStudent = students.find(s => s.id === targetStudentId);
       if (!targetStudent) {
          message.error('未找到目标学员信息');
          setLoading(false);
          return;
      }

      // 获取课程名称
      let courseName = '未知课程';
      const selectedCourse = courseList?.find(c => String(c.id) === String(values.toCourseId));
      if (selectedCourse) courseName = selectedCourse.name;

      const params = {
        fromStudentId: currentStudent?.id,
        toStudentId: targetStudentId,
        courseId: values.toCourseId,
        transferClassHours: values.transferClassHours,
        priceDifference: values.priceDifference,
        validUntil: values.validUntil ? values.validUntil.format('YYYY-MM-DD') : '',
        reason: values.reason,
        // ... 其他参数
      };

      console.log('[TransferCourseModal] 构造转课 API 请求参数:', params);
      // --- API 调用 (转课) ---
      // await API.student.transferCourse(params); // 替换为实际 API
      await new Promise(resolve => setTimeout(resolve, 500));
      // --- API 调用结束 ---

      message.success('转课成功');
      setIsModalVisible(false);
      form.resetFields();
      setCurrentStudent(null);
      setSelectedTransferStudent(null);
      setTransferStudentSearchResults([]);
      setTransferStudentSearchText('');
    } catch (errorInfo) {
      console.error('[TransferCourseModal] 表单验证/API错误:', errorInfo);
      message.error('转课失败，请检查表单或联系管理员');
    } finally {
      setLoading(false);
    }
  };

  // 处理模态框取消
  const handleCancel = useCallback(() => {
    console.log('[TransferCourseModal] 关闭模态框');
    setIsModalVisible(false);
    form.resetFields();
    setCurrentStudent(null);
    setSelectedTransferStudent(null);
    setTransferStudentSearchResults([]);
    setTransferStudentSearchText('');
  }, [form]);

  return {
    isTransferCourseModalVisible: isModalVisible,
    transferCourseForm: form,
    currentStudentForTransferCourse: currentStudent, // 转出学员
    availableCoursesForTransferCourse: availableCourses,
    transferCourseLoading: loading,
    showTransferCourseModal: showModal,
    handleTransferCourseOk: handleOk,
    handleTransferCourseCancel: handleCancel,

    // 转课特定状态和处理函数
    transferStudentSearchResults,
    isSearchingTransferStudent,
    selectedTransferStudent,
    handleSearchTransferStudent,
    handleSelectTransferStudent,

    // --- 快速添加学员相关 (暂时注释) ---
    // isQuickAddStudentModalVisible: false, // 返回默认值
    // quickAddStudentForm: undefined, // 返回默认值
    // showQuickAddStudentModal: () => { console.warn('Quick add not available'); }, // 空函数
    // handleQuickAddStudentOk: () => { console.warn('Quick add not available'); }, // 空函数
    // handleQuickAddStudentCancel: () => { console.warn('Quick add not available'); }, // 空函数
  };
}; 