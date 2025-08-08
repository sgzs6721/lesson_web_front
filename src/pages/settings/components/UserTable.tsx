import React from 'react';
import { Table, Button, Tooltip, Space, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { User } from '../types/user';
import { roleOptions, campusOptions } from '../constants/userOptions';
import StandardPagination from '@/components/common/StandardPagination';

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
      title: '角色/校区',
      dataIndex: 'role',
      key: 'role',
      align: 'center' as const,
      render: (role: any, record: User) => {
        // 优先显示多角色信息
        if (record.roles && record.roles.length > 0) {
          return (
            <div>
              {record.roles.map((roleItem, index) => {
                const roleOption = roleOptions.find(option => option.value === roleItem.name);
                const roleName = roleOption ? roleOption.label : roleItem.name;
                
                // 获取校区信息
                let campusInfo = '';
                if (roleItem.name === 'CAMPUS_ADMIN' && roleItem.campusId) {
                  const campusOption = campusOptions.find(option => Number(option.value) === roleItem.campusId);
                  campusInfo = campusOption ? campusOption.label : `校区${roleItem.campusId}`;
                } else if (roleItem.name !== 'CAMPUS_ADMIN') {
                  // 非校区管理员显示"全部"
                  campusInfo = '全部';
                }
                
                return (
                  <div key={index} style={{ marginBottom: index < (record.roles?.length || 0) - 1 ? '8px' : '0' }}>
                    <Tag 
                      color={roleItem.name === 'SUPER_ADMIN' ? 'red' : 
                             roleItem.name === 'CAMPUS_ADMIN' ? 'blue' : 'green'}
                    >
                      {roleName} | {campusInfo}
                    </Tag>
                  </div>
                );
              })}
            </div>
          );
        }

        // 兼容旧版本的单角色数据
        let roleName = '';
        let campusInfo = '';
        
        // 处理角色信息
        if (role && typeof role === 'object' && role.name) {
          const roleOption = roleOptions.find(option => option.value === role.name);
          roleName = roleOption ? roleOption.label : role.name;
        } else if (typeof role === 'string') {
          const roleOption = roleOptions.find(option => option.value === role);
          roleName = roleOption ? roleOption.label : role;
        }

        // 处理校区信息
        if (record.campus && typeof record.campus === 'object') {
          if (record.campus.name === null) {
            campusInfo = '全部';
          } else {
            campusInfo = record.campus.name;
          }
        } else if (typeof record.campus === 'string') {
          if (!record.campus) {
            campusInfo = '全部';
          } else {
            const campusOption = campusOptions.find(option => option.value === record.campus);
            campusInfo = campusOption ? campusOption.label : record.campus;
          }
        } else if (typeof record.campus === 'number') {
          const campusOption = campusOptions.find(option => Number(option.value) === Number(record.campus));
          campusInfo = campusOption ? campusOption.label : `校区${record.campus}`;
        } else {
          campusInfo = '全部';
        }

                 return (
           <div>
             <Tag color={roleName.includes('超级管理员') ? 'red' : 
                        roleName.includes('校区管理员') ? 'blue' : 'green'}>
               {roleName} | {campusInfo}
             </Tag>
           </div>
         );
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
          // 确保时间格式包含秒
          if (record.createdTime.includes(':')) {
            return record.createdTime;
          } else {
            // 如果只有日期，添加时间部分
            return `${record.createdTime} 00:00:00`;
          }
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
        // 如果只有日期，添加时间部分
        if (createdAt && !createdAt.includes(':')) {
          return `${createdAt} 00:00:00`;
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
          // 确保时间格式包含秒
          if (record.lastLoginTime.includes(':')) {
            return record.lastLoginTime;
          } else {
            // 如果只有日期，添加时间部分
            return `${record.lastLoginTime} 00:00:00`;
          }
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
        // 如果只有日期，添加时间部分
        if (lastLogin && !lastLogin.includes(':')) {
          return `${lastLogin} 00:00:00`;
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
    <>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={false}
      />
      <StandardPagination
        current={currentPage}
        pageSize={pageSize}
        total={total}
        onChange={onPageChange}
        totalText="个用户"
      />
    </>
  );
};

export default UserTable;