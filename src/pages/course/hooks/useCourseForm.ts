import { useState } from 'react';
import { Form } from 'antd';
import { Course } from '../types/course';

export const useCourseForm = (
  onAddCourse: (values: any) => void,
  onUpdateCourse: (id: string, values: any) => void
) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);
  
  // 显示添加表单
  const handleAdd = () => {
    form.resetFields();
    setEditingCourse(null);
    setVisible(true);
  };
  
  // 显示编辑表单
  const handleEdit = (record: Course) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingCourse(record);
    setVisible(true);
  };
  
  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (editingCourse) {
        onUpdateCourse(editingCourse.id, values);
      } else {
        onAddCourse(values);
      }
      
      setVisible(false);
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