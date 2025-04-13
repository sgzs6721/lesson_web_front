import React from 'react';
import { Modal } from 'antd';
import { Campus } from '../types/campus';

interface CampusStatusModalProps {
  visible: boolean;
  campus: Campus | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const CampusStatusModal: React.FC<CampusStatusModalProps> = ({
  visible,
  campus,
  onConfirm,
  onCancel
}) => {
  return (
    <Modal
      title="操作确认"
      open={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="确认"
      cancelText="取消"
    >
      <p>确定要{campus?.status === 'CLOSED' ? '启用' : '停用'}校区「{campus?.name}」吗？</p>
    </Modal>
  );
};

export default CampusStatusModal; 