import React from 'react';
import { Modal, Form, Input, Select, Row, Col, Divider, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { User } from '../types/user';
import { roleOptions, campusOptions, statusOptions } from '../constants/userOptions';

const { Option } = Select;

interface UserEditModalProps {
  visible: boolean;
  loading: boolean;
  form: any;
  editingUser: User | null;
  onCancel: () => void;
  onSubmit: () => void;
  onResetPassword: () => void;
}

const UserEditModal: React.FC<UserEditModalProps> = ({
  visible,
  loading,
  form,
  editingUser,
  onCancel,
  onSubmit,
  onResetPassword
}) => {
  return (
    <Modal
      title={<div style={{ fontSize: '18px', fontWeight: 'bold' }}>{editingUser ? '编辑用户' : '添加用户'}</div>}
      open={visible}
      onOk={onSubmit}
      onCancel={onCancel}
      width={700}
      okText={editingUser ? '保存' : '添加'}
      cancelText="取消"
      confirmLoading={loading}
    >
      <Divider style={{ margin: '0 0 24px 0' }} />
      <Form
        form={form}
        layout="vertical"
        name="userForm"
        initialValues={{
          status: 'active',
        }}
        onValuesChange={(changedValues) => {
          // 当电话字段变化时，自动更新密码字段
          if (!editingUser && changedValues.phone) {
            form.setFieldsValue({ password: changedValues.phone });
          }
        }}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="name"
              label="姓名"
              rules={[{ required: true, message: '请输入姓名' }]}
            >
              <Input 
                placeholder="请输入姓名" 
                disabled={!!editingUser}
              />
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              name="phone"
              label="电话"
              rules={[{ required: true, message: '请输入电话' }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="请输入电话" 
                disabled={!!editingUser}
              />
            </Form.Item>
          </Col>
          
          <Col span={8}>
            {!editingUser ? (
              <Form.Item
                name="password"
                label="密码"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="请输入密码"
                  disabled 
                />
              </Form.Item>
            ) : (
              <Form.Item
                label="密码"
              >
                <Button type="link" style={{ padding: 0 }} onClick={onResetPassword}>
                  重置密码
                </Button>
              </Form.Item>
            )}
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="status"
              label="状态"
              rules={[{ required: true, message: '请选择状态' }]}
              initialValue="active"
            >
              <Select placeholder="请选择状态">
                {statusOptions.map(option => (
                  <Option key={option.value} value={option.value}>{option.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              name="role"
              label="角色"
              rules={[{ required: true, message: '请选择角色' }]}
            >
              <Select placeholder="请选择角色">
                {roleOptions.map(option => (
                  <Option key={option.value} value={option.value}>{option.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => prevValues.role !== currentValues.role}
            >
              {({ getFieldValue }) => {
                return getFieldValue('role') === 'manager' ? (
                  <Form.Item
                    name="campus"
                    label="所属校区"
                    rules={[{ required: true, message: '请选择所属校区' }]}
                  >
                    <Select placeholder="请选择校区">
                      {campusOptions.map(option => (
                        <Option key={option.value} value={option.value}>{option.label}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                ) : null;
              }}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UserEditModal; 