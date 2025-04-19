import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Row, Col, Divider, Button, Spin, Select } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { User } from '../types/user';
import { roleOptions, statusOptions, DEFAULT_STATUS } from '../constants/userOptions';
import { useRealCampusOptions } from '../hooks/useRealCampusOptions';
import './UserEditModal.css';

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
  const { campusOptions, loading: campusLoading, error: campusError, refreshCampusOptions } = useRealCampusOptions();

  // 当模态框打开时加载校区列表
  useEffect(() => {
    // 只在模态框可见时加载校区列表
    if (visible) {
      // 加载校区列表
      refreshCampusOptions();

      // 如果是编辑模式，确保状态值正确设置
      if (editingUser && editingUser.status) {
        // 延迟一下再设置，确保模态框已完全渲染
        setTimeout(() => {
          let statusValue: 'ENABLED' | 'DISABLED';
          if (typeof editingUser.status === 'string') {
            statusValue = editingUser.status.toUpperCase() as 'ENABLED' | 'DISABLED';
          } else if (typeof editingUser.status === 'number') {
            statusValue = editingUser.status === 1 ? 'ENABLED' : 'DISABLED';
          } else {
            statusValue = 'ENABLED';
          }

          // 设置状态值
          form.setFieldsValue({ status: statusValue });
        }, 300);
      }
    }
  }, [visible, refreshCampusOptions, editingUser, form]);

  // 使用状态值作为依赖项的状态变量，强制重新渲染
  const [statusValue, setStatusValue] = useState<'ENABLED' | 'DISABLED' | undefined>(() => {
    // 如果是编辑模式，使用用户的状态
    if (editingUser?.status) {
      if (typeof editingUser.status === 'string') {
        return editingUser.status.toUpperCase() as 'ENABLED' | 'DISABLED';
      }
      return editingUser.status === 1 ? 'ENABLED' : 'DISABLED';
    }
    // 如果是添加模式，不预选状态，显示占位符
    return undefined;
  });

  // 使用角色值作为依赖项的状态变量，强制重新渲染
  const [roleValue, setRoleValue] = useState<string | undefined>(() => {
    // 如果是编辑模式，使用用户的角色
    if (editingUser?.role) {
      if (typeof editingUser.role === 'object' && editingUser.role !== null) {
        return editingUser.role.id ? String(editingUser.role.id) : '';
      }
      return String(editingUser.role);
    }
    // 如果是添加模式，不预选角色，显示占位符
    return undefined;
  });

  // 使用密码值作为依赖项的状态变量，强制重新渲染
  const [passwordValue, setPasswordValue] = useState<string>(() => {
    // 如果是编辑模式，使用用户手机号的后8位
    if (editingUser?.phone) {
      if (editingUser.phone.length >= 8) {
        const last8 = editingUser.phone.slice(-8);
        console.log('初始化密码为手机号后8位:', last8, '手机号:', editingUser.phone);
        return last8;
      }
      console.log('手机号不足8位，使用全部:', editingUser.phone);
      return editingUser.phone;
    }
    // 如果是添加模式，初始化为空
    console.log('添加模式，初始化密码为空');
    return '';
  });

  // 当编辑用户变化时，更新状态值、角色值、密码值和校区值
  useEffect(() => {
    if (editingUser) {
      // 处理状态值
      if (editingUser.status) {
        let newStatusValue: 'ENABLED' | 'DISABLED';
        if (typeof editingUser.status === 'string') {
          newStatusValue = editingUser.status.toUpperCase() as 'ENABLED' | 'DISABLED';
        } else {
          newStatusValue = editingUser.status === 1 ? 'ENABLED' : 'DISABLED';
        }
        setStatusValue(newStatusValue);
      }

      // 处理角色值
      if (editingUser.role) {
        let newRoleValue;
        if (typeof editingUser.role === 'object' && editingUser.role !== null) {
          newRoleValue = String(editingUser.role.id);
        } else {
          newRoleValue = String(editingUser.role);
        }
        setRoleValue(newRoleValue);
      }

      // 处理密码值 - 设置为手机号的后8位
      if (editingUser.phone) {
        console.log('useEffect 中设置密码，手机号:', editingUser.phone, '长度:', editingUser.phone.length);
        if (editingUser.phone.length >= 8) {
          const last8 = editingUser.phone.slice(-8);
          console.log('useEffect 中设置密码为手机号后8位:', last8);
          setPasswordValue(last8);
          // 同时设置表单字段
          form.setFieldsValue({ password: last8 });
        } else {
          console.log('useEffect 中手机号不足8位，设置密码为全部手机号:', editingUser.phone);
          setPasswordValue(editingUser.phone);
          // 同时设置表单字段
          form.setFieldsValue({ password: editingUser.phone });
        }
      }
    } else {
      // 如果是添加模式，初始化密码为空
      setPasswordValue('');
    }
  }, [editingUser, form]);

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
        preserve={false}
        initialValues={{
          status: editingUser ? (typeof editingUser.status === 'string' ? editingUser.status.toUpperCase() as 'ENABLED' | 'DISABLED' : (editingUser.status === 1 ? 'ENABLED' : 'DISABLED')) : undefined,
          role: editingUser?.role ? (typeof editingUser.role === 'object' ? String(editingUser.role.id) : String(editingUser.role)) : undefined,
          campus: editingUser?.campus ? (
            typeof editingUser.campus === 'object' ?
              (editingUser.campus.id && String(editingUser.campus.id) !== '-1' && String(editingUser.campus.id) !== 'null' && editingUser.campus.id !== null ?
                String(editingUser.campus.id) : undefined) :
              (editingUser.campus && String(editingUser.campus) !== '-1' && String(editingUser.campus) !== 'null' && editingUser.campus !== null ?
                String(editingUser.campus) : undefined)
          ) : undefined
        }}
        key={`user-form-${editingUser?.id || 'new'}`}
      >
        {/* 名称和电话字段 */}
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="name"
              label="姓名"
              rules={[{ required: true, message: '请输入姓名' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="请输入姓名"
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="phone"
              label="手机号"
              rules={[
                { required: true, message: '请输入手机号' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
              ]}
            >
              <Input
                placeholder="请输入手机号"
                allowClear
                onChange={(e) => {
                  const phone = e.target.value;
                  
                  // 当不在编辑模式时，设置默认密码为手机号的后8位
                  if (!editingUser && phone) {
                    if (phone.length >= 8) {
                      const last8 = phone.slice(-8);
                      console.log('设置密码为手机号后8位:', last8);
                      setPasswordValue(last8);
                      form.setFieldsValue({ password: last8 });
                    } else {
                      console.log('手机号不足8位，设置密码为全部手机号:', phone);
                      setPasswordValue(phone);
                      form.setFieldsValue({ password: phone });
                    }
                  }
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* 状态和角色字段 */}
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="status"
              label="状态"
              rules={[{ required: true, message: '请选择状态' }]}
            >
              <Select
                placeholder={editingUser ? '请选择状态' : '请选择用户状态'}
                style={{ width: '100%' }}
                options={statusOptions.map(option => ({ value: option.value, label: option.label }))}
                popupMatchSelectWidth
                getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
                value={statusValue}
                key={`status-select-${statusValue}`}
                onChange={(value) => {
                  setStatusValue(value as 'ENABLED' | 'DISABLED');
                  form.setFieldsValue({ status: value });
                }}
                onDropdownVisibleChange={(open) => {
                  if (open) {
                    if (editingUser && editingUser.status) {
                      let statusValue: 'ENABLED' | 'DISABLED';
                      if (typeof editingUser.status === 'string') {
                        statusValue = editingUser.status.toUpperCase() as 'ENABLED' | 'DISABLED';
                      } else if (typeof editingUser.status === 'number') {
                        statusValue = editingUser.status === 1 ? 'ENABLED' : 'DISABLED';
                      } else {
                        statusValue = 'ENABLED';
                      }
                      if (form.getFieldValue('status') !== statusValue) {
                        form.setFieldsValue({ status: statusValue });
                      }
                    }
                  }
                }}
                disabled={!!editingUser && roleValue === '1'}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="role"
              label="角色"
              rules={[{ required: true, message: '请选择角色' }]}
            >
              <Select
                placeholder={editingUser ? '请选择角色' : '请选择用户角色'}
                style={{ width: '100%' }}
                options={roleOptions
                  .filter(option => {
                    if (!editingUser) return option.value !== '1';
                    if (roleValue === '1') return true;
                    return option.value !== '1';
                  })
                  .map(option => ({ value: option.value, label: option.label }))}
                popupMatchSelectWidth
                className="role-select"
                popupClassName="role-select-dropdown"
                getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
                value={roleValue}
                key={`role-select-${roleValue || 'default'}`}
                disabled={!!editingUser && roleValue === '1'}
                onChange={(value) => {
                  setRoleValue(value as string);
                  form.setFieldsValue({ role: value });
                  form.resetFields(['campus']);
                  form.setFields([{ name: 'campus', value: undefined }]);
                  setTimeout(() => {
                    if (form.getFieldValue('campus') === null || form.getFieldValue('campus') === 'null') {
                      form.setFields([{ name: 'campus', value: undefined }]);
                    }
                  }, 0);
                  if (value === '3') {
                    if (campusOptions.length === 0) {
                      refreshCampusOptions();
                    }
                  }
                }}
                onDropdownVisibleChange={(open) => {
                  if (open && editingUser && editingUser.role) {
                    let newRoleValue;
                    if (typeof editingUser.role === 'object' && editingUser.role !== null) {
                      newRoleValue = String(editingUser.role.id);
                    } else {
                      newRoleValue = String(editingUser.role);
                    }
                    if (form.getFieldValue('role') !== newRoleValue) {
                      form.setFieldsValue({ role: newRoleValue });
                      setRoleValue(newRoleValue);
                    }
                  }
                }}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => prevValues.role !== currentValues.role}
            >
              {({ getFieldValue }) => {
                const roleValue = getFieldValue('role');
                // 检查当前角色值
                // 当角色为校区管理员时显示校区选择框
                return roleValue === '3' ? (
                  <Form.Item
                    name="campus"
                    label="所属校区"
                    rules={[{ required: true, message: '请选择所属校区' }]}
                    help={campusOptions.length === 0 ? '暂无可选校区，请先添加校区' : ''}
                  >
                    <Select
                      placeholder="请选择所属校区"
                      loading={campusLoading}
                      style={{ width: '100%' }}
                      options={campusOptions.map(option => ({ value: option.value, label: option.label }))}
                      notFoundContent={
                        campusLoading ? <Spin size="small" /> :
                        campusError ? <div style={{ color: 'red' }}>加载失败</div> :
                        <div>暂无校区</div>
                      }
                      popupMatchSelectWidth
                      getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
                      // 显式设置 value 属性，确保在值为 null 时显示占位符文本
                      value={form.getFieldValue('campus') === null || form.getFieldValue('campus') === 'null' ? undefined : form.getFieldValue('campus')}
                      key="campus-select" // 使用固定的key，避免在campusValue变化时组件重新渲染
                      onChange={(value) => {
                        // 处理 null 值，确保显示占位符文本
                        const finalValue = value === null || value === 'null' ? undefined : value;

                        // 使用单一的方式更新表单值，避免循环引用
                        form.setFields([{
                          name: 'campus',
                          value: finalValue,
                          errors: []
                        }]);
                      }}
                      onDropdownVisibleChange={(open) => {
                        // 当下拉菜单打开时，确保校区列表已加载
                        if (open && campusOptions.length === 0) {
                          refreshCampusOptions();
                        }
                      }}
                    />
                  </Form.Item>
                ) : null;
              }}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={16}>
            <Form.Item
              label="密码"
              name="password"
            >
              <div style={{ position: 'relative', width: '100%' }}>
                <Input.Password
                  style={{
                    width: '100%'
                  }}
                  disabled={true}
                  value={passwordValue} // 直接使用密码状态变量作为值
                  visibilityToggle={false} // 移除显示/隐藏密码的切换按钮
                />
                {editingUser && (
                  <Button
                    type="link"
                    style={{ position: 'absolute', right: '-100px', top: '0', height: '32px' }}
                    onClick={() => {
                      const phone = editingUser?.phone || '';
                      Modal.confirm({
                        title: '确认重置密码',
                        content: `是否重置手机号为${phone}的密码？密码将被重置为手机号后8位。`,
                        okText: '确认',
                        cancelText: '取消',
                        onOk: () => {
                          if (typeof onResetPassword === 'function') {
                            onResetPassword();
                          }
                        }
                      });
                    }}
                  >
                    重置密码
                  </Button>
                )}
              </div>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UserEditModal;