import { useState, useCallback } from 'react';
import { User, UserSearchParams } from '../types/user';
import { message } from 'antd';
import { API } from '@/api';
import { UserStatus } from '@/api/user/types';
import { apiUserToUser, userStatusToApiStatus } from '../adapters/userAdapter';
import { DEFAULT_STATUS } from '../constants/userOptions';

export const useUserData = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // 添加用户
  const addUser = async (values: Omit<User, 'id' | 'createdAt'>) => {
    try {
      setLoading(true);

      // 调用API创建用户
      const userId = await API.user.create({
        phone: values.phone,
        password: values.phone.substring(values.phone.length - 6), // 默认密码为手机号后6位
        realName: values.name,
        roleId: typeof values.role === 'object' ? values.role.id : values.role, // 处理对象类型的角色
        campusId: typeof values.campus === 'object' ? values.campus.id : values.campus, // 处理对象类型的校区
        status: values.status === 'ENABLED' ? UserStatus.ACTIVE : UserStatus.INACTIVE // 添加状态参数
      });

      // 创建新用户对象
      const newUser: User = {
        id: String(userId),
        phone: values.phone,
        name: values.name,
        role: values.role,
        campus: values.campus,
        status: DEFAULT_STATUS,
        createdAt: new Date().toISOString().split('T')[0],
      };

      // 更新状态
      setUsers(prevUsers => [newUser, ...prevUsers]);
      setTotal(prev => prev + 1);
      message.success('用户添加成功');
      return newUser;
    } catch (error: any) {
      message.error(error.message || '添加用户失败');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 更新用户
  const updateUser = async (id: string, values: Partial<User>) => {
    try {
      setLoading(true);

      // 调用API更新用户
      await API.user.update({
        id,
        phone: values.phone,
        realName: values.name,
        roleId: typeof values.role === 'object' ? values.role.id : values.role, // 处理对象类型的角色
        campusId: typeof values.campus === 'object' ? values.campus.id : values.campus // 处理对象类型的校区
      });

      // 如果状态发生变化，调用更新状态API
      if (values.status) {
        await API.user.updateStatus({
          id,
          status: userStatusToApiStatus(values.status)
        });
      }

      // 更新本地状态
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === id
            ? { ...user, ...values }
            : user
        )
      );

      message.success('用户信息已更新');
    } catch (error: any) {
      message.error(error.message || '更新用户失败');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 删除用户
  const deleteUser = async (id: string) => {
    try {
      setLoading(true);

      // 调用API删除用户
      await API.user.delete(id);

      // 更新本地状态
      setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
      setTotal(prev => prev - 1);

      message.success('用户已删除');
    } catch (error: any) {
      message.error(error.message || '删除用户失败');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 重置密码
  const resetPassword = async (id: string) => {
    try {
      setLoading(true);

      // 调用API重置密码
      await API.user.resetPassword({ id });

      message.success('密码已重置');
    } catch (error: any) {
      message.error(error.message || '重置密码失败');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 筛选用户
  const filterUsers = useCallback(async (params: UserSearchParams, page: number, pageSize: number) => {
    setLoading(true);
    try {
      // 构建API查询参数
      const queryParams: any = {
        page,
        pageSize
      };

      // 搜索文本作为关键字参数
      if (params.searchText) {
        queryParams.keyword = params.searchText;
      }

      // 角色筛选 - 支持多选
      if (params.selectedRole.length > 0) {
        // 将角色ID数组添加到查询参数中
        queryParams.roleIds = params.selectedRole;
      }

      // 校区筛选 - 支持多选
      if (params.selectedCampus.length > 0) {
        // 将校区ID数组添加到查询参数中
        queryParams.campusIds = params.selectedCampus;
      }

      // 状态筛选 - 单选
      if (params.selectedStatus !== undefined) {
        // 直接使用状态值
        queryParams.status = params.selectedStatus;
      }

      // 调用API获取用户列表
      const result = await API.user.getList(queryParams);

      // 转换数据格式
      const transformedUsers = result.list.map(apiUserToUser);

      // 更新状态
      setUsers(transformedUsers);
      setTotal(result.total);

      return transformedUsers;
    } catch (error: any) {
      message.error(error.message || '获取用户列表失败');
      console.error(error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // 重置数据（获取所有用户）
  const resetData = useCallback(async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      // 调用API获取用户列表
      const result = await API.user.getList({ page, pageSize });

      // 转换数据格式
      const transformedUsers = result.list.map(apiUserToUser);

      // 更新状态
      setUsers(transformedUsers);
      setTotal(result.total);
    } catch (error: any) {
      message.error(error.message || '获取用户列表失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    users,
    total,
    loading,
    addUser,
    updateUser,
    deleteUser,
    resetPassword,
    filterUsers,
    resetData,
    setLoading
  };
};