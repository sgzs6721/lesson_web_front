import { useState, useCallback } from 'react';
import { User, UserSearchParams } from '../types/user';
import { message } from 'antd';
import { API } from '@/api';
import { UserStatus } from '@/api/user/types';
import { apiUserToUser, userStatusToApiStatus } from '../adapters/userAdapter';
import { DEFAULT_STATUS } from '../constants/userOptions';
import { getCampusList } from '@/components/CampusSelector';

// 根据校区ID获取校区名称
const getCampusNameById = async (campusId: string | number): Promise<string> => {
  try {
    // 获取所有校区列表
    const campusList = await getCampusList();

    // 查找匹配的校区
    const campus = campusList.find(campus => String(campus.id) === String(campusId));

    // 如果找到则返回名称，否则返回未设置
    return campus ? campus.name : '未设置';
  } catch (error) {
    console.error('获取校区名称失败:', error);
    return '未知校区';
  }
};

export const useUserData = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // 跟踪当前的搜索参数和分页信息
  const [currentQueryParams, setCurrentQueryParams] = useState<any>({
    page: 1,
    pageSize: 10
  });

  // 添加用户
  const addUser = async (values: Omit<User, 'id' | 'createdAt'>) => {
    try {
      setLoading(true);

      // 调用API创建用户
      const userId = await API.user.create({
        phone: values.phone,
        password: values.phone.substring(values.phone.length - 6), // 默认密码为手机号后6位
        realName: values.name || '',
        roleId: typeof values.role === 'object' ? values.role.id : values.role, // 处理对象类型的角色
        campusId: typeof values.campus === 'object' ? values.campus.id : values.campus, // 处理对象类型的校区
        status: values.status === 'ENABLED' ? UserStatus.ENABLED : UserStatus.DISABLED // 添加状态参数
      });

      // 创建新用户对象
      const newUser: User = {
        id: String(userId),
        phone: values.phone,
        name: values.name,
        role: values.role,
        // 处理校区数据，确保它是一个包含 id 和 name 的对象
        campus: typeof values.campus === 'object'
          ? values.campus
          : values.campus
          ? {
              id: values.campus,
              name: await getCampusNameById(values.campus)
            }
          : undefined,
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

      console.log('更新用户原始数据:', { id, values });

      // 检查是否是超级管理员
      // 获取当前用户的完整信息
      const currentUser = users.find(user => user.id === id);
      const isSuperAdmin = currentUser && (
        (typeof currentUser.role === 'object' && currentUser.role !== null && String(currentUser.role.id) === '1') ||
        (typeof currentUser.role === 'string' && String(currentUser.role) === '1')
      );

      console.log('当前用户是否超级管理员:', isSuperAdmin);

      // 处理角色ID - 只有当values中包含角色信息时才处理
      const roleId = !isSuperAdmin && values.role ? (typeof values.role === 'object' ? values.role.id : values.role) : undefined;

      // 处理校区ID
      const campusId = typeof values.campus === 'object' ? values.campus.id : values.campus;

      // 处理状态
      const status = values.status ?
        (values.status === 'ENABLED' ? UserStatus.ENABLED : UserStatus.DISABLED) :
        UserStatus.ENABLED;

      // 构建符合API要求的参数
      const updateParams: any = {
        id: Number(id) || 0,  // 确保是数字
        realName: values.name || '',
        phone: values.phone || '',
        // institutionId 不需要传递
        status: status
      };

      // 强制添加roleId字段，无论是否是超级管理员
      if (currentUser && currentUser.role) {
        // 使用当前用户的角色ID
        updateParams.roleId = typeof currentUser.role === 'object' ?
          Number(currentUser.role.id) : Number(currentUser.role);
        console.log('强制添加角色ID:', updateParams.roleId);
      } else {
        // 如果无法获取当前用户的角色ID，使用默认值2（协同管理员）
        updateParams.roleId = 2;
        console.log('无法获取角色ID，使用默认值:', updateParams.roleId);
      }

      // 只有当提供了校区信息时才添加campusId字段
      if (campusId) {
        updateParams.campusId = Number(campusId) || 0;
      }

      console.log('发送给API的更新参数:', updateParams);

      // 调用API更新用户
      await API.user.update(updateParams);

      // 更新成功后，重新获取用户列表数据
      try {
        // 使用当前的查询参数重新获取数据
        // 这样可以保持当前的搜索条件和分页信息
        const queryParams = { ...currentQueryParams };

        // 删除搜索参数，因为它不是API需要的参数
        delete queryParams.searchParams;

        console.log('重新获取用户列表的查询参数:', queryParams);

        // 调用API获取用户列表
        const result = await API.user.getList(queryParams);

        // 转换数据格式
        const transformedUsers = result.list.map(apiUserToUser);

        // 更新状态
        setUsers(transformedUsers);
        setTotal(result.total);

        console.log('更新用户后重新获取用户列表成功');
      } catch (error) {
        console.error('更新用户后重新获取用户列表失败:', error);
      }

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

      // 更新当前的查询参数
      setCurrentQueryParams({
        ...queryParams,
        searchParams: { ...params }  // 保存原始的搜索参数，以便后续重新查询
      });

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