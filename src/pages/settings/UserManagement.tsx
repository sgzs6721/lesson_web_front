import { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Button,
  Input,
  Select,
  Space,
  Modal,
  Form,
  message,
  Tooltip,
  Tag,
  Typography,
  Row,
  Col,
  Divider
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  LockOutlined,
  RedoOutlined // 添加重置图标
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;
const { Option } = Select;

// 定义用户角色类型
type UserRole = 'admin' | 'manager' | 'teacher' | 'finance' | 'receptionist';

// 定义用户数据类型
interface User {
  id: string;
  phone: string;
  name: string;
  role: UserRole;
  campus?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin?: string;
}

// 角色选项配置
const roleOptions = [
  { value: 'admin', label: '系统管理员' },
  { value: 'manager', label: '校区经理' },
  { value: 'teacher', label: '教练' },
  { value: 'finance', label: '财务' },
  { value: 'receptionist', label: '前台' }
];

// 校区选项配置（模拟数据）
const campusOptions = [
  { value: 'campus1', label: '北京中关村校区' },
  { value: 'campus2', label: '北京望京校区' },
  { value: 'campus3', label: '上海徐汇校区' },
  { value: 'campus4', label: '上海浦东校区' },
  { value: 'campus5', label: '广州天河校区' }
];

// 主组件
const UserManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [selectedRole, setSelectedRole] = useState<string[]>([]);
  const [selectedCampus, setSelectedCampus] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<('active' | 'inactive')[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [form] = Form.useForm();

  // 页面加载时获取数据
  useEffect(() => {
    fetchUsers();
  }, [currentPage, pageSize]); // 移除筛选条件的依赖，避免自动触发

  // 模拟获取用户数据
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 生成测试数据
      const mockData: User[] = Array(30)
        .fill(null)
        .map((_, index) => {
          const roles: UserRole[] = ['admin', 'manager', 'teacher', 'finance', 'receptionist'];
          const role = roles[index % 5];
          
          return {
            id: `U${10000 + index}`,
            phone: `1${Math.floor(Math.random() * 9) + 3}${String(Math.floor(Math.random() * 1000000000)).padStart(9, '0')}`,
            name: `用户${index + 1}`,
            role,
            campus: role === 'admin' ? undefined : campusOptions[index % 5].value,
            status: index % 7 === 0 ? 'inactive' : 'active',
            createdAt: `2023-${Math.floor(index / 3) + 1}-${(index % 28) + 1}`,
            lastLogin: index % 3 === 0 ? undefined : `2023-${Math.floor(index / 2) + 1}-${(index % 28) + 1}`
          };
        });

      // 过滤数据
      let filteredData = mockData;
      
      if (searchText) {
        filteredData = filteredData.filter(
          user => 
            user.phone.includes(searchText) || 
            user.name.includes(searchText) || 
            user.id.includes(searchText)
        );
      }
      
      if (selectedRole.length > 0) {
        filteredData = filteredData.filter(user => selectedRole.includes(user.role));
      }

      if (selectedCampus.length > 0) {
        // 需要处理 campus 可能为 undefined 的情况
        filteredData = filteredData.filter(user => user.campus && selectedCampus.includes(user.campus));
      }

      if (selectedStatus.length > 0) {
        filteredData = filteredData.filter(user => selectedStatus.includes(user.status));
      }

      // 分页
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      const paginatedData = filteredData.slice(start, end);
      
      setTotal(filteredData.length);
      setUsers(paginatedData);
    } catch (error) {
      message.error('获取用户列表失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 重置筛选条件
  const handleReset = () => {
    setSearchText('');
    setSelectedRole([]);
    setSelectedCampus([]);
    setSelectedStatus([]);
    setCurrentPage(1);
    // 重置时不自动查询，需要点击查询按钮
    // fetchUsers();
  };

  // 显示添加用户模态框
  const showAddModal = () => {
    form.resetFields();
    setEditingUser(null);
    setIsModalVisible(true);
  };
  
  // 显示编辑用户模态框
  const showEditModal = (record: User) => {
    setEditingUser(record);
    form.setFieldsValue({
      name: record.name,
      phone: record.phone,
      role: record.role,
      campus: record.campus,
      status: record.status
    });
    setIsModalVisible(true);
  };

  // 处理模态框确认
  const handleModalOk = () => {
    form.validateFields()
      .then(values => {
        if (editingUser) {
          // 编辑现有用户
          setUsers(prevUsers => 
            prevUsers.map(user => 
              user.id === editingUser.id 
                ? { 
                    ...user, 
                    ...values,
                  } 
                : user
            )
          );
          message.success('用户信息已更新');
        } else {
          // 添加新用户
          const newUser: User = {
            id: `U${10000 + Math.floor(Math.random() * 90000)}`,
            phone: values.phone,
            name: values.name,
            role: values.role,
            campus: values.role === 'admin' ? undefined : values.campus,
            status: 'active',
            createdAt: new Date().toISOString().split('T')[0],
          };
          setUsers(prevUsers => [newUser, ...prevUsers]);
          setTotal(prev => prev + 1);
          message.success('用户添加成功');
        }

        form.resetFields();
        setIsModalVisible(false);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  // 处理模态框取消
  const handleModalCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  // 显示删除确认模态框
  const showDeleteConfirmModal = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalVisible(true);
  };

  // 处理删除用户
  const handleDeleteUser = () => {
    if (userToDelete) {
      setUsers(users.filter(user => user.id !== userToDelete.id));
      setTotal(prev => prev - 1);
      message.success('用户已删除');
      setIsDeleteModalVisible(false);
      setUserToDelete(null);
    }
  };

  // 关闭删除确认模态框
  const handleDeleteModalCancel = () => {
    setIsDeleteModalVisible(false);
    setUserToDelete(null);
  };

  // 处理重置密码
  const handleResetPassword = () => {
    if (editingUser) {
      // 实际项目中这里应该调用重置密码API
      message.success(`已将用户"${editingUser.name}"的密码重置为与电话号码相同`);
    }
  };

  // 表格列配置
  const columns: ColumnsType<User> = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
      align: 'center',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      align: 'center',
      render: role => {
        const roleOption = roleOptions.find(option => option.value === role);
        return roleOption ? roleOption.label : role;
      }
    },
    {
      title: '所属校区',
      dataIndex: 'campus',
      key: 'campus',
      align: 'center',
      render: campus => {
        if (!campus) return '-';
        const campusOption = campusOptions.find(option => option.value === campus);
        return campusOption ? campusOption.label : campus;
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: status => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
    },
    {
      title: '最后登录',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      align: 'center',
      render: lastLogin => lastLogin || '-'
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="编辑">
            <Button 
              type="text" 
              size="small" 
              icon={<EditOutlined />} 
              onClick={() => showEditModal(record)} 
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button 
              type="text" 
              size="small" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => showDeleteConfirmModal(record)} 
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="user-management">
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4}>用户管理</Title>
        </Col>
        <Col>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={showAddModal}
          >
            添加用户
          </Button>
        </Col>
      </Row>

      {/* This section is now removed as it's duplicated inside the Card below */}

      {/* Main Card now wraps filters and table */}
      <Card>
        {/* Paste the filter Row here */}
        {/* 过滤条件区域 - 使用 Flex 布局实现均匀分布 */}
        <Row gutter={[16, 16]} style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 16 }}>
          {/* 移除 Col 的 span 属性，使用 flex: 1 */}
          <Col style={{ flex: 1, minWidth: '180px' }}> {/* 搜索框 */}
            <Input
              placeholder="搜索电话/姓名/ID"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Col>
          <Col style={{ flex: 1, minWidth: '150px' }}> {/* 角色选择 */}
            <Select
              mode="multiple"
              placeholder="选择角色 (可多选)"
              style={{ width: '100%' }}
              value={selectedRole}
              onChange={setSelectedRole}
              allowClear
              maxTagCount="responsive"
            >
              {roleOptions.map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </Select>
          </Col>
          <Col style={{ flex: 1, minWidth: '150px' }}> {/* 校区选择 */}
            <Select
              mode="multiple"
              placeholder="选择校区 (可多选)"
              style={{ width: '100%' }}
              value={selectedCampus}
              onChange={setSelectedCampus}
              allowClear
              maxTagCount="responsive"
            >
              {campusOptions.map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </Select>
          </Col>
          <Col style={{ flex: 1, minWidth: '150px' }}> {/* 状态选择 */}
            <Select
              mode="multiple"
              placeholder="选择状态 (可多选)"
              style={{ width: '100%' }}
              value={selectedStatus}
              onChange={setSelectedStatus}
              allowClear
              maxTagCount="responsive"
            >
              <Option value="active">启用</Option>
              <Option value="inactive">禁用</Option>
            </Select>
          </Col>
          {/* 按钮组 */}
          <Col style={{ flex: 'none' }}> {/* 让按钮组根据内容自适应宽度 */}
            <Space size="middle">
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={() => { setCurrentPage(1); fetchUsers(); }}
              >
                查询
              </Button>
              <Button
                icon={<RedoOutlined />}
                onClick={handleReset}
              >
                重置
              </Button>
            </Space>
          </Col>
        </Row>
        {/* Add margin below the filter row */}
        <div style={{ marginBottom: 16 }} />
        {/* Table starts here */}
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共 ${total} 条记录`,
            onChange: (page, pageSize) => {
              setCurrentPage(page);
              setPageSize(pageSize);
            },
          }}
        />
      </Card>

      {/* 添加/编辑用户模态框 */}
      <Modal
        title={<div style={{ fontSize: '18px', fontWeight: 'bold' }}>{editingUser ? '编辑用户' : '添加用户'}</div>}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={700}
        okText={editingUser ? '保存' : '添加'}
        cancelText="取消"
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
                  <Button type="link" style={{ padding: 0 }} onClick={handleResetPassword}>
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
                  <Option value="active">启用</Option>
                  <Option value="inactive">禁用</Option>
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

      {/* 删除确认模态框 */}
      <Modal
        title="删除确认"
        open={isDeleteModalVisible}
        onOk={handleDeleteUser}
        onCancel={handleDeleteModalCancel}
        okText="确认删除"
        cancelText="取消"
      >
        <p>确定要删除用户「{userToDelete?.name}」吗？此操作不可逆！</p>
      </Modal>
    </div>
  );
};

export default UserManagement; 