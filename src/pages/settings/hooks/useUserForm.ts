import { useState } from 'react';
import { Form } from 'antd';
import { User } from '../types/user';

export const useUserForm = (
  onAddUser: (values: any) => void,
  onUpdateUser: (id: string, values: any) => void
) => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  
  // 显示添加用户模态框
  const showAddModal = () => {
    form.resetFields();
    form.setFieldsValue({ status: 'active' });
    setEditingUser(null);
    setIsModalVisible(true);
  };
  
  // 显示编辑用户模态框
  const showEditModal = (record: User) => {
    setEditingUser(record);
    form.setFieldsValue({
      name: record.name,
      phone: record.phone,
      role: record.role,
      campus: record.campus,
      status: record.status
    });
    setIsModalVisible(true);
  };
  
  // 处理模态框确认
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (editingUser) {
        // 编辑现有用户
        onUpdateUser(editingUser.id, values);
      } else {
        // 添加新用户
        onAddUser(values);
      }
      
      setIsModalVisible(false);
    } catch (error) {
      console.error('表单验证失败:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // 处理模态框取消
  const handleModalCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };
  
  // 处理重置密码
  const handleResetPassword = () => {
    if (editingUser) {
      // 实际项目中应该调用重置密码API
      return editingUser;
    }
    return null;
  };
  
  return {
    form,
    isModalVisible,
    editingUser,
    loading,
    showAddModal,
    showEditModal,
    handleModalOk,
    handleModalCancel,
    handleResetPassword
  };
}; 