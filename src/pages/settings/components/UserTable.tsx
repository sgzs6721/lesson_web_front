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
      render: (campus: any, record: User) => {
        console.log('渲染校区数据:', campus);

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

          // 先尝试从静态选项中查找
          const campusOption = campusOptions.find(option => option.value === campus);
          if (campusOption) {
            return campusOption.label;
          }

          // 如果是数字字符串，可能是校区 ID，直接显示原始值
          // 在实际应用中，这里应该调用一个函数根据 ID 获取校区名称
          return campus;
        }

        // 如果是数字，可能是校区 ID
        if (typeof campus === 'number') {
          return String(campus);
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
        // 优先使用 createdTime 字段，它包含完整的时间信息
        if (record.createdTime) {
          return record.createdTime;
        }
        // 如果是 ISO 格式，保留完整时间
        if (createdAt && createdAt.includes('T')) {
          const date = new Date(createdAt);
          return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          }).replace(/\//g, '-');
        }
        return createdAt || '-';
      }
    },
    {
      title: '最后登录',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      align: 'center' as const,
      render: (lastLogin: string | undefined, record: User) => {
        // 优先使用 lastLoginTime 字段，它包含完整的时间信息
        if (record.lastLoginTime) {
          return record.lastLoginTime;
        }
        // 如果是 ISO 格式，保留完整时间
        if (lastLogin && lastLogin.includes('T')) {
          const date = new Date(lastLogin);
          return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          }).replace(/\//g, '-');
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