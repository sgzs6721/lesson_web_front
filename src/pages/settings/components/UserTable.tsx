import React from 'react';
import { Table, Button, Tooltip, Space, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { User } from '../types/user';
import { roleOptions, campusOptions } from '../constants/userOptions';
import { UserRole } from '../types/user';
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

// 将各种可能的角色标识统一到标准键，并返回颜色
const getRoleKeyAndColor = (raw: string | undefined) => {
  const value = (raw || '').toString().toUpperCase();
  // 中文到英文键的宽松映射
  const mapLabelToKey: Record<string, UserRole> = {
    '超级管理员': UserRole.SUPER_ADMIN,
    '校区管理员': UserRole.CAMPUS_ADMIN,
    '协同管理员': UserRole.COLLABORATOR,
  };

  const normalizedKey: UserRole | undefined =
    (Object.keys(mapLabelToKey).find(lbl => value.includes(lbl))
      ? mapLabelToKey[Object.keys(mapLabelToKey).find(lbl => value.includes(lbl)) as keyof typeof mapLabelToKey]
      : (Object.values(UserRole).find(k => value.includes(k)) as UserRole | undefined));

  const roleKey = normalizedKey || (value as UserRole);

  // 统一的颜色映射：确保不同角色不同颜色
  const colorMap: Record<UserRole, string> = {
    [UserRole.SUPER_ADMIN]: '#ff4d4f',      // 红
    [UserRole.CAMPUS_ADMIN]: '#722ed1',     // 紫
    [UserRole.COLLABORATOR]: '#13c2c2',     // 青
  };

  const color = colorMap[(roleKey as UserRole)] || '#1677ff';
  return { roleKey, color };
};

// 生成浅色背景+边框的样式（保持默认圆角，不自定义）
const buildTagStyle = (mainColor: string): React.CSSProperties => {
  const bgColor = mainColor.startsWith('#')
    ? `${mainColor}33` // 20% 透明度
    : mainColor.replace('hsl', 'hsla').replace(')', ', 0.2)');
  return {
    backgroundColor: bgColor,
    color: mainColor,
    border: `1px solid ${mainColor}`,
    padding: '2px 10px',
    textAlign: 'center',
    margin: 0,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
};

// 基于固定高对比度调色板为校区生成稳定且彼此不同的颜色，相同校区始终同色
const campusColorMap = (() => {
  const map = new Map<string, string>();
  const palette = [
    '#f5222d', // red
    '#fa541c', // volcano
    '#fa8c16', // orange
    '#faad14', // gold
    '#a0d911', // lime
    '#52c41a', // green
    '#13c2c2', // cyan
    '#1677ff', // blue
    '#2f54eb', // geekblue
    '#722ed1', // purple
    '#eb2f96', // magenta
    '#08979c', // teal
  ];
  const hashToIndex = (text: string) => {
    let hash = 0;
    for (let i = 0; i < text.length; i++) hash = (hash << 5) - hash + text.charCodeAt(i);
    return Math.abs(hash);
  };
  return (label?: string) => {
    if (!label) return undefined;
    const key = label.trim();
    if (!map.has(key)) {
      if (key === '全部') {
        map.set(key, '#1677ff');
      } else {
        const base = hashToIndex(key);
        const color = palette[base % palette.length];
        map.set(key, color);
      }
    }
    return map.get(key);
  };
})();

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
  // 计算整个表格中所有角色和校区的最大长度，用于等宽显示
  const allRoleNames: string[] = [];
  const allCampusNames: string[] = [];
  
  users.forEach(user => {
    if (user.roles && user.roles.length > 0) {
      user.roles.forEach(roleItem => {
        const roleOption = roleOptions.find(option => option.value === roleItem.name);
        const roleName = roleOption ? roleOption.label : roleItem.name;
        allRoleNames.push(roleName);
        
        let campusInfo = '';
        const isCampusAdmin = roleItem.name === 'CAMPUS_ADMIN' || roleItem.name === '校区管理员';
        if (isCampusAdmin && roleItem.campusId) {
          campusInfo = roleItem.campusName || `校区${roleItem.campusId}`;
        } else if (!isCampusAdmin) {
          campusInfo = '全部';
        }
        allCampusNames.push(campusInfo);
      });
    } else {
      // 处理单角色数据
      let roleName = '';
      let campusInfo = '';
      
      if (user.role && typeof user.role === 'object') {
        const roleObj = user.role as { id: number | string; name: string };
        const roleOption = roleOptions.find(option => option.value === roleObj.name);
        roleName = roleOption ? roleOption.label : (user.roleName || roleObj.name || '');
      } else if (typeof user.role === 'string') {
        const roleOption = roleOptions.find(option => option.value === user.role as UserRole);
        roleName = roleOption ? roleOption.label : (user.roleName || user.role);
      } else if (user.roleName) {
        roleName = user.roleName;
      }
      
      if (user.campus && typeof user.campus === 'object') {
        campusInfo = user.campus.name === null ? '全部' : user.campus.name;
      } else if (typeof user.campus === 'string') {
        campusInfo = !user.campus ? '全部' : user.campus;
      } else if (typeof user.campus === 'number') {
        const campusOption = campusOptions.find(option => Number(option.value) === Number(user.campus));
        campusInfo = campusOption ? campusOption.label : `校区${user.campus}`;
      } else {
        campusInfo = '全部';
      }
      
      allRoleNames.push(roleName);
      allCampusNames.push(campusInfo);
    }
  });
  
  const maxRoleNameLength = Math.max(...allRoleNames.map(name => name.length));
  const maxCampusNameLength = Math.max(...allCampusNames.map(name => name.length));

  // 使用固定宽度，确保真正的等宽效果
  const roleTagWidth = '80px';  // 固定角色标签宽度
  const campusTagWidth = '60px'; // 固定校区标签宽度

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
      onCell: () => ({ style: { paddingTop: 16, paddingBottom: 16 } }),
      render: (role: any, record: User) => {
        // 优先显示多角色信息
        if (record.roles && record.roles.length > 0) {
          return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              {record.roles.map((roleItem, index) => {
                const roleOption = roleOptions.find(option => option.value === roleItem.name);
                const roleName = roleOption ? roleOption.label : roleItem.name;

                // 获取校区信息
                let campusInfo = '';
                // 检查是否为校区管理员角色（支持中文和英文名称）
                const isCampusAdmin = roleItem.name === 'CAMPUS_ADMIN' || roleItem.name === '校区管理员';
                if (isCampusAdmin && roleItem.campusId) {
                  // 直接使用API返回的campusName
                  campusInfo = roleItem.campusName || `校区${roleItem.campusId}`;
                } else if (!isCampusAdmin) {
                  // 非校区管理员显示"全部"
                  campusInfo = '全部';
                }

                const { color: roleColor } = getRoleKeyAndColor(roleItem.name);
                const campusMainColor = campusColorMap(campusInfo);
 
                return (
                  <div key={index}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Tag style={{ ...buildTagStyle(roleColor), minWidth: roleTagWidth }}>
                        {roleName}
                      </Tag>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        width: '16px',
                        margin: '0 8px'
                      }}>
                        <span style={{ color: '#666', fontSize: '12px' }}>|</span>
                      </div>
                      <Tag style={{ ...buildTagStyle(campusMainColor || '#1677ff'), minWidth: campusTagWidth }}>
                        {campusInfo}
                      </Tag>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        }

        // 兼容旧版本的单角色数据
        let roleName = '';
        let campusInfo = '';
        let roleKeyRaw: string | undefined;

        // 处理角色信息
        if (role && typeof role === 'object') {
          roleKeyRaw = (role.name ?? role.value ?? role.key) as string | undefined;
          const roleOption = roleOptions.find(option => option.value === roleKeyRaw);
          roleName = roleOption ? roleOption.label : (record.roleName || roleKeyRaw || '');
        } else if (typeof role === 'string') {
          roleKeyRaw = role; // 可能是英文键或中文名称
          const roleOption = roleOptions.find(option => option.value === role as UserRole);
          roleName = roleOption ? roleOption.label : (record.roleName || role);
        } else if (record.roleName) {
          roleKeyRaw = record.roleName;
          roleName = record.roleName;
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

        const { color: roleColor } = getRoleKeyAndColor(roleKeyRaw || roleName);
        const campusMainColor = campusColorMap(campusInfo);
 
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Tag style={{ ...buildTagStyle(roleColor), minWidth: roleTagWidth }}>
                {roleName}
              </Tag>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: '16px',
                margin: '0 8px'
              }}>
                <span style={{ color: '#666', fontSize: '12px' }}>|</span>
              </div>
              <Tag style={{ ...buildTagStyle(campusMainColor || '#1677ff'), minWidth: campusTagWidth }}>
                {campusInfo}
              </Tag>
            </div>
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