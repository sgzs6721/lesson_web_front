import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Row, Col, Divider, Button, Spin, Select } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
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

  // 当编辑用户变化时，确保表单值正确设置
  useEffect(() => {
    if (visible && editingUser) {
      // 处理编辑用户数据

      // 处理角色数据
      let roleValue: string;
      if (typeof editingUser.role === 'object' && editingUser.role !== null) {
        roleValue = String(editingUser.role.id);
      } else {
        roleValue = String(editingUser.role);
      }
      // 角色值已处理

      // 处理校区数据
      let campusValue = editingUser.campus;
      if (typeof editingUser.campus === 'object' && editingUser.campus !== null) {
        campusValue = String(editingUser.campus.id);
        // 校区值已处理
      }

      // 处理状态数据 - 直接使用API返回的status字段
      let statusValue: 'ENABLED' | 'DISABLED';
      // 处理状态值

      // 确保状态值是字符串类型的'ENABLED'或'DISABLED'
      if (typeof editingUser.status === 'number') {
        statusValue = editingUser.status === 1 ? 'ENABLED' : 'DISABLED';
      } else if (typeof editingUser.status === 'string') {
        // 如果已经是字符串，确保是大写形式
        statusValue = editingUser.status.toUpperCase() as 'ENABLED' | 'DISABLED';
      } else {
        // 如果状态值无效，使用默认值
        statusValue = DEFAULT_STATUS as 'ENABLED';
      }
      // 确保状态值有效

      // 设置表单值 - 使用 realName 而不是 name
      const formValues: any = {
        name: editingUser.realName || editingUser.name, // 兼容两种字段名
        phone: editingUser.phone,
        role: roleValue,
        status: statusValue
      };

      // 如果有校区数据且角色是校区管理员，添加校区字段
      if (roleValue === '3' || String(roleValue) === '3') {
        formValues.campus = campusValue || '';
      }

      // 设置表单值

      // 重置表单并设置值
      form.resetFields();

      // 先设置基本字段，然后单独设置状态、角色和校区字段
      const { status, role, campus, ...basicValues } = formValues;
      form.setFieldsValue(basicValues);

      // 延迟设置状态、角色和校区字段，确保基本字段已经设置完成
      setTimeout(() => {
        // 单独设置状态字段
        form.setFields([{
          name: 'status',
          value: statusValue
        }]);

        // 单独设置角色字段
        form.setFields([{
          name: 'role',
          value: roleValue
        }]);

        // 如果角色是校区管理员，则设置校区字段
        if (roleValue === '3') {
          form.setFields([{
            name: 'campus',
            value: campusValue
          }]);
          // 校区字段已设置
        }

        // 状态和角色字段已设置

        // 强制触发表单更新
        const fieldsToValidate = ['status', 'role'];
        if (roleValue === '3') {
          fieldsToValidate.push('campus');
        }

        form.validateFields(fieldsToValidate).then(() => {
          // 字段验证完成

          // 更新状态变量，确保与表单一致
          setStatusValue(form.getFieldValue('status'));
          setRoleValue(form.getFieldValue('role'));
          // 删除对 setCampusValue 的调用
        }).catch((err: any) => {
          console.error('字段验证错误:', err);
        });
      }, 100);
    }
  }, [visible, editingUser, form, statusOptions]);

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

  // 删除未使用的 campusValue 状态变量

  // 当编辑用户变化时，更新状态值、角色值和校区值
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
        // 状态值已更新
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
        // 角色值已更新
      }

      // 校区值已在其他地方处理
    }
  }, [editingUser]);

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
        preserve={false}
        initialValues={{
          status: editingUser ? (typeof editingUser.status === 'string' ? editingUser.status.toUpperCase() as 'ENABLED' | 'DISABLED' : (editingUser.status === 1 ? 'ENABLED' : 'DISABLED')) : undefined, // 添加用户时不预选状态
          role: editingUser?.role ? (typeof editingUser.role === 'object' ? String(editingUser.role.id) : String(editingUser.role)) : undefined, // 添加用户时不预选角色
          campus: editingUser?.campus ? (
            typeof editingUser.campus === 'object' ?
              (editingUser.campus.id && String(editingUser.campus.id) !== '-1' && String(editingUser.campus.id) !== 'null' && editingUser.campus.id !== null ?
                String(editingUser.campus.id) : undefined) :
              (editingUser.campus && String(editingUser.campus) !== '-1' && String(editingUser.campus) !== 'null' && editingUser.campus !== null ?
                String(editingUser.campus) : undefined)
          ) : undefined
        }}
        key={`user-form-${editingUser?.id || 'new'}`}
        onValuesChange={(changedValues, allValues) => {
          console.log('表单值变化:', changedValues, '所有值:', allValues);

          // 当状态字段变化时，输出详细信息
          if ('status' in changedValues) {
            console.log('状态字段变化为:', changedValues.status);
          }

          // 当电话字段变化时，自动更新密码字段
          if (!editingUser && changedValues.phone) {
            form.setFieldsValue({ password: changedValues.phone });
          }

          // 当校区字段变化时，立即验证该字段以清除错误提示
          if (changedValues.campus) {
            form.validateFields(['campus']);
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
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="phone"
              label="电话"
              rules={[
                { required: true, message: '请输入电话' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="请输入电话"
                maxLength={11}
                onKeyDown={(e) => {
                  // 只允许输入数字
                  const keyCode = e.key;
                  if (!/[0-9]/.test(keyCode) && keyCode !== 'Backspace' && keyCode !== 'Delete' && keyCode !== 'ArrowLeft' && keyCode !== 'ArrowRight') {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  // 强制只能输入数字
                  const value = e.target.value;
                  const numericValue = value.replace(/[^\d]/g, '');
                  if (value !== numericValue) {
                    e.target.value = numericValue;
                    // 触发一个新的变化事件来更新表单值
                    form.setFieldsValue({ phone: numericValue });
                  }
                }}
              />
            </Form.Item>
          </Col>
        </Row>

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
        </Row>

        <Row gutter={16}>
          <Col span={16}>
            <Form.Item
              label="密码"
              name="password"
            >
              <div style={{ position: 'relative', width: '100%' }}>
                <Input.Password
                  placeholder="如需修改请输入新密码，否则留空"
                  style={{ width: '100%' }}
                />
                <Button
                  type="link"
                  style={{ position: 'absolute', right: '-100px', top: '0', height: '32px' }}
                  onClick={() => {
                    const phone = editingUser?.phone || '';
                    Modal.confirm({
                      title: '确认重置密码',
                      content: `是否重置手机号为${phone}的密码？`,
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
              </div>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
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
      </Form>
    </Modal>
  );
};

export default UserEditModal;