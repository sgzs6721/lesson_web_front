import React from 'react';
import { Modal, Divider } from 'antd';

interface PaymentDeleteModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const PaymentDeleteModal: React.FC<PaymentDeleteModalProps> = ({
  visible,
  onConfirm,
  onCancel
}) => {
  return (
    <Modal
      title="确认删除"
      open={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="确定"
      cancelText="取消"
      okButtonProps={{ danger: true }}
    >
      <Divider style={{ margin: '0 0 24px 0' }} />
      <p>您确定要删除这条缴费记录吗？此操作不可撤销。</p>
    </Modal>
  );
};

export default PaymentDeleteModal; 