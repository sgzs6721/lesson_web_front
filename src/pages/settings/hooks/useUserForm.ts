import { useState } from 'react';
import { Form } from 'antd';
import { User, UserRole } from '../types/user';
import { DEFAULT_STATUS } from '../constants/userOptions';

export const useUserForm = (
  onAddUser: (values: any) => Promise<any>,
  onUpdateUser: (id: string, values: any) => Promise<void>,
  onResetPassword?: (id: string, phone?: string) => Promise<void>
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
        status: DEFAULT_STATUS,
        password: '' // 初始化密码字段为空，等待电话号码输入后自动设置
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
    let roleValue: UserRole;
    if (typeof record.role === 'object' && record.role !== null) {
      // 如果是对象，尝试获取角色枚举值
      if (record.role.id === 1 || record.role.id === '1') {
        roleValue = UserRole.SUPER_ADMIN;
      } else if (record.role.id === 2 || record.role.id === '2') {
        roleValue = UserRole.COLLABORATOR;
      } else if (record.role.id === 3 || record.role.id === '3') {
        roleValue = UserRole.CAMPUS_ADMIN;
      } else {
        roleValue = UserRole.COLLABORATOR; // 默认值
      }
    } else {
      // 如果是数字或字符串，转换为枚举
      if (String(record.role) === '1' || String(record.role) === 'SUPER_ADMIN') {
        roleValue = UserRole.SUPER_ADMIN;
      } else if (String(record.role) === '2' || String(record.role) === 'COLLABORATOR') {
        roleValue = UserRole.COLLABORATOR;
      } else if (String(record.role) === '3' || String(record.role) === 'CAMPUS_ADMIN') {
        roleValue = UserRole.CAMPUS_ADMIN;
      } else {
        roleValue = record.role as UserRole;
      }
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

      // 设置密码字段为手机号的后8位
      if (record.phone && record.phone.length >= 8) {
        formValues.password = record.phone.slice(-8);
      } else if (record.phone) {
        formValues.password = record.phone;
      } else {
        formValues.password = '';
      }
      console.log('设置密码为手机号后8位:', formValues.password);

      // 如果有校区数据且角色是校区管理员，添加校区字段
      if (roleValue === UserRole.CAMPUS_ADMIN) {
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

        // 确保角色字段存在，无论是否是超级管理员
        if (!updateValues.role) {
          // 如果没有角色字段，使用原始用户的角色
          if (typeof editingUser.role === 'object' && editingUser.role !== null) {
            // 如果是对象，尝试获取角色枚举值
            if (editingUser.role.id === 1 || editingUser.role.id === '1') {
              updateValues.role = UserRole.SUPER_ADMIN;
            } else if (editingUser.role.id === 2 || editingUser.role.id === '2') {
              updateValues.role = UserRole.COLLABORATOR;
            } else if (editingUser.role.id === 3 || editingUser.role.id === '3') {
              updateValues.role = UserRole.CAMPUS_ADMIN;
            } else {
              updateValues.role = UserRole.COLLABORATOR; // 默认值
            }
          } else {
            // 如果是数字或字符串，转换为枚举
            if (String(editingUser.role) === '1' || String(editingUser.role) === 'SUPER_ADMIN') {
              updateValues.role = UserRole.SUPER_ADMIN;
            } else if (String(editingUser.role) === '2' || String(editingUser.role) === 'COLLABORATOR') {
              updateValues.role = UserRole.COLLABORATOR;
            } else if (String(editingUser.role) === '3' || String(editingUser.role) === 'CAMPUS_ADMIN') {
              updateValues.role = UserRole.CAMPUS_ADMIN;
            } else {
              updateValues.role = editingUser.role as UserRole;
            }
          }
          console.log('使用原始用户的角色:', updateValues.role);
        }

        // 如果角色不是校区管理员，删除校区字段
        if (updateValues.role !== UserRole.CAMPUS_ADMIN) {
          delete updateValues.campus;
        }

        console.log('更新用户的处理后的值:', updateValues);
        onUpdateUser(editingUser.id, updateValues);
      } else {
        // 添加新用户
        // 确保密码字段被设置为手机号的后8位
        const addValues = { ...values };
        // 无论是否设置了密码，都使用手机号的后8位
        if (addValues.phone && addValues.phone.length >= 8) {
          addValues.password = addValues.phone.slice(-8);
        } else if (addValues.phone) {
          addValues.password = addValues.phone;
        }
        console.log('添加用户时设置密码为手机号后8位:', addValues.password);
        console.log('添加用户的处理后的值:', addValues);
        onAddUser(addValues);
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
        await onResetPassword(editingUser.id, editingUser.phone);

        // 重置密码后，更新密码输入框的值为手机号的后8位
        if (editingUser.phone && editingUser.phone.length >= 8) {
          form.setFieldsValue({ password: editingUser.phone.slice(-8) });
        } else if (editingUser.phone) {
          form.setFieldsValue({ password: editingUser.phone });
        }

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