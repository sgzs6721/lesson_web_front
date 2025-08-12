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

  // 将后端返回的角色名称/枚举规范化为前端使用的枚举键
  const normalizeRoleName = (rawName?: string, roleEnum?: string): UserRole => {
    const upperEnum = (roleEnum || '').toString().toUpperCase();
    if (upperEnum === UserRole.SUPER_ADMIN) return UserRole.SUPER_ADMIN;
    if (upperEnum === UserRole.CAMPUS_ADMIN) return UserRole.CAMPUS_ADMIN;
    if (upperEnum === UserRole.COLLABORATOR) return UserRole.COLLABORATOR;

    const name = (rawName || '').toString();
    if (name.includes('超级')) return UserRole.SUPER_ADMIN;
    if (name.includes('校区')) return UserRole.CAMPUS_ADMIN;
    return UserRole.COLLABORATOR;
  };

  // 显示添加用户模态框
  const showAddModal = () => {
    form.resetFields();
    setEditingUser(null);
    setIsModalVisible(true);

    setTimeout(() => {
      form.setFieldsValue({
        status: DEFAULT_STATUS,
        password: '',
        roles: []
      });
    }, 200);
  };

  // 显示编辑用户模态框
  const showEditModal = (record: User) => {
    form.resetFields();
    setEditingUser(record);
    setIsModalVisible(true);

    console.log('编辑用户记录:', JSON.stringify(record, null, 2));

    // 处理多角色数据
    let rolesValue: UserRoleItem[] = [];
    if (record.roles && record.roles.length > 0) {
      rolesValue = (record.roles as any[]).map((r: any) => ({
        name: normalizeRoleName(r.name as string | undefined, r.roleEnum as string | undefined),
        campusId: r.campusId ?? null,
        campusName: r.campusName,
      }));
    } else if (record.role) {
      let roleName: UserRole;
      if (typeof record.role === 'object' && record.role !== null) {
        const roleId = Number((record.role as any).id);
        if (roleId === 1) roleName = UserRole.SUPER_ADMIN;
        else if (roleId === 2) roleName = UserRole.COLLABORATOR;
        else if (roleId === 3) roleName = UserRole.CAMPUS_ADMIN;
        else roleName = UserRole.COLLABORATOR;
      } else {
        const roleId = Number(record.role as any);
        if (roleId === 1) roleName = UserRole.SUPER_ADMIN;
        else if (roleId === 2) roleName = UserRole.COLLABORATOR;
        else if (roleId === 3) roleName = UserRole.CAMPUS_ADMIN;
        else roleName = UserRole.COLLABORATOR;
      }

      let campusId: number | null = null;
      if ((record as any).campus) {
        if (typeof (record as any).campus === 'object' && (record as any).campus !== null) {
          campusId = Number((record as any).campus.id);
        } else {
          campusId = Number((record as any).campus);
        }
      }

      rolesValue = [{ name: roleName, campusId }];
    }

    // 处理状态数据
    let statusValue: any = (record as any).status;
    if (typeof statusValue === 'number') {
      statusValue = statusValue === 1 ? 'ENABLED' : 'DISABLED';
    }
    console.log('处理后的状态值:', statusValue);
    console.log('处理后的角色值:', rolesValue);

    setTimeout(() => {
      form.setFieldsValue({
        name: (record as any).name || (record as any).realName || '',
        phone: (record as any).phone || '',
        status: statusValue,
        roles: rolesValue
      });
    }, 300);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      console.log('表单提交的原始值:', values);

      await new Promise(resolve => setTimeout(resolve, 500));

      if (editingUser) {
        const updateValues: any = {
          ...values,
          name: values.name || editingUser.name,
          phone: values.phone || editingUser.phone,
          status: values.status || (editingUser as any).status || 'ENABLED',
          roles: values.roles || []
        };

        if (!updateValues.roles || updateValues.roles.length === 0) {
          updateValues.roles = [{ name: UserRole.COLLABORATOR, campusId: null }];
        }

        console.log('编辑用户的处理后的值:', updateValues);
        await onUpdateUser(editingUser.id, updateValues);
      } else {
        const addValues = { ...values } as any;
        if (addValues.phone && addValues.phone.length >= 8) {
          addValues.password = addValues.phone.slice(-8);
        } else if (addValues.phone) {
          addValues.password = addValues.phone;
        }

        if (!addValues.roles || addValues.roles.length === 0) {
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

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setTimeout(() => {
      form.resetFields();
    }, 100);
  };

  const handleResetPassword = async () => {
    if (editingUser && onResetPassword) {
      try {
        setLoading(true);
        await onResetPassword(editingUser.id, editingUser.phone);

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