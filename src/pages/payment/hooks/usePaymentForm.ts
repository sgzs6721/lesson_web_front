import { useState } from 'react';
import { Form } from 'antd';
import { Payment } from '../types/payment';
import dayjs from 'dayjs';

export const usePaymentForm = (
  onAddPayment: (values: any) => void,
  onUpdatePayment: (id: string, values: any) => void
) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const handleAdd = () => {
    form.resetFields();
    setEditingId(null);
    setVisible(true);
  };
  
  const handleEdit = (record: Payment) => {
    form.setFieldsValue({
      ...record,
      date: dayjs(record.date)
    });
    setEditingId(record.id);
    setVisible(true);
  };
  
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingId) {
        onUpdatePayment(editingId, values);
      } else {
        onAddPayment(values);
      }
      
      setVisible(false);
    } catch (error) {
      console.error('提交错误:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    setVisible(false);
  };
  
  return {
    form,
    visible,
    editingId,
    loading,
    handleAdd,
    handleEdit,
    handleSubmit,
    handleCancel
  };
}; 