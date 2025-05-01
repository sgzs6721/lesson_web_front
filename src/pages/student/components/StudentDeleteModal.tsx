import React from 'react';
import { Modal, Button, Divider } from 'antd';

interface StudentDeleteModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  student?: {
    id: string;
    name?: string;
  };
}

const StudentDeleteModal: React.FC<StudentDeleteModalProps> = ({
  visible,
  onConfirm,
  onCancel,
  student
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
      centered
      maskClosable={false}
    >
      <Divider style={{ margin: '0 0 24px 0' }} />
      <p style={{ fontSize: '16px', margin: '0 0 16px 0' }}>
        确定要删除以下学员吗？此操作不可恢复。
      </p>
      
      {student && (
        <div style={{ 
          marginBottom: '16px',
        }}>
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #ff4d4f',
            borderRadius: '4px',
            padding: '12px 20px',
            backgroundColor: '#f9f9f9',
          }}>
            <div style={{ marginRight: '32px' }}>
              <span style={{ color: '#333' }}>学员姓名：</span> 
              <span style={{ color: '#1677ff', fontWeight: 'bold' }}>{student.name}</span>
            </div>
            <div>
              <span style={{ color: '#333' }}>学员ID：</span> 
              <span style={{ color: '#1677ff', fontWeight: 'bold' }}>{student.id}</span>
            </div>
          </div>
        </div>
      )}
      
      <p style={{ color: '#ff4d4f', margin: '0', fontWeight: 'bold' }}>
        删除后，该学员的所有数据将被清除，且无法恢复！
      </p>
    </Modal>
  );
};

export default StudentDeleteModal; 