import React from 'react';
import { Modal } from 'antd';

interface ConstantDeleteModalProps {
  visible: boolean;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConstantDeleteModal: React.FC<ConstantDeleteModalProps> = ({
  visible,
  title,
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
      <p>确定要删除"{title}"选项吗？此操作不可恢复。</p>
    </Modal>
  );
};

export default ConstantDeleteModal; 