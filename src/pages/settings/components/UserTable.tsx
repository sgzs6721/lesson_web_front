import React from 'react';
import { Table, Button, Tooltip, Space, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { User } from '../types/user';
import { roleOptions, campusOptions } from '../constants/userOptions';

interface UserTableProps {
  users: User[];
  loading: boolean;
  total: number;
  currentPage: number;
  pageSize: number;
  onEdit: (record: User) => void;
  onDelete: (record: User) => void;
  onPageChange: (page: number, pageSize: number) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  loading,
  total,
  currentPage,
  pageSize,
  onEdit,
  onDelete,
  onPageChange
}) => {
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      align: 'center' as const,
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
      align: 'center' as const,
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      align: 'center' as const,
      render: (role: string) => {
        const roleOption = roleOptions.find(option => option.value === role);
        return roleOption ? roleOption.label : role;
      }
    },
    {
      title: '所属校区',
      dataIndex: 'campus',
      key: 'campus',
      align: 'center' as const,
      render: (campus?: string) => {
        if (!campus) return '-';
        const campusOption = campusOptions.find(option => option.value === campus);
        return campusOption ? campusOption.label : campus;
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center' as const,
      render: (status: 'active' | 'inactive') => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center' as const,
    },
    {
      title: '最后登录',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      align: 'center' as const,
      render: (lastLogin?: string) => lastLogin || '-'
    },
    {
      title: '操作',
      key: 'action',
      align: 'center' as const,
      render: (_: any, record: User) => (
        <Space size="middle">
          <Tooltip title="编辑">
            <Button 
              type="text" 
              size="small" 
              icon={<EditOutlined />} 
              onClick={() => onEdit(record)} 
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button 
              type="text" 
              size="small" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => onDelete(record)} 
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
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
        onChange: onPageChange
      }}
    />
  );
};

export default UserTable; 