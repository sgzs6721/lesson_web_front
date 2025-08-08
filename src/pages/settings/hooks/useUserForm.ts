import { useState } from 'react';
import { Form } from 'antd';
import { User, UserRole, UserRoleItem } from '../types/user';
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
        password: '', // 初始化密码字段为空，等待电话号码输入后自动设置
        roles: [] // 初始化多角色为空数组
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

    // 处理多角色数据
    let rolesValue: UserRoleItem[] = [];
    if (record.roles && record.roles.length > 0) {
      // 如果已经有新的多角色数据，直接使用
      rolesValue = record.roles;
    } else if (record.role) {
      // 兼容旧版本的单角色数据
      let roleName: UserRole;
      if (typeof record.role === 'object' && record.role !== null) {
        const roleId = Number(record.role.id);
        if (roleId === 1) roleName = UserRole.SUPER_ADMIN;
        else if (roleId === 2) roleName = UserRole.COLLABORATOR;
        else if (roleId === 3) roleName = UserRole.CAMPUS_ADMIN;
        else roleName = UserRole.COLLABORATOR;
      } else {
        const roleId = Number(record.role);
        if (roleId === 1) roleName = UserRole.SUPER_ADMIN;
        else if (roleId === 2) roleName = UserRole.COLLABORATOR;
        else if (roleId === 3) roleName = UserRole.CAMPUS_ADMIN;
        else roleName = UserRole.COLLABORATOR;
      }

      // 获取校区ID
      let campusId: number | null = null;
      if (record.campus) {
        if (typeof record.campus === 'object' && record.campus !== null) {
          campusId = Number(record.campus.id);
        } else {
          campusId = Number(record.campus);
        }
      }

      rolesValue = [{ name: roleName, campusId }];
    }

    // 处理状态数据
    let statusValue = record.status;
    if (typeof statusValue === 'number') {
      statusValue = statusValue === 1 ? 'ENABLED' : 'DISABLED';
    }
    console.log('处理后的状态值:', statusValue);
    console.log('处理后的角色值:', rolesValue);

    // 使用setTimeout确保在模态框渲染后设置值
    setTimeout(() => {
      form.setFieldsValue({
        name: record.name || record.realName || '',
        phone: record.phone || '',
        status: statusValue,
        roles: rolesValue
      });
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
          status: values.status || editingUser.status || 'ENABLED',
          // 处理多角色数据
          roles: values.roles || []
        };

        // 确保角色字段存在，无论是否是超级管理员
        if (!updateValues.roles || updateValues.roles.length === 0) {
          // 如果没有设置角色，使用默认的协同管理员角色
          updateValues.roles = [{ name: UserRole.COLLABORATOR, campusId: null }];
        }

        console.log('编辑用户的处理后的值:', updateValues);
        await onUpdateUser(editingUser.id, updateValues);
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

        // 确保角色字段存在
        if (!addValues.roles || addValues.roles.length === 0) {
          // 如果没有设置角色，使用默认的协同管理员角色
          addValues.roles = [{ name: UserRole.COLLABORATOR, campusId: null }];
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