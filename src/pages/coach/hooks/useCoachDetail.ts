import { useState } from 'react';
import { Coach } from '../types/coach';

export const useCoachDetail = () => {
  const [detailVisible, setDetailVisible] = useState(false);
  const [viewingCoach, setViewingCoach] = useState<Coach | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

  // 显示教练详情
  const showDetail = (record: Coach) => {
    setViewingCoach(record);
    setDetailVisible(true);
  };

  // 关闭详情模态框
  const closeDetail = () => {
    setDetailVisible(false);
    setViewingCoach(null);
  };

  // 显示删除确认
  const showDeleteConfirm = (id: string) => {
    setRecordToDelete(id);
    setDeleteModalVisible(true);
  };

  // 取消删除
  const cancelDelete = () => {
    setDeleteModalVisible(false);
    setRecordToDelete(null);
  };

  return {
    detailVisible,
    viewingCoach,
    deleteModalVisible,
    recordToDelete,
    showDetail,
    closeDetail,
    showDeleteConfirm,
    cancelDelete,
  };
}; 