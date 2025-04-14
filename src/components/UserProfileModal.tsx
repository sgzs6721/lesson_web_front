import React, { useState, useEffect } from 'react';
import { Modal, Avatar, Tabs, Form, Input, Button, message, Divider, Spin } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, IdcardOutlined } from '@ant-design/icons';
import { useAppSelector } from '@/hooks/reduxHooks';

interface UserProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

const { TabPane } = Tabs;

const UserProfileModal: React.FC<UserProfileModalProps> = ({ visible, onClose }) => {
  const [activeTab, setActiveTab] = useState('1');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  
  // 从 Redux 获取用户信息
  const auth = useAppSelector((state) => state.auth);
  const user = auth?.user || {};
  
  useEffect(() => {
    if (visible && user) {
      form.setFieldsValue({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || ''
      });
    }
  }, [visible, user, form]);
  
  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };
  
  const handleUpdateProfile = async (values: any) => {
    setLoading(true);
    try {
      // 这里应该调用 API 更新用户信息
      console.log('更新用户信息:', values);
      
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 800));
      
      message.success('个人信息更新成功');
    } catch (error) {
      message.error('更新失败，请稍后重试');
      console.error('更新个人信息失败:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdatePassword = async (values: any) => {
    setLoading(true);
    try {
      // 这里应该调用 API 更新密码
      console.log('更新密码:', values);
      
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 800));
      
      message.success('密码更新成功');
      passwordForm.resetFields();
    } catch (error) {
      message.error('密码更新失败，请稍后重试');
      console.error('更新密码失败:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Modal
      title={
        <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '0' }}>
          个人信息
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
      centered
      bodyStyle={{ padding: '20px' }}
    >
      <Divider style={{ margin: '0 0 24px 0' }} />
      
      <div style={{ display: 'flex', marginBottom: '24px' }}>
        <div style={{ marginRight: '24px', textAlign: 'center' }}>
          <Avatar 
            size={100} 
            icon={<UserOutlined />} 
            style={{ 
              backgroundColor: '#1890ff',
              fontSize: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </Avatar>
          <div style={{ marginTop: '12px', fontWeight: 'bold' }}>
            {user.name || '用户'}
          </div>
          <div style={{ color: '#666', fontSize: '13px' }}>
            {user.role || '超级管理员'}
          </div>
        </div>
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ 
            padding: '16px', 
            borderRadius: '8px', 
            backgroundColor: 'rgba(24, 144, 255, 0.05)', 
            border: '1px solid rgba(24, 144, 255, 0.1)',
            marginBottom: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <PhoneOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
              <span style={{ fontWeight: 'bold', marginRight: '8px' }}>手机号码:</span>
              <span>{user.phone || '未设置'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <MailOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
              <span style={{ fontWeight: 'bold', marginRight: '8px' }}>电子邮箱:</span>
              <span>{user.email || '未设置'}</span>
            </div>
          </div>
          
          <div style={{ fontSize: '13px', color: '#666' }}>
            您可以在下方标签页中修改您的个人信息和密码。
          </div>
        </div>
      </div>
      
      <Tabs activeKey={activeTab} onChange={handleTabChange} type="card">
        <TabPane tab="基本信息" key="1">
          <Spin spinning={loading}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleUpdateProfile}
              initialValues={{
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                role: user.role || ''
              }}
            >
              <div style={{ display: 'flex', gap: '16px' }}>
                <Form.Item
                  name="name"
                  label="姓名"
                  style={{ flex: 1 }}
                  rules={[{ required: true, message: '请输入姓名' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="请输入姓名" />
                </Form.Item>
                
                <Form.Item
                  name="role"
                  label="角色"
                  style={{ flex: 1 }}
                >
                  <Input prefix={<IdcardOutlined />} disabled />
                </Form.Item>
              </div>
              
              <div style={{ display: 'flex', gap: '16px' }}>
                <Form.Item
                  name="phone"
                  label="手机号码"
                  style={{ flex: 1 }}
                  rules={[
                    { required: true, message: '请输入手机号码' },
                    { pattern: /^1\d{10}$/, message: '请输入有效的手机号码' }
                  ]}
                >
                  <Input prefix={<PhoneOutlined />} placeholder="请输入手机号码" />
                </Form.Item>
                
                <Form.Item
                  name="email"
                  label="电子邮箱"
                  style={{ flex: 1 }}
                  rules={[
                    { type: 'email', message: '请输入有效的电子邮箱' }
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="请输入电子邮箱" />
                </Form.Item>
              </div>
              
              <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                <Button type="primary" htmlType="submit" loading={loading}>
                  保存修改
                </Button>
              </Form.Item>
            </Form>
          </Spin>
        </TabPane>
        
        <TabPane tab="修改密码" key="2">
          <Spin spinning={loading}>
            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={handleUpdatePassword}
            >
              <Form.Item
                name="currentPassword"
                label="当前密码"
                rules={[{ required: true, message: '请输入当前密码' }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="请输入当前密码" />
              </Form.Item>
              
              <Form.Item
                name="newPassword"
                label="新密码"
                rules={[
                  { required: true, message: '请输入新密码' },
                  { min: 6, message: '密码长度不能少于6个字符' }
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="请输入新密码" />
              </Form.Item>
              
              <Form.Item
                name="confirmPassword"
                label="确认新密码"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: '请确认新密码' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次输入的密码不一致'));
                    },
                  }),
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="请确认新密码" />
              </Form.Item>
              
              <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                <Button type="primary" htmlType="submit" loading={loading}>
                  更新密码
                </Button>
              </Form.Item>
            </Form>
          </Spin>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default UserProfileModal;
