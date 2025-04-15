import React, { useEffect, useState } from 'react';
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
  const { campusOptions, loading: campusLoading, error: campusError, refreshCampusOptions } = useRealCampusOptions();

  // 当模态框打开时加载校区列表
  useEffect(() => {
    // 只在模态框可见时加载校区列表
    if (visible) {
      console.log('模态框打开，加载校区列表');
      refreshCampusOptions();

      // 如果是编辑模式，确保状态值正确设置
      if (editingUser && editingUser.status) {
        // 延迟一下再设置，确保模态框已完全渲染
        setTimeout(() => {
          let statusValue = editingUser.status;
          if (typeof statusValue === 'string') {
            statusValue = statusValue.toUpperCase();
          } else if (typeof statusValue === 'number') {
            statusValue = statusValue === 1 ? 'ENABLED' : 'DISABLED';
          }

          console.log('在模态框打开时直接设置状态值:', statusValue);
          form.setFieldsValue({ status: statusValue });
        }, 300);
      }
    }
  }, [visible, refreshCampusOptions, editingUser, form]);

  // 当编辑用户变化时，确保表单值正确设置
  useEffect(() => {
    if (visible && editingUser) {
      console.log('编辑用户原始数据:', JSON.stringify(editingUser, null, 2));
      console.log('状态选项配置:', statusOptions);

      // 处理角色数据
      let roleValue = editingUser.role;
      if (typeof editingUser.role === 'object' && editingUser.role !== null) {
        roleValue = String(editingUser.role.id);
        console.log('处理后的角色值:', roleValue);
      }

      // 处理校区数据
      let campusValue = editingUser.campus;
      if (typeof editingUser.campus === 'object' && editingUser.campus !== null) {
        campusValue = String(editingUser.campus.id);
        console.log('处理后的校区值:', campusValue);
      }

      // 处理状态数据 - 直接使用API返回的status字段
      let statusValue = editingUser.status;
      console.log('原始状态值:', statusValue, typeof statusValue);

      // 确保状态值是字符串类型的'ENABLED'或'DISABLED'
      if (typeof statusValue === 'number') {
        statusValue = statusValue === 1 ? 'ENABLED' : 'DISABLED';
      } else if (typeof statusValue === 'string') {
        // 如果已经是字符串，确保是大写形式
        statusValue = statusValue.toUpperCase();
      } else {
        // 如果状态值无效，使用默认值
        statusValue = DEFAULT_STATUS;
      }
      console.log('处理后的状态值:', statusValue);

      // 检查状态值是否在选项中
      const statusOptionExists = statusOptions.some(option => option.value === statusValue);
      console.log('状态值在选项中存在:', statusOptionExists);

      // 设置表单值 - 使用 realName 而不是 name
      const formValues = {
        name: editingUser.realName || editingUser.name, // 兼容两种字段名
        phone: editingUser.phone,
        role: roleValue,
        status: statusValue
      };

      // 如果有校区数据且角色是校区管理员，添加校区字段
      if (roleValue === '3' || String(roleValue) === '3') {
        formValues.campus = campusValue || '';
      }

      console.log('在useEffect中设置表单值:', formValues);

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
          console.log('单独设置校区字段后的值:', form.getFieldValue('campus'));
        }

        console.log('单独设置状态字段后的值:', form.getFieldValue('status'));
        console.log('单独设置角色字段后的值:', form.getFieldValue('role'));

        // 强制触发表单更新
        const fieldsToValidate = ['status', 'role'];
        if (roleValue === '3') {
          fieldsToValidate.push('campus');
        }

        form.validateFields(fieldsToValidate).then(() => {
          console.log('字段验证后的值 - 状态:', form.getFieldValue('status'));
          console.log('字段验证后的值 - 角色:', form.getFieldValue('role'));
          if (roleValue === '3') {
            console.log('字段验证后的值 - 校区:', form.getFieldValue('campus'));
          }

          // 更新状态变量，确保与表单一致
          setStatusValue(form.getFieldValue('status'));
          setRoleValue(form.getFieldValue('role'));
          if (roleValue === '3') {
            setCampusValue(form.getFieldValue('campus'));
          }
        }).catch(err => {
          console.error('字段验证错误:', err);
        });
      }, 100);
    }
  }, [visible, editingUser, form, statusOptions]);

  // 使用状态值作为依赖项的状态变量，强制重新渲染
  const [statusValue, setStatusValue] = useState<string>(() => {
    // 如果是编辑模式，使用用户的状态
    if (editingUser?.status) {
      return editingUser.status.toUpperCase();
    }
    // 如果是添加模式，不预选状态，显示占位符
    return undefined;
  });

  // 使用角色值作为依赖项的状态变量，强制重新渲染
  const [roleValue, setRoleValue] = useState<string>(() => {
    // 如果是编辑模式，使用用户的角色
    if (editingUser?.role) {
      return editingUser.role.id ? String(editingUser.role.id) : '';
    }
    // 如果是添加模式，不预选角色，显示占位符
    return undefined;
  });

  // 使用校区值作为依赖项的状态变量，强制重新渲染
  const [campusValue, setCampusValue] = useState<string>(
    editingUser?.campus?.id && editingUser.campus.id !== -1 ? String(editingUser.campus.id) : ''
  );

  // 当编辑用户变化时，更新状态值、角色值和校区值
  useEffect(() => {
    if (editingUser) {
      // 处理状态值
      if (editingUser.status) {
        let newStatusValue = editingUser.status;
        if (typeof newStatusValue === 'string') {
          newStatusValue = newStatusValue.toUpperCase();
        } else if (typeof newStatusValue === 'number') {
          newStatusValue = newStatusValue === 1 ? 'ENABLED' : 'DISABLED';
        }
        setStatusValue(newStatusValue);
        console.log('更新状态值状态变量:', newStatusValue);
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
        console.log('更新角色值状态变量:', newRoleValue);
      }

      // 处理校区值 - 如果id为-1，则设置为空字符串
      if (editingUser.campus) {
        let newCampusValue = '';
        if (typeof editingUser.campus === 'object' && editingUser.campus !== null) {
          // 如果校区ID不是-1，才设置值
          if (editingUser.campus.id !== -1) {
            newCampusValue = String(editingUser.campus.id);
          }
        } else if (editingUser.campus !== -1) {
          // 如果校区不是对象，且不是-1，直接使用该值
          newCampusValue = String(editingUser.campus);
        }
        setCampusValue(newCampusValue);
        console.log('更新校区值状态变量:', newCampusValue);
      }
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
          status: editingUser?.status?.toUpperCase() || undefined, // 添加用户时不预选状态
          role: editingUser?.role?.id ? String(editingUser.role.id) : undefined, // 添加用户时不预选角色
          campus: editingUser?.campus?.id && editingUser.campus.id !== -1 ? String(editingUser.campus.id) : ''
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
              rules={[{ required: true, message: '请输入电话' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="请输入电话"
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
              <div className="select-wrapper">
                <Select
                  placeholder={editingUser ? '请选择状态' : '请选择状态'}
                  style={{ width: '100%' }}
                  options={statusOptions.map(option => ({ value: option.value, label: option.label }))}
                  popupMatchSelectWidth
                  getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
                  value={statusValue} // 使用状态变量作为值
                  key={`status-select-${statusValue}`} // 使用状态变量作为key
                  onChange={(value) => {
                    console.log('状态已更改为:', value);
                    // 更新状态变量
                    setStatusValue(value as string);
                    // 直接设置表单值
                    form.setFieldsValue({ status: value });
                  }}
                  onDropdownVisibleChange={(open) => {
                    if (open) {
                      // 当下拉菜单打开时，输出当前值以便调试
                      console.log('状态下拉菜单打开，当前值:', form.getFieldValue('status'));

                      // 如果有编辑用户数据，确保状态值正确设置
                      if (editingUser && editingUser.status) {
                        let statusValue = editingUser.status;
                        if (typeof statusValue === 'string') {
                          statusValue = statusValue.toUpperCase();
                        } else if (typeof statusValue === 'number') {
                          statusValue = statusValue === 1 ? 'ENABLED' : 'DISABLED';
                        }

                        // 如果当前值不正确，尝试再次设置
                        if (form.getFieldValue('status') !== statusValue) {
                          console.log('在下拉菜单打开时设置状态值:', statusValue);
                          form.setFieldsValue({ status: statusValue });
                        }
                      }
                    }
                  }}
                />
              </div>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="role"
              label="角色"
              rules={[{ required: true, message: '请选择角色' }]}
            >
              <div className="select-wrapper">
                <Select
                  placeholder={editingUser ? '请选择角色' : '请选择角色'}
                  style={{ width: '100%' }}
                  options={roleOptions
                    .filter(option => editingUser ? true : option.value !== '1') // 添加用户时过滤掉超级管理员
                    .map(option => ({ value: option.value, label: option.label }))}
                  popupMatchSelectWidth
                  className="role-select"
                  popupClassName="role-select-dropdown"
                  getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
                  value={roleValue} // 使用角色状态变量作为值
                  key={`role-select-${roleValue || 'default'}`} // 使用角色状态变量作为key
                  onChange={(value) => {
                    console.log('Role changed to:', value);
                    // 更新角色状态变量
                    setRoleValue(value as string);
                    // 设置表单值
                    form.setFieldsValue({ role: value });

                    // 如果角色不是校区管理员，清除校区字段
                    if (value !== '3') {
                      form.setFieldsValue({ campus: undefined });
                    }
                  }}
                  onDropdownVisibleChange={(open) => {
                    if (open) {
                      // 当下拉菜单打开时，输出当前值以便调试
                      console.log('角色下拉菜单打开，当前值:', roleValue, form.getFieldValue('role'));

                      // 如果有编辑用户数据，确保角色值正确设置
                      if (editingUser && editingUser.role) {
                        let newRoleValue;
                        if (typeof editingUser.role === 'object' && editingUser.role !== null) {
                          newRoleValue = String(editingUser.role.id);
                        } else {
                          newRoleValue = String(editingUser.role);
                        }

                        // 如果当前值不正确，尝试再次设置
                        if (form.getFieldValue('role') !== newRoleValue) {
                          console.log('在下拉菜单打开时设置角色值:', newRoleValue);
                          form.setFieldsValue({ role: newRoleValue });
                          setRoleValue(newRoleValue);
                        }
                      }
                    }
                  }}
                />
              </div>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => prevValues.role !== currentValues.role}
            >
              {({ getFieldValue }) => {
                const roleValue = getFieldValue('role');
                console.log('当前角色值:', roleValue);
                // 当角色为校区管理员时显示校区选择框
                return roleValue === '3' ? (
                  <Form.Item
                    name="campus"
                    label="所属校区"
                    rules={[{ required: true, message: '请选择所属校区' }]}
                    help={campusOptions.length === 0 ? '暂无可选校区，请先添加校区' : ''}
                  >
                    <div className="select-wrapper">
                      <Select
                        placeholder="请选择校区"
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
                        value={campusValue} // 使用校区状态变量作为值
                        key={`campus-select-${campusValue || 'default'}`} // 使用校区状态变量作为key
                        onChange={(value) => {
                          console.log('校区已更改为:', value);
                          // 更新校区状态变量
                          setCampusValue(value as string);
                          // 设置表单值
                          form.setFieldsValue({ campus: value });

                          // 当选择校区时，立即清除错误提示并验证该字段
                          if (value) {
                            // 先清除错误提示
                            form.setFields([{
                              name: 'campus',
                              value: value,
                              errors: []
                            }]);
                            // 然后验证字段
                            form.validateFields(['campus']);
                          }
                        }}
                        onDropdownVisibleChange={(open) => {
                          // 当下拉菜单打开时，输出当前值以便调试
                          if (open) {
                            console.log('校区下拉菜单打开，当前值:', campusValue, form.getFieldValue('campus'));

                            // 如果有编辑用户数据，确保校区值正确设置
                            if (editingUser && editingUser.campus) {
                              let newCampusValue = '';
                              if (typeof editingUser.campus === 'object' && editingUser.campus !== null) {
                                // 如果校区ID不是-1，才设置值
                                if (editingUser.campus.id !== -1) {
                                  newCampusValue = String(editingUser.campus.id);
                                }
                              }

                              // 如果当前值不正确，尝试再次设置
                              if (form.getFieldValue('campus') !== newCampusValue) {
                                console.log('在下拉菜单打开时设置校区值:', newCampusValue);
                                form.setFieldsValue({ campus: newCampusValue });
                                setCampusValue(newCampusValue);
                              }
                            }

                            // 使用setFields清除错误提示，但保留当前值
                            const currentValue = form.getFieldValue('campus');
                            form.setFields([{
                              name: 'campus',
                              value: currentValue,
                              errors: []
                            }]);
                          }
                        }}
                      />
                    </div>
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