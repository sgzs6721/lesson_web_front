import { useState } from 'react';
import { message } from 'antd';
import { User } from '../types/user';
import { UserRole } from '../types/user';
import { DEFAULT_STATUS } from '../constants/userOptions';
import { apiUserToUser } from '../adapters/userAdapter';
import { user as API } from '@/api/user';
import { UserStatus } from '@/api/user/types';

// 辅助函数：根据角色枚举获取角色名称
function getRoleName(role: UserRole): string {
  switch(role) {
    case UserRole.SUPER_ADMIN:
      return '超级管理员';
    case UserRole.COLLABORATOR:
      return '协同管理员';
    case UserRole.CAMPUS_ADMIN:
      return '校区管理员';
    default:
      return '未知角色';
  }
}

// 辅助函数：根据校区ID获取校区名称
async function getCampusNameById(campusId: number): Promise<string> {
  // 这里应该调用API获取校区名称
  // 暂时返回默认值
  return `校区${campusId}`;
}

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

      // 处理多角色数据
      let rolesData: any[] = [];
      if (values.roles && values.roles.length > 0) {
        // 使用新的多角色数据结构
        rolesData = values.roles.map(roleItem => ({
          name: roleItem.name,
          campusId: roleItem.campusId
        }));
      } else {
        // 兼容旧版本的单角色数据
        let roleValue: UserRole;
        if (typeof values.role === 'object' && values.role !== null) {
          if (values.role.id === 1 || values.role.id === '1') {
            roleValue = UserRole.SUPER_ADMIN;
          } else if (values.role.id === 2 || values.role.id === '2') {
            roleValue = UserRole.COLLABORATOR;
          } else if (values.role.id === 3 || values.role.id === '3') {
            roleValue = UserRole.CAMPUS_ADMIN;
          } else {
            roleValue = UserRole.COLLABORATOR;
          }
        } else {
          if (String(values.role) === '1' || String(values.role) === 'SUPER_ADMIN') {
            roleValue = UserRole.SUPER_ADMIN;
          } else if (String(values.role) === '2' || String(values.role) === 'COLLABORATOR') {
            roleValue = UserRole.COLLABORATOR;
          } else if (String(values.role) === '3' || String(values.role) === 'CAMPUS_ADMIN') {
            roleValue = UserRole.CAMPUS_ADMIN;
          } else {
            roleValue = values.role as UserRole;
          }
        }

        let campusId: number | null = null;
        if (values.campus) {
          if (typeof values.campus === 'object' && values.campus !== null) {
            campusId = Number(values.campus.id);
          } else {
            campusId = Number(values.campus);
          }
        }

        rolesData = [{ name: roleValue, campusId }];
      }

      console.log('创建用户时使用的角色数据:', rolesData);

      // 调用API创建用户
      const userId = await API.create({
        phone: values.phone,
        password: values.phone.slice(-8), // 默认密码为手机号后8位
        realName: values.name || '',
        roles: rolesData, // 使用多角色数据
        status: values.status === 'ENABLED' ? UserStatus.ENABLED : UserStatus.DISABLED
      });

      // 创建新用户对象
      const newUser: User = {
        id: String(userId),
        phone: values.phone,
        name: values.name,
        roles: rolesData, // 设置多角色数据
        role: rolesData.length > 0 ? {
          id: rolesData[0].name === 'SUPER_ADMIN' ? 1 : 
              rolesData[0].name === 'COLLABORATOR' ? 2 : 3,
          name: getRoleName(rolesData[0].name)
        } : {
          id: 2,
          name: '协同管理员'
        },
        roleName: rolesData.length > 0 ? getRoleName(rolesData[0].name) : '',
        campus: rolesData.length > 0 && rolesData[0].campusId ? {
          id: rolesData[0].campusId,
          name: await getCampusNameById(rolesData[0].campusId)
        } : undefined,
        status: DEFAULT_STATUS,
        statusText: DEFAULT_STATUS === 'ENABLED' ? '启用' : '禁用',
        createdAt: new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }).replace(/\//g, '-'),
        createdTime: new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }).replace(/\//g, '-'),
      };

      // 添加到用户列表
      setUsers(prevUsers => [newUser, ...prevUsers]);
      setTotal(prevTotal => prevTotal + 1);

      message.success('用户创建成功');
    } catch (error: any) {
      message.error(error.message || '创建用户失败');
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

      // 处理多角色数据
      let rolesData: any[] = [];
      if (values.roles && values.roles.length > 0) {
        // 使用新的多角色数据结构
        rolesData = values.roles.map(roleItem => ({
          name: roleItem.name,
          campusId: roleItem.campusId
        }));
      } else {
        // 兼容旧版本的单角色数据
        let roleValue: UserRole;
        if (values.role) {
          if (typeof values.role === 'object' && values.role !== null) {
            if (values.role.id === 1 || values.role.id === '1') {
              roleValue = UserRole.SUPER_ADMIN;
            } else if (values.role.id === 2 || values.role.id === '2') {
              roleValue = UserRole.COLLABORATOR;
            } else if (values.role.id === 3 || values.role.id === '3') {
              roleValue = UserRole.CAMPUS_ADMIN;
            } else {
              roleValue = UserRole.COLLABORATOR;
            }
          } else {
            const roleId = Number(values.role);
            if (roleId === 1) {
              roleValue = UserRole.SUPER_ADMIN;
            } else if (roleId === 2) {
              roleValue = UserRole.COLLABORATOR;
            } else if (roleId === 3) {
              roleValue = UserRole.CAMPUS_ADMIN;
            } else {
              roleValue = UserRole.COLLABORATOR;
            }
          }
        } else {
          roleValue = UserRole.COLLABORATOR;
        }

        let campusId: number | null = null;
        if (values.campus) {
          if (typeof values.campus === 'object' && values.campus !== null) {
            campusId = Number(values.campus.id);
          } else {
            campusId = Number(values.campus);
          }
        }

        rolesData = [{ name: roleValue, campusId }];
      }

      console.log('更新用户时使用的角色数据:', rolesData);

      // 准备更新参数
      const updateParams: any = {
        id: Number(id),
        phone: values.phone,
        realName: values.name,
        roles: rolesData, // 使用多角色数据
        status: values.status === 'ENABLED' ? UserStatus.ENABLED : UserStatus.DISABLED
      };

      console.log('发送给API的更新参数:', updateParams);

      // 调用API更新用户
      await API.update(updateParams);

      // 更新成功后，重新获取用户列表数据
      try {
        // 使用当前的查询参数重新获取数据
        const queryParams = { ...currentQueryParams };

        // 删除搜索参数，因为它不是API需要的参数
        delete queryParams.searchParams;

        console.log('重新获取用户列表的查询参数:', queryParams);

        // 调用API获取用户列表
        const result = await API.getList(queryParams);

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
      await API.delete(id);

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
  const resetPassword = async (id: string, phone?: string) => {
    try {
      setLoading(true);

      // 取手机号后8位作为新密码
      let password = '';
      if (phone && phone.length >= 8) {
        password = phone.slice(-8);
      }
      await API.resetPassword({ id, password });
    } catch (error: any) {
      message.error(error.message || '重置密码失败');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 筛选用户
  const filterUsers = async (params: any, page: number, pageSize: number) => {
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
        queryParams.role = params.selectedRole;
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
      const result = await API.getList(queryParams);

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
  };

  // 重置数据（获取所有用户）
  const resetData = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      // 调用API获取用户列表
      const result = await API.getList({ page, pageSize });

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
  };

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