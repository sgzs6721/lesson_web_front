import React from 'react';
import { Modal, Form, Input, Row, Col, Divider, Button, Spin, Select } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { User } from '../types/user';
import { roleOptions, statusOptions, DEFAULT_STATUS } from '../constants/userOptions';
import { useRealCampusOptions } from '../hooks/useRealCampusOptions';
import CustomSelect from '@/components/CustomSelect';
import './UserEditModal.css';

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
  // 使用真实校区列表
  const { campusOptions, loading: campusLoading, error: campusError } = useRealCampusOptions();

  // 状态默认值已在Form的initialValues中设置

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
          status: DEFAULT_STATUS
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
            >
              <CustomSelect
                placeholder="请选择状态"
                style={{ width: '100%' }}
                defaultValue="ENABLED"
                forcedValue="ENABLED"
                defaultText="启用"
                options={statusOptions.map(option => ({ value: option.value, label: option.label }))}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="role"
              label="角色"
              rules={[{ required: true, message: '请选择角色' }]}
            >
              <CustomSelect
                placeholder="请选择角色"
                style={{ width: '100%' }}
                options={roleOptions.map(option => ({ value: option.value, label: option.label }))}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => prevValues.role !== currentValues.role}
            >
              {({ getFieldValue }) => {
                return getFieldValue('role') === '3' ? (
                  <Form.Item
                    name="campus"
                    label="所属校区"
                    rules={[{ required: true, message: '请选择所属校区' }]}
                  >
                    <CustomSelect
                      placeholder="请选择校区"
                      loading={campusLoading}
                      style={{ width: '100%' }}
                      options={campusOptions.map(option => ({ value: option.value, label: option.label }))}
                      notFoundContent={
                        campusLoading ? <Spin size="small" /> :
                        campusError ? <div style={{ color: 'red' }}>加载失败</div> :
                        <div>暂无校区</div>
                      }
                    />
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