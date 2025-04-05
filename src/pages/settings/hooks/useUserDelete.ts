import { useState } from 'react';
import { User } from '../types/user';

export const useUserDelete = (onDelete: (id: string) => void) => {
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  
  // 显示删除确认模态框
  const showDeleteConfirm = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalVisible(true);
  };
  
  // 处理删除用户
  const handleDeleteUser = () => {
    if (userToDelete) {
      onDelete(userToDelete.id);
      setIsDeleteModalVisible(false);
      setUserToDelete(null);
    }
  };
  
  // 关闭删除确认模态框
  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    setUserToDelete(null);
  };
  
  return {
    isDeleteModalVisible,
    userToDelete,
    showDeleteConfirm,
    handleDeleteUser,
    handleDeleteCancel
  };
}; 