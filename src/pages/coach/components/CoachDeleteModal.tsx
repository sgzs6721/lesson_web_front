import React from 'react';
import { Modal } from 'antd';

interface CoachDeleteModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const CoachDeleteModal: React.FC<CoachDeleteModalProps> = ({
  visible,
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
      okButtonProps={{ danger: true }}
    >
      <p>确定要删除这位教练吗？此操作不可逆。</p>
    </Modal>
  );
};

export default CoachDeleteModal; 