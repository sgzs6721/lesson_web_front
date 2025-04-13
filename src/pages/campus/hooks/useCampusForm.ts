import { useState } from 'react';
import { Form } from 'antd';
import { Campus } from '../types/campus';

type AddFunction = (values: Partial<Campus>) => Campus;
type UpdateFunction = (id: string, values: Partial<Campus>) => void;

export const useCampusForm = (
  addCampus: AddFunction,
  updateCampus: UpdateFunction
) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingCampus, setEditingCampus] = useState<Campus | null>(null);

  // 显示添加校区模态框
  const handleAdd = () => {
    form.resetFields();
    setEditingCampus(null);
    setVisible(true);
  };

  // 显示编辑校区模态框
  const handleEdit = (record: Campus) => {
    setEditingCampus(record);
    form.setFieldsValue({
      name: record.name,
      address: record.address,
      status: record.status,
      monthlyRent: record.monthlyRent || 0,
      propertyFee: record.propertyFee || 0,
      utilityFee: record.utilityFee || 0,
      contactPerson: record.contactPerson,
      phone: record.phone,
    });
    setVisible(true);
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      if (editingCampus) {
        // 编辑现有校区
        await updateCampus(editingCampus.id, values);
      } else {
        // 添加新校区
        await addCampus(values);
      }

      form.resetFields();
      setVisible(false);
    } catch (error) {
      console.error('Validate Failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // 取消表单
  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  return {
    form,
    visible,
    loading,
    editingCampus,
    handleAdd,
    handleEdit,
    handleSubmit,
    handleCancel
  };
};