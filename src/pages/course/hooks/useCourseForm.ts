import { useState } from 'react';
import { Form } from 'antd';
import { Course } from '../types/course';
import { CoachSimple } from '@/api/coach/types';

export const useCourseForm = (
  onAddCourse: (values: any, coaches: CoachSimple[]) => Promise<any>,
  onUpdateCourse: (id: string, values: any, coaches: CoachSimple[]) => Promise<any>,
  coaches: CoachSimple[] = []
) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);

  // 显示添加表单
  const handleAdd = () => {
    form.resetFields();
    // 设置当前校区ID
    form.setFieldsValue({
      coachIds: [],
      campusId: Number(localStorage.getItem('currentCampusId') || '1')
    });
    setEditingCourse(null);
    setVisible(true);
  };

  // 显示编辑表单
  const handleEdit = (record: Course) => {
    console.log('准备编辑课程:', JSON.stringify(record, null, 2));
    console.log('课程状态值:', record.status);

    // 为确保组件内部能正确处理，先在这里保留一份课程完整信息
    const courseToEdit = {
      ...record,
      // 确保状态值保持一致
      status: record.status
    };
    
    // 仅设置编辑状态，表单数据会在CourseEditModal组件中完整设置
    setEditingCourse(courseToEdit);
    
    // 显示模态框
    setVisible(true);
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      console.log('提交表单，表单值:', values);
      console.log('可用教练列表:', coaches);

      if (editingCourse) {
        // 更新操作
        await onUpdateCourse(editingCourse.id, values, coaches);
      } else {
        // 添加操作
        await onAddCourse(values, coaches);
      }
      
      // 提交成功后关闭模态框
      setVisible(false);
      setEditingCourse(null);
      form.resetFields();
    } catch (error) {
      console.error('表单提交失败:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 取消操作
  const handleCancel = () => {
    setVisible(false);
    setEditingCourse(null);
    form.resetFields();
  };

  return {
    form,
    visible,
    editingCourse,
    loading,
    handleAdd,
    handleEdit,
    handleSubmit,
    handleCancel
  };
};