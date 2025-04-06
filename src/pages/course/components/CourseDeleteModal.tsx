import React from 'react';
import { Modal } from 'antd';

interface CourseDeleteModalProps {
  visible: boolean;
  courseName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const CourseDeleteModal: React.FC<CourseDeleteModalProps> = ({
  visible,
  courseName,
  onConfirm,
  onCancel
}) => {
  return (
    <Modal
      title="删除课程"
      open={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="确认删除"
      cancelText="取消"
      okButtonProps={{ danger: true }}
    >
      <p>确定要删除课程 <strong>{courseName}</strong> 吗？</p>
      <p>此操作不可恢复，删除后数据将无法找回。</p>
    </Modal>
  );
};

export default CourseDeleteModal; 