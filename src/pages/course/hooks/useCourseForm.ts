import { useState } from 'react';
import { Form } from 'antd';
import { Course } from '../types/course';
import { CoachSimple } from '@/api/coach/types';

export const useCourseForm = (
  onAddCourse: (values: any) => Promise<any>,
  onUpdateCourse: (id: string, values: any) => Promise<any>,
  _coaches: CoachSimple[] = [] // Renamed to _coaches to indicate it's not used
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

    // 不在这里重置表单，会在CourseEditModal组件中处理
    // form.resetFields() 可能会导致表单实例未连接
    
    // 仅设置编辑状态，表单数据会在CourseEditModal组件中完整设置
    setEditingCourse(record);
    
    // 显示模态框
    setVisible(true);
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // 确保教练IDs是数组
      let coachIds = values.coachIds || [];
      if (!Array.isArray(coachIds)) {
        coachIds = [coachIds].filter(Boolean);
      }
      // 确保所有元素都是字符串
      coachIds = coachIds.map((id: any) => String(id));

      // 确保 typeId 是数字类型
      const typeId = values.typeId ? Number(values.typeId) : undefined;
      if (!typeId) {
        console.error('课程类型 ID 不能为空');
        throw new Error('课程类型不能为空');
      }

      console.log('提交的教练IDs:', coachIds);
      console.log('提交的课程类型 ID (typeId):', typeId);

      // 确保校区ID存在
      const campusId = values.campusId || Number(localStorage.getItem('currentCampusId') || '1');

      // 确保课程描述为空字符串而不是undefined
      const description = values.description || '';

      const formData = {
        ...values,
        coachIds: coachIds,
        campusId: campusId,
        description: description,
        typeId: typeId // 显式设置 typeId
      };

      console.log('提交的表单数据:', formData);

      try {
        if (editingCourse) {
          await onUpdateCourse(editingCourse.id, formData);
        } else {
          await onAddCourse(formData);
        }

        setVisible(false);
      } catch (apiError) {
        console.error('调用API错误:', apiError);
        // 不关闭模态框，允许用户修改后重试
      }
    } catch (error) {
      console.error('表单验证错误:', error);
    } finally {
      setLoading(false);
    }
  };

  // 取消表单
  const handleCancel = () => {
    setVisible(false);
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