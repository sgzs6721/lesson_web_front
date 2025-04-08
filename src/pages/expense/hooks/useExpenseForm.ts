import { useState } from 'react';
import { Form } from 'antd';
import { Expense } from '../types/expense';
import dayjs from 'dayjs';

export const useFinanceForm = (
  onAddTransaction: (values: any) => void,
  onUpdateTransaction: (id: string, values: any) => void
) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');

  const handleAddTransaction = () => {
    form.resetFields();
    setEditingId(null);
    setVisible(true);
  };

  const handleTypeChange = (type: 'income' | 'expense') => {
    setTransactionType(type);
  };

  const handleEdit = (record: Expense) => {
    form.setFieldsValue({
      ...record,
      date: dayjs(record.date)
    });
    setEditingId(record.id);
    setTransactionType(record.type);
    setVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (editingId) {
        onUpdateTransaction(editingId, values);
      } else {
        onAddTransaction({
          ...values,
          type: transactionType
        });
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
    transactionType,
    handleAddTransaction,
    handleTypeChange,
    handleEdit,
    handleSubmit,
    handleCancel
  };
};