import { useState } from 'react';
import { User, UserSearchParams } from '../types/user';
import { mockUsers } from '../constants/mockData';
import { message } from 'antd';

export const useUserData = () => {
  const [users, setUsers] = useState<User[]>(mockUsers.slice(0, 10)); // 初始只显示前10条
  const [total, setTotal] = useState(mockUsers.length);
  const [loading, setLoading] = useState(false);
  
  // 添加用户
  const addUser = (values: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      id: `U${10000 + Math.floor(Math.random() * 90000)}`,
      ...values,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUsers(prevUsers => [newUser, ...prevUsers]);
    setTotal(prev => prev + 1);
    message.success('用户添加成功');
    return newUser;
  };
  
  // 更新用户
  const updateUser = (id: string, values: Partial<User>) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === id 
          ? { ...user, ...values } 
          : user
      )
    );
    message.success('用户信息已更新');
  };
  
  // 删除用户
  const deleteUser = (id: string) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
    setTotal(prev => prev - 1);
    message.success('用户已删除');
  };
  
  // 筛选用户
  const filterUsers = (params: UserSearchParams, page: number, pageSize: number) => {
    setLoading(true);
    try {
      let filteredData = mockUsers;
      
      if (params.searchText) {
        filteredData = filteredData.filter(
          user => 
            user.phone.includes(params.searchText) || 
            user.name.includes(params.searchText) || 
            user.id.includes(params.searchText)
        );
      }
      
      if (params.selectedRole.length > 0) {
        filteredData = filteredData.filter(user => params.selectedRole.includes(user.role));
      }

      if (params.selectedCampus.length > 0) {
        filteredData = filteredData.filter(user => user.campus && params.selectedCampus.includes(user.campus));
      }

      if (params.selectedStatus.length > 0) {
        filteredData = filteredData.filter(user => params.selectedStatus.includes(user.status));
      }
      
      setTotal(filteredData.length);
      
      // 分页
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      setUsers(filteredData.slice(start, end));
      
      return filteredData;
    } catch (error) {
      message.error('获取用户列表失败');
      console.error(error);
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  // 重置数据
  const resetData = (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      // 重置为原始数据并应用分页
      setTotal(mockUsers.length);
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      setUsers(mockUsers.slice(start, end));
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
    filterUsers,
    resetData,
    setLoading
  };
}; 