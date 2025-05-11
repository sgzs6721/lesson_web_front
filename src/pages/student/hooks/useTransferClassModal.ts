import { useState, useEffect, useCallback } from 'react';
import { Form, message } from 'antd';
import { Student, CourseInfo, CourseSummary } from '../types/student'; // 导入 CourseInfo 和 CourseSummary
import { SimpleCourse } from '@/api/course/types'; // 导入 SimpleCourse
import { getStudentAllCourses } from '../utils/student'; // 导入辅助函数
import dayjs from 'dayjs';
import { API } from '@/api'; // 导入API
// import API from '@/api';

/**
 * 转班（同一学员转课程）模态框 Hook
 * @param courseList 全局课程列表
 * @returns 转班模态框相关的状态和函数
 */
export default function useTransferClassModal(
  studentList: Student[],
  courseList?: SimpleCourse[],
  onRefresh?: () => void
) {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [studentCourses, setStudentCourses] = useState<CourseSummary[]>([]);
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
      // 过滤掉原课程，并且只保留状态为PUBLISHED的课程
      const filteredCourses = courseList.filter(course =>
        String(course.id) !== String(currentCourseIdNorm) &&
        (course.status === 'PUBLISHED' || course.status === '1')
      );
      setAvailableCourses(filteredCourses);
      console.log('[TransferClassModal] 可选目标课程:', filteredCourses);
    }
  }, [currentStudent, courseList, originalCourseId]); // 依赖 originalCourseId

  const handleTransferClass = (student: Student) => {
    console.log('处理转班操作，学生:', student.name);

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

    // 更新原始课程ID状态
    setOriginalCourseId(courseId || null);

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

    // 设置最大可转课时
    setMaxTransferHours(remainingHours);

    // 准备表单值
    const formValues: any = {
      studentId: student.id,
      studentName: student.name,
      fromCourseId: courseName, // 显示课程名称，而不是ID
      _courseId: courseId, // 保存课程ID到隐藏字段，以便提交时使用
      operationType: 'transferClass', // 设置为转班
      refundClassHours: remainingHours, // 设置剩余课时
      // 确保转班课时默认为剩余课时
      transferClassHours: remainingHours > 0 ? remainingHours : 1, // 设置默认转课课时为实际剩余课时
    };

    console.log('设置转班课时为:', remainingHours);

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

    // 打开模态框
    setVisible(true);
  };

  const handleCancel = () => {
    console.log('关闭转班模态框');
    setVisible(false);
    setCurrentStudent(null);
    setStudentCourses([]);
    form.resetFields();
  };

  const handleSubmit = async () => {
    console.log('提交转班表单');
    try {
      // 验证表单
      const values = await form.validateFields();
      console.log('表单数据:', values);

      // 设置加载状态
      setLoading(true);

      if (!currentStudent?.id) {
        message.error('未找到学员信息');
        setLoading(false);
        return;
      }

      // 获取表单数据
      const fromCourseId = values._courseId; // 原课程ID
      const toCourseId = values.toCourseId; // 目标课程ID
      const transferHours = values.transferClassHours; // 转班课时
      const reason = values.reason; // 转班原因
      const compensationFee = values.priceDifference || 0; // 补差价

      // 查找原课程的 studentCourse 记录 ID
      const studentCourseRecord = currentStudent?.courses?.find((c: CourseInfo) =>
        String(c.courseId) === String(fromCourseId)
      );

      // 使用类型断言获取ID，因为CourseInfo类型可能没有id属性
      const studentCourseId = (studentCourseRecord as any)?.id || fromCourseId;

      if (!studentCourseId) {
        message.error('无法找到原学员课程记录ID，无法转班');
        setLoading(false);
        return;
      }

      // 获取当前校区ID
      const campusId = localStorage.getItem('currentCampusId');
      if (!campusId) {
        message.warning('未找到校区信息');
      }

      // 构建API请求参数
      const transferData = {
        studentId: Number(currentStudent.id),
        sourceCourseId: Number(studentCourseId),
        targetCourseId: Number(toCourseId),
        transferHours: Number(transferHours),
        compensationFee: Number(compensationFee),
        transferCause: reason,
        campusId: campusId ? Number(campusId) : undefined
      };

      console.log('转班请求数据:', transferData);

      try {
        // 调用转班API
        const response = await API.student.transferWithinCourse(transferData);
        console.log('转班成功:', response);
        message.success('转班成功');

        // 关闭模态框
        handleCancel();

        // 刷新列表
        if (onRefresh) {
          onRefresh();
        }
      } catch (apiError: any) {
        console.error('转班API调用失败:', apiError);
        message.error(`转班失败: ${apiError?.message || '请稍后重试'}`);
      } finally {
        setLoading(false);
      }
    } catch (error) {
      console.error('表单验证失败:', error);
      message.error('请检查表单填写是否完整');
      setLoading(false);
    }
  };

  return {
    form,
    visible,
    currentStudent,
    studentCourses,
    courseList,
    loading, // 导出loading状态
    handleTransferClass,
    handleCancel,
    handleSubmit
  };
}