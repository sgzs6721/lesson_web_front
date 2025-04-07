import { useState } from 'react';
import { Form, message } from 'antd';
import { Student, CourseGroup } from '@/pages/student/types/student';
import { courseOptions } from '@/pages/student/constants/options';
import dayjs from 'dayjs';

export const useStudentForm = (
  onAddStudent: (student: Omit<Student, 'id'> & { remainingClasses?: string; lastClassDate?: string }) => Student,
  onUpdateStudent: (id: string, student: Partial<Student>) => void
) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [courseGroups, setCourseGroups] = useState<CourseGroup[]>([]);
  const [tempCourseGroup, setTempCourseGroup] = useState<CourseGroup | null>(null);
  const [currentEditingGroupIndex, setCurrentEditingGroupIndex] = useState<number | null>(null);
  const [originalCourseGroup, setOriginalCourseGroup] = useState<CourseGroup | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // 显示添加学员模态框
  const showAddModal = () => {
    form.resetFields();
    setEditingStudent(null);
    setVisible(true);
    setCourseGroups([]);
    setCurrentEditingGroupIndex(null);
    setTempCourseGroup(null);
    setOriginalCourseGroup(null);
    setIsEditing(false);
  };
  
  // 显示编辑学员模态框
  const showEditModal = (student: Student) => {
    form.setFieldsValue({
      ...student,
      expireDate: student.expireDate ? dayjs(student.expireDate) : null,
      enrollDate: student.enrollDate ? dayjs(student.enrollDate) : null,
    });
    
    setEditingStudent(student);
    setVisible(true);
    
    // 如果有课程组信息，使用现有的；否则，创建一个基于主课程的课程组
    if (student.courseGroups && student.courseGroups.length > 0) {
      setCourseGroups(student.courseGroups);
    } else {
      const courseGroup = {
        key: '1',
        courses: Array.isArray(student.course) ? student.course : [student.course],
        courseType: student.courseType,
        coach: student.coach,
        status: student.status,
        enrollDate: student.enrollDate,
        expireDate: student.expireDate,
        scheduleTimes: student.scheduleTimes || []
      };
      
      setCourseGroups([courseGroup]);
      setCurrentEditingGroupIndex(null);
      setTempCourseGroup(null);
      setOriginalCourseGroup(null);
      setIsEditing(false);
    }
  };
  
  // 处理表单提交 (同步 StudentManagement.tsx 中的 handleModalOk)
  const handleSubmit = async () => {
    // 如果有正在编辑的课程组，先完成编辑
    if (currentEditingGroupIndex !== null) {
      message.warning('请先完成当前课程组的编辑');
      return false; // 返回 false 表示提交失败
    }

    // 如果没有添加课程，显示错误提示并阻止提交
    if (courseGroups.length === 0 && !tempCourseGroup) {
      message.error('请至少添加一个课程');
      return false;
    }
    
    // 如果有临时课程组，先尝试确认添加
    if (tempCourseGroup) {
      const confirmed = confirmAddCourseGroup();
      if (!confirmed) {
        return false; // 确认失败，阻止提交
      }
      // 确认成功后，courseGroups 应该已经更新，tempCourseGroup 为 null
    }

    try {
      const values = await form.validateFields();
      setLoading(true);

      // 使用第一个课程组的信息作为主要课程信息
      const primaryGroup = courseGroups[0];
      if (!primaryGroup) {
        message.error('课程信息获取失败');
        setLoading(false);
        return false;
      }

      const formattedValues: Partial<Student> = {
        ...values,
        course: primaryGroup.courses.length > 0 ? primaryGroup.courses[0] : '',
        courseType: primaryGroup.courseType,
        coach: primaryGroup.coach,
        status: primaryGroup.status,
        enrollDate: primaryGroup.enrollDate,
        expireDate: primaryGroup.expireDate,
        scheduleTimes: primaryGroup.scheduleTimes,
        // 添加所有课程组信息
        courseGroups: courseGroups.length > 1 ? courseGroups : undefined
      };

      if (editingStudent) {
        // 编辑现有学员
        onUpdateStudent(editingStudent.id, formattedValues);
        message.success('学员信息已更新');
      } else {
        // 添加新学员
        const newStudentData: Omit<Student, 'id'> & { remainingClasses?: string; lastClassDate?: string } = {
          ...(formattedValues as Omit<Student, 'id'>), // 类型断言
          lastClassDate: '', // 默认值
          remainingClasses: '20/20', // 默认值
        };
        const newStudent = onAddStudent(newStudentData);
        message.success('学员添加成功');

        // 检查是否需要在添加学员后重新打开转课模态框
        // 注意：这个逻辑依赖于 window.sessionStorage，更推荐使用状态管理库
        if (window.sessionStorage.getItem('afterAddStudent') === 'true') {
          window.sessionStorage.removeItem('afterAddStudent');
          // 在 StudentManagementNew.tsx 中监听此状态变化，并触发打开转课模态框
          // 这里只是模拟原逻辑，实际应在父组件处理
          console.log('需要重新打开转课模态框，目标学员:', newStudent);
          // 触发一个事件或回调，通知父组件处理
          window.dispatchEvent(new CustomEvent('studentAddedForTransfer', { detail: newStudent }));
        }
      }

      // 重置状态和表单
      setVisible(false);
      setLoading(false);
      form.resetFields();
      setCourseGroups([]);
      setCurrentEditingGroupIndex(null);
      setTempCourseGroup(null);
      setOriginalCourseGroup(null);
      setIsEditing(false);
      
      return true; // 返回 true 表示提交成功

    } catch (info) {
      console.log('Validate Failed:', info);
      setLoading(false);
      message.error('表单校验失败，请检查输入');
      return false;
    }
  };
  
  // 处理取消
  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
    setEditingStudent(null);
    setCourseGroups([]);
    setCurrentEditingGroupIndex(null);
    setTempCourseGroup(null);
    setOriginalCourseGroup(null);
    setIsEditing(false);
  };
  
  // 添加课程组
  const addCourseGroup = () => {
    const newKey = Date.now().toString();
    const newGroup: CourseGroup = {
      key: newKey,
      courses: [],
      courseType: '',
      coach: '',
      status: 'active',
      enrollDate: dayjs().format('YYYY-MM-DD'),
      expireDate: dayjs().add(6, 'month').format('YYYY-MM-DD'),
      scheduleTimes: []
    };
    
    setTempCourseGroup(newGroup);
    setCurrentEditingGroupIndex(null);
    setOriginalCourseGroup(null);
    setIsEditing(true);
  };
  
  // 更新临时课程组
  const updateTempCourseGroup = (field: keyof CourseGroup, value: any) => {
    if (!tempCourseGroup) return;
    
    // 特殊处理 courses 字段 - 如果选择的课程改变，自动更新教练和课程类型
    if (field === 'courses' && value && value.length > 0) {
      const courseValue = value[0];
      const courseInfo = courseOptions.find(c => c.value === courseValue);
      if (courseInfo) {
        setTempCourseGroup({
          ...tempCourseGroup,
          [field]: value,
          courseType: courseInfo.type,
          coach: courseInfo.coaches[0]
        });
        return;
      }
    }
    
    setTempCourseGroup({ ...tempCourseGroup, [field]: value });
  };
  
  // 更新课程组
  const updateCourseGroup = (index: number, field: keyof CourseGroup, value: any) => {
    const updated = [...courseGroups];
    updated[index] = { ...updated[index], [field]: value };
    setCourseGroups(updated);
  };
  
  // 编辑课程组
  const editCourseGroup = (index: number) => {
    // 如果当前正在添加新课程 (tempCourseGroup 不为 null) 或
    // 正在编辑另一个课程 (currentEditingGroupIndex 不为 null)，则阻止开始新的编辑
    if (tempCourseGroup !== null || currentEditingGroupIndex !== null) {
      message.warning('请先完成当前的课程编辑或添加');
      return false;
    }
    
    const groupToEdit = courseGroups[index];
    // setTempCourseGroup({ ...groupToEdit }); // 移除这行，编辑时不应设置 tempCourseGroup
    setCurrentEditingGroupIndex(index); // 只设置当前编辑索引
    setOriginalCourseGroup({ ...groupToEdit }); // 保存快照用于取消
    setIsEditing(true);
    
    return true;
  };
  
  // 确认添加或编辑课程组
  const confirmAddCourseGroup = () => {
    // 如果是编辑状态
    if (currentEditingGroupIndex !== null) {
      const group = courseGroups[currentEditingGroupIndex];
      // 验证课程组信息 (仅示例，可添加更复杂验证)
      if (!group.courses || group.courses.length === 0) {
        message.error('请选择报名课程');
        return false;
      }
      // 清理编辑状态
      setCurrentEditingGroupIndex(null);
      setOriginalCourseGroup(null);
      setIsEditing(false);
      return true;
    }
    // 如果是添加状态
    else if (tempCourseGroup) {
      // 验证临时课程组信息
      if (!tempCourseGroup.courses || tempCourseGroup.courses.length === 0) {
        message.error('请选择报名课程');
        return false;
      }
      // 添加到课程组列表
      setCourseGroups([...courseGroups, tempCourseGroup]);
      // 清理添加状态
      setTempCourseGroup(null);
      setIsEditing(false);
      return true;
    }
    
    return false; // 没有在编辑或添加，理论上不应执行到这里
  };
  
  // 取消添加或编辑课程组
  const cancelAddCourseGroup = () => {
    // 如果是编辑状态，恢复原始值
    if (currentEditingGroupIndex !== null && originalCourseGroup) {
      const updated = [...courseGroups];
      updated[currentEditingGroupIndex] = originalCourseGroup;
      setCourseGroups(updated);
    } 
    // 如果是添加状态，则不需要恢复，直接清理
    
    // 清理编辑和添加状态
    setTempCourseGroup(null);
    setCurrentEditingGroupIndex(null);
    setOriginalCourseGroup(null);
    setIsEditing(false);
  };
  
  // 移除课程组
  const removeCourseGroup = (key: string) => {
    setCourseGroups(courseGroups.filter(group => group.key !== key));
  };
  
  // 开始添加课程组
  const startAddCourseGroup = () => {
    // 如果当前正在添加新课程 (tempCourseGroup 不为 null) 或
    // 正在编辑另一个课程 (currentEditingGroupIndex 不为 null)，则阻止开始新的添加
    if (tempCourseGroup !== null || currentEditingGroupIndex !== null) {
      message.warning('请先完成当前的课程编辑或添加');
      return false;
    }
    addCourseGroup(); // 调用实际创建 temp group 的函数
    return true;
  };
  
  return {
    form,
    visible,
    loading,
    editingStudent,
    courseGroups,
    tempCourseGroup,
    currentEditingGroupIndex,
    originalCourseGroup,
    isEditing,
    showAddModal,
    showEditModal,
    handleSubmit,
    handleCancel,
    addCourseGroup,
    updateTempCourseGroup,
    updateCourseGroup,
    confirmAddCourseGroup,
    cancelAddCourseGroup,
    editCourseGroup,
    removeCourseGroup,
    startAddCourseGroup
  };
};