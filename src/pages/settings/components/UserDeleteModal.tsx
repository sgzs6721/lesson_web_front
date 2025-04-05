import React from 'react';
import { Modal } from 'antd';
import { User } from '../types/user';

interface UserDeleteModalProps {
  visible: boolean;
  user: User | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const UserDeleteModal: React.FC<UserDeleteModalProps> = ({
  visible,
  user,
  onConfirm,
  onCancel
}) => {
  return (
    <Modal
      title="删除确认"
      open={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="确认删除"
      cancelText="取消"
    >
      <p>确定要删除用户「{user?.name}」吗？此操作不可逆！</p>
    </Modal>
  );
};

export default UserDeleteModal; 