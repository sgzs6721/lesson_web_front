import { useState } from 'react';
import { Form } from 'antd';
import { Course } from '../types/course';
import { CoachSimple } from '@/api/coach/types';

export const useCourseForm = (
  onAddCourse: (values: any) => Promise<any>,
  onUpdateCourse: (id: string, values: any) => Promise<any>,
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
    // 确保教练IDs是数组
    let coachIds = record.coachIds || [];
    if (!Array.isArray(coachIds)) {
      coachIds = [coachIds].filter(Boolean);
    }
    // 确保所有元素都是字符串
    coachIds = coachIds.map(id => String(id));

    console.log('编辑课程的教练IDs:', coachIds);

    // 将 Course 对象中的 type 字段映射到表单的 typeId 字段
    const formValues = {
      ...record,
      coachIds: coachIds,
      // 确保在编辑时使用正确的 typeId
      typeId: record.typeId || record.type
    };

    console.log('编辑课程时的 typeId:', formValues.typeId);

    form.setFieldsValue(formValues);
    setEditingCourse(record);
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