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
      render: (role: any, record: User) => {
        // 如果 role 是对象并且有 name 属性，直接返回 name
        if (role && typeof role === 'object' && role.name) {
          return role.name;
        }

        // 兼容旧的数据结构，如果 role 是字符串，尝试从 roleOptions 中查找对应的标签
        if (typeof role === 'string') {
          const roleOption = roleOptions.find(option => option.value === role);
          return roleOption ? roleOption.label : role;
        }

        return '-';
      }
    },
    {
      title: '所属校区',
      dataIndex: 'campus',
      key: 'campus',
      align: 'center' as const,
      render: (campus: any) => {
        // 如果 campus 是对象并且有 name 属性
        if (campus && typeof campus === 'object') {
          // 如果 name 为 null，返回未设置
          if (campus.name === null) {
            return '未设置';
          }
          return campus.name;
        }

        // 兼容旧的数据结构，如果 campus 是字符串
        if (typeof campus === 'string') {
          if (!campus) return '-';
          const campusOption = campusOptions.find(option => option.value === campus);
          return campusOption ? campusOption.label : campus;
        }

        return '-';
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center' as const,
      render: (status: 'ENABLED' | 'DISABLED' | number, record: User) => {
        // 如果有 statusText 字段，直接使用
        if (record.statusText) {
          return (
            <Tag color={record.statusText === '启用' ? 'green' : 'red'}>
              {record.statusText}
            </Tag>
          );
        }

        // 兼容旧的数据结构
        if (typeof status === 'string') {
          return (
            <Tag color={status === 'ENABLED' ? 'green' : 'red'}>
              {status === 'ENABLED' ? '启用' : '禁用'}
            </Tag>
          );
        }

        // 如果 status 是数字
        if (typeof status === 'number') {
          return (
            <Tag color={status === 1 ? 'green' : 'red'}>
              {status === 1 ? '启用' : '禁用'}
            </Tag>
          );
        }

        return '-';
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center' as const,
      render: (createdAt: string, record: User) => {
        // 如果是 ISO 格式，取前 10 位
        if (createdAt && createdAt.includes('T')) {
          return createdAt.split('T')[0];
        }
        return createdAt || '-';
      }
    },
    {
      title: '最后登录',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      align: 'center' as const,
      render: (lastLogin?: string) => {
        // 如果是 ISO 格式，取前 10 位
        if (lastLogin && lastLogin.includes('T')) {
          return lastLogin.split('T')[0];
        }
        return lastLogin || '-';
      }
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