import { useState } from 'react';
import { Form, message } from 'antd';
import { Campus } from '../types/campus';

type AddFunction = (values: Partial<Campus>) => Promise<Campus>;
type UpdateFunction = (id: string, values: Partial<Campus>) => Promise<void>;

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
      phone: record.phone
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
        try {
          // 尝试更新校区
          await updateCampus(String(editingCampus.id), values);
          message.success('校区信息已更新');

          // 只有在更新成功时才重置表单并关闭模态框
          form.resetFields();
          setVisible(false);
        } catch (updateError) {
          // 更新失败时，不关闭模态框，允许用户修改输入
          console.error('更新校区失败:', updateError);
          message.error('更新校区失败，请检查输入并重试');
        }
      } else {
        // 添加新校区
        try {
          await addCampus(values);
          message.success('校区添加成功');

          // 只有在添加成功时才重置表单并关闭模态框
          form.resetFields();
          setVisible(false);
        } catch (addError) {
          // 添加失败时，不关闭模态框，允许用户修改输入
          console.error('添加校区失败:', addError);
          message.error('添加校区失败，请检查输入并重试');
        }
      }
    } catch (error: any) {
      // 表单验证错误
      if (error.errorFields) {
        message.error('请正确填写所有必填字段');
      } else {
        message.error('操作失败，请稍后重试');
        console.error('Form submit failed:', error);
      }
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