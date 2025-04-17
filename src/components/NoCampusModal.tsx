import React from 'react';
import { Modal, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface NoCampusModalProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * 无校区提示模态框
 * 当用户登录后发现没有校区时显示，提示用户需要先创建校区
 */
const NoCampusModal: React.FC<NoCampusModalProps> = ({ visible, onClose }) => {
  const navigate = useNavigate();

  // 跳转到校区管理页面
  const handleGoToCampusManagement = () => {
    onClose();
    navigate('/campuses');
  };

  return (
    <Modal
      open={visible}
      title={null}
      footer={null}
      closable={false}
      maskClosable={false}
      centered
      width={480}
      styles={{ body: { padding: '32px 40px' } }}
    >
      <div style={{ textAlign: 'center' }}>
        <ExclamationCircleOutlined style={{ fontSize: 64, color: '#faad14', marginBottom: 24 }} />
        
        <Title level={4} style={{ marginBottom: 16 }}>
          系统提示
        </Title>
        
        <Paragraph style={{ fontSize: 16, marginBottom: 24 }}>
          您需要先创建至少一个校区才能使用系统的功能。
          请点击下方按钮前往校区管理页面创建校区。
        </Paragraph>
        
        <Button 
          type="primary" 
          size="large" 
          onClick={handleGoToCampusManagement}
          style={{ width: '100%', height: 48 }}
        >
          前往创建校区
        </Button>
      </div>
    </Modal>
  );
};

export default NoCampusModal; 