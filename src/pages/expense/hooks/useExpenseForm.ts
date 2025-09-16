import { useState } from 'react';
import { Form, message } from 'antd';
import { Expense } from '../types/expense';
import dayjs from 'dayjs';
import { API } from '@/api';
import { CreateFinanceRecordRequest } from '@/api/finance';
import { TRANSACTION_TYPE } from '../constants/expenseTypes';

export const useFinanceForm = (
  onAddTransaction: (values: any) => void,
  onUpdateTransaction: (id: string, values: any) => void
) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [transactionType, setTransactionType] = useState<'EXPEND' | 'INCOME'>('EXPEND');

  const handleAddTransaction = () => {
    form.resetFields();
    setEditingId(null);
    setVisible(true);
  };

  const handleTypeChange = (type: 'EXPEND' | 'INCOME') => {
    setTransactionType(type);
  };

  const handleEdit = (record: Expense) => {
    form.setFieldsValue({
      ...record,
      date: dayjs(record.date),
      amount: Number(record.amount) // 确保金额是数字类型
    });
    setEditingId(record.id);
    setTransactionType(record.type);
    setVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (editingId) {
        // 编辑现有记录 - 暂时使用本地更新
        onUpdateTransaction(editingId, values);
        message.success('记录更新成功');
      } else {
        // 添加新记录 - 调用真实API
        const currentCampusId = localStorage.getItem('currentCampusId') || '1';
        
        const apiData: CreateFinanceRecordRequest = {
          type: transactionType,
          date: values.date.format('YYYY-MM-DD'),
          item: values.item, // 这里会传递枚举值（如 'FIXED_COST'）或字符串
          amount: values.amount,
          categoryId: values.category,
          notes: values.remark || '',
          campusId: Number(currentCampusId)
        };

        await API.finance.createRecord(apiData);
        
        // 调用本地添加方法更新界面
        onAddTransaction({
          ...values,
          type: transactionType
        });
        
        message.success(`${transactionType === 'EXPEND' ? '支出' : '收入'}记录添加成功`);
      }

      setVisible(false);
    } catch (error: any) {
      console.error('提交错误:', error);
      message.error(error.message || '提交失败，请重试');
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