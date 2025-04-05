import React from 'react';
import { Modal } from 'antd';

interface CampusDeleteModalProps {
  visible: boolean;
  campusName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const CampusDeleteModal: React.FC<CampusDeleteModalProps> = ({
  visible,
  campusName,
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
      <p>确定要删除校区「{campusName}」吗？此操作不可逆！</p>
    </Modal>
  );
};

export default CampusDeleteModal; 