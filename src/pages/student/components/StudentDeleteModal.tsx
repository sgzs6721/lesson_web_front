import React from 'react';
import { Modal, Button, Divider } from 'antd';

interface StudentDeleteModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const StudentDeleteModal: React.FC<StudentDeleteModalProps> = ({
  visible,
  onConfirm,
  onCancel
}) => {
  return (
    <Modal
      title={
        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
          删除确认
        </span>
      }
      open={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="确认删除"
      cancelText="取消"
      okButtonProps={{ danger: true }}
    >
      <Divider style={{ margin: '0 0 24px 0' }} />
      <p style={{ margin: 0 }}>确定要删除此学员吗？此操作不可恢复。</p>
    </Modal>
  );
};

export default StudentDeleteModal; 