import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Row, Col, Divider, Button, Spin, Select, Tooltip, Space, Tag, message } from 'antd';
import { UserOutlined, InfoCircleOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { User, UserRole, UserRoleItem } from '../types/user';
import { roleOptions, statusOptions, DEFAULT_STATUS } from '../constants/userOptions';

import { useRealCampusOptions } from '../hooks/useRealCampusOptions';
import './UserEditModal.css';

// 添加自定义样式
const customStyles = `
  .role-select-dropdown .ant-select-dropdown {
    min-width: 100% !important;
    width: 100% !important;
  }
  .campus-select-dropdown .ant-select-dropdown {
    min-width: 100% !important;
    width: 100% !important;
  }
  .role-select-dropdown .ant-select-item {
    padding: 8px 12px !important;
  }
  .campus-select-dropdown .ant-select-item {
    padding: 8px 12px !important;
  }
`;

// 获取角色的中文名称
const getRoleName = (role: UserRole | undefined): string => {
  if (!role) return '';
  const option = roleOptions.find(opt => opt.value === role);
  return option ? option.label : String(role);
};

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

  // 多角色状态
  const [selectedRoles, setSelectedRoles] = useState<UserRoleItem[]>([]);

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

      // 初始化多角色数据
      if (editingUser?.roles && editingUser.roles.length > 0) {
        setSelectedRoles(editingUser.roles);
      } else if (editingUser?.role) {
        // 兼容旧版本的单角色数据
        let roleName: UserRole;
        if (typeof editingUser.role === 'object' && editingUser.role !== null) {
          const roleId = Number(editingUser.role.id);
          if (roleId === 1) roleName = UserRole.SUPER_ADMIN;
          else if (roleId === 2) roleName = UserRole.COLLABORATOR;
          else if (roleId === 3) roleName = UserRole.CAMPUS_ADMIN;
          else roleName = UserRole.COLLABORATOR;
        } else {
          const roleId = Number(editingUser.role);
          if (roleId === 1) roleName = UserRole.SUPER_ADMIN;
          else if (roleId === 2) roleName = UserRole.COLLABORATOR;
          else if (roleId === 3) roleName = UserRole.CAMPUS_ADMIN;
          else roleName = UserRole.COLLABORATOR;
        }

        // 获取校区ID
        let campusId: number | null = null;
        if (editingUser.campus) {
          if (typeof editingUser.campus === 'object' && editingUser.campus !== null) {
            campusId = Number(editingUser.campus.id);
          } else {
            campusId = Number(editingUser.campus);
          }
        }

        setSelectedRoles([{ name: roleName, campusId }]);
      } else {
        setSelectedRoles([]);
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

  // 当编辑用户变化时，更新状态值和密码值
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

  // 添加角色
  const handleAddRole = () => {
    // 限制最多两个角色
    if (selectedRoles.length >= 2) {
      message.warning('最多只能设置两个角色');
      return;
    }
    
    const newRole: UserRoleItem = { name: UserRole.COLLABORATOR, campusId: null };
    setSelectedRoles([...selectedRoles, newRole]);
  };

  // 删除角色
  const handleRemoveRole = (index: number) => {
    const newRoles = selectedRoles.filter((_, i) => i !== index);
    setSelectedRoles(newRoles);
  };

  // 更新角色
  const handleRoleChange = (index: number, field: 'name' | 'campusId', value: any) => {
    const newRoles = [...selectedRoles];
    newRoles[index] = { ...newRoles[index], [field]: value };
    setSelectedRoles(newRoles);
  };

  // 检查是否为超级管理员
  const isSuperAdmin = selectedRoles.some(role => role.name === UserRole.SUPER_ADMIN);

  // 在提交前设置多角色数据到表单
  const handleSubmit = () => {
    // 设置多角色数据到隐藏的表单字段
    form.setFieldsValue({ roles: selectedRoles });
    onSubmit();
  };

  return (
    <Modal
      title={<div style={{ fontSize: '18px', fontWeight: 'bold' }}>{editingUser ? '编辑用户' : '添加用户'}</div>}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      width={800}
      okText={editingUser ? '保存' : '添加'}
      cancelText="取消"
      confirmLoading={loading}
    >
      {/* 注入自定义样式 */}
      <style>{customStyles}</style>
      
      <Form
        form={form}
        layout="vertical"
        name="userForm"
        preserve={false}
        initialValues={{
          status: editingUser ? (typeof editingUser.status === 'string' ? editingUser.status.toUpperCase() as 'ENABLED' | 'DISABLED' : (editingUser.status === 1 ? 'ENABLED' : 'DISABLED')) : undefined,
          roles: selectedRoles
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
          <Col span={8}>
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
                    size="small"
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      padding: '0',
                      height: 'auto',
                      lineHeight: '1',
                      color: '#1890ff',
                      zIndex: 1
                    }}
                    onClick={onResetPassword}
                  >
                    重置密码
                  </Button>
                )}
              </div>
            </Form.Item>
          </Col>
        </Row>

        {/* 状态字段 */}
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
                disabled={isSuperAdmin}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* 多角色选择 */}
        <Form.Item
          label="用户角色"
          required
          help="可以为用户设置多个角色（除超级管理员之外），最多两个角色"
        >
          <div style={{ marginBottom: 16 }}>
            {selectedRoles.map((role, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: 12,
                padding: '12px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                backgroundColor: '#fafafa'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                  <div style={{ width: '50%' }}>
                    <Select
                      value={role.name}
                      onChange={(value) => handleRoleChange(index, 'name', value)}
                      style={{ width: '100%' }}
                      placeholder="选择角色"
                      popupMatchSelectWidth={false}
                      getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
                      popupClassName="role-select-dropdown"
                      options={roleOptions
                        .filter(option => option.value !== UserRole.SUPER_ADMIN)
                        .map(option => ({
                          value: option.value,
                          label: (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span>{option.label}</span>
                              {option.description && (
                                <Tooltip title={option.description}>
                                  <InfoCircleOutlined style={{ color: '#1890ff' }} />
                                </Tooltip>
                              )}
                            </div>
                          )
                        }))}
                      labelRender={(selectedOption) => {
                        // 选中后只显示角色名称，不显示信息图标
                        if (selectedOption && selectedOption.label) {
                          const roleOption = roleOptions.find(opt => opt.value === selectedOption.value);
                          return roleOption ? roleOption.label : selectedOption.label;
                        }
                        return selectedOption?.label || '';
                      }}
                    />
                  </div>
                  
                  {role.name === UserRole.CAMPUS_ADMIN && (
                    <div style={{ width: '50%' }}>
                      <Select
                        value={role.campusId ? String(role.campusId) : undefined}
                        onChange={(value) => handleRoleChange(index, 'campusId', value ? Number(value) : null)}
                        style={{ width: '100%' }}
                        placeholder="选择校区"
                        popupMatchSelectWidth={false}
                        getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
                        popupClassName="campus-select-dropdown"
                        loading={campusLoading}
                        options={campusOptions.map(option => ({ 
                          value: option.value, 
                          label: option.label
                        }))}
                        notFoundContent={
                          campusLoading ? <Spin size="small" /> :
                          campusError ? <div style={{ color: 'red' }}>加载失败</div> :
                          <div>暂无校区</div>
                        }
                      />
                    </div>
                  )}
                </div>
                
                <Button
                  type="text"
                  icon={<CloseOutlined />}
                  onClick={() => handleRemoveRole(index)}
                  style={{ marginLeft: 8 }}
                  size="small"
                />
              </div>
            ))}
            
            {selectedRoles.length < 2 && (
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={handleAddRole}
                style={{ width: '100%' }}
              >
                添加角色
              </Button>
            )}
          </div>
        </Form.Item>

        {/* 隐藏的角色字段，用于表单提交 */}
        <Form.Item name="roles" hidden>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserEditModal;