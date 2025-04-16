import { useState } from 'react';
import { Form } from 'antd';
import { User } from '../types/user';
import { DEFAULT_STATUS } from '../constants/userOptions';

export const useUserForm = (
  onAddUser: (values: any) => Promise<any>,
  onUpdateUser: (id: string, values: any) => Promise<void>,
  onResetPassword?: (id: string) => Promise<void>
) => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // 显示添加用户模态框
  const showAddModal = () => {
    // 重置表单字段
    form.resetFields();
    setEditingUser(null);
    setIsModalVisible(true);

    // 使用setTimeout确保在模态框渲染后设置默认值
    setTimeout(() => {
      form.setFieldsValue({
        status: DEFAULT_STATUS
      });
    }, 200);
  };

  // 显示编辑用户模态框
  const showEditModal = (record: User) => {
    // 先重置表单
    form.resetFields();
    setEditingUser(record);
    setIsModalVisible(true);

    // 打印记录信息，便于调试
    console.log('编辑用户记录:', JSON.stringify(record, null, 2));

    // 处理角色数据
    let roleValue: string;
    if (typeof record.role === 'object' && record.role !== null) {
      roleValue = String(record.role.id);
    } else {
      roleValue = String(record.role);
    }
    console.log('处理后的角色值:', roleValue);

    // 处理校区数据
    let campusValue = record.campus;
    if (typeof record.campus === 'object' && record.campus !== null) {
      campusValue = String(record.campus.id);
    }
    console.log('处理后的校区值:', campusValue);

    // 处理状态数据
    let statusValue = record.status;
    if (typeof statusValue === 'number') {
      statusValue = statusValue === 1 ? 'ENABLED' : 'DISABLED';
    }
    console.log('处理后的状态值:', statusValue);

    // 使用setTimeout确保在模态框渲染后设置表单值
    setTimeout(() => {
      // 设置表单值
      const formValues: any = {
        name: record.name,
        phone: record.phone,
        role: roleValue,
        status: statusValue || DEFAULT_STATUS
      };

      // 如果有校区数据且角色是校区管理员，添加校区字段
      if (roleValue === '3' || String(roleValue) === '3') {
        formValues.campus = campusValue || '';
      }

      console.log('设置表单值:', formValues);
      form.setFieldsValue(formValues);

      // 强制触发表单重新渲染
      setTimeout(() => {
        // 再次检查表单值
        const currentValues = form.getFieldsValue();
        console.log('设置后的表单值:', currentValues);
      }, 100);
    }, 300);
  };

  // 处理模态框确认
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      console.log('表单提交的原始值:', values);

      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));

      if (editingUser) {
        // 编辑现有用户
        // 准备更新数据
        const updateValues: any = {
          ...values,
          // 确保姓名和电话字段存在
          name: values.name || editingUser.name,
          phone: values.phone || editingUser.phone,
          // 确保状态字段存在
          status: values.status || editingUser.status || 'ENABLED'
        };

        // 如果角色不是校区管理员，删除校区字段
        if (updateValues.role !== '3') {
          delete updateValues.campus;
        }

        console.log('更新用户的处理后的值:', updateValues);
        onUpdateUser(editingUser.id, updateValues);
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
    setIsModalVisible(false);
    setTimeout(() => {
      form.resetFields();
    }, 100);
  };

  // 处理重置密码
  const handleResetPassword = async () => {
    if (editingUser && onResetPassword) {
      try {
        setLoading(true);
        await onResetPassword(editingUser.id);
        return true;
      } catch (error) {
        console.error('重置密码失败:', error);
        return false;
      } finally {
        setLoading(false);
      }
    }
    return false;
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