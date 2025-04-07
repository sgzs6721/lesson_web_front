import { useState } from 'react';

/**
 * 删除确认相关的hook
 * @param deleteFunction 执行删除的函数
 * @returns 删除确认相关的状态和函数
 */
export const useDeleteConfirm = (deleteFunction: (id: string) => void) => {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);
  
  // 显示删除确认框
  const showDeleteConfirm = (id: string) => {
    setRecordToDelete(id);
    setDeleteModalVisible(true);
  };
  
  // 执行删除
  const handleDeleteConfirm = () => {
    if (recordToDelete) {
      deleteFunction(recordToDelete);
      setDeleteModalVisible(false);
      setRecordToDelete(null);
    }
  };
  
  // 取消删除
  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setRecordToDelete(null);
  };
  
  return {
    deleteModalVisible,
    recordToDelete,
    showDeleteConfirm,
    handleDeleteConfirm,
    handleCancelDelete
  };
}; 