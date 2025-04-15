import { User as ApiUser, UserStatus } from '@/api/user/types';
import { User, UserRole } from '../types/user';

// 将API用户角色映射到前端用户角色
const mapRoleToUserRole = (role: string | { id: number | string; name: string }): UserRole => {
  // 如果是对象，使用id属性
  if (typeof role === 'object' && role) {
    // 将id转换为字符串并确保它是有效的UserRole
    const roleId = String(role.id);
    if (roleId === '1' || roleId === '2' || roleId === '3') {
      return roleId as UserRole;
    }
  }

  // 如果是字符串并且是数字字符串
  if (typeof role === 'string') {
    if (role === '1' || role === '2' || role === '3') {
      return role as UserRole;
    }

    // 如果是角色名称，映射到角色ID
    const roleNameMap: Record<string, UserRole> = {
      '超级管理员': '1',
      '系统管理员': '1', // 兼容旧的名称
      '协同管理员': '2',
      '机构管理员': '2',
      '校区管理员': '3'
    };

    if (roleNameMap[role]) {
      return roleNameMap[role];
    }
  }

  // 默认返回超级管理员
  return '1';
};

// 将API用户状态映射到前端用户状态
const mapStatusToUserStatus = (status: UserStatus): 'ENABLED' | 'DISABLED' => {
  return status === UserStatus.ACTIVE ? 'ENABLED' : 'DISABLED';
};

// 将API用户数据转换为前端用户数据
export const apiUserToUser = (apiUser: ApiUser): User => {
  console.log('API User:', apiUser);

  // 判断角色信息是对象还是字符串
  let roleName = '';
  if (apiUser.role && typeof apiUser.role === 'object') {
    roleName = apiUser.role.name;
  } else if (apiUser.roleName) {
    roleName = apiUser.roleName;
  }

  // 保留原始的 role 对象
  const roleObj = apiUser.role && typeof apiUser.role === 'object' ? apiUser.role : undefined;

  // 处理校区数据，确保它是一个包含 id 和 name 的对象
  let campusData;

  if (apiUser.campus) {
    // 如果校区数据是对象
    if (typeof apiUser.campus === 'object') {
      campusData = apiUser.campus;
    }
    // 如果校区数据是字符串或数字，创建一个对象
    else {
      campusData = {
        id: apiUser.campus,
        name: apiUser.campusName || `校区${apiUser.campus}`
      };
    }
  }
  // 如果有校区ID但没有校区对象
  else if (apiUser.campusId) {
    campusData = {
      id: apiUser.campusId,
      name: apiUser.campusName || `校区${apiUser.campusId}`
    };
  }
  // 如果只有校区名称
  else if (apiUser.campusName) {
    campusData = {
      id: '0', // 临时ID
      name: apiUser.campusName
    };
  }

  // 处理日期格式
  let createdAt = '';
  if (apiUser.createdTime) {
    // 如果是 ISO 格式，取前 10 位
    if (apiUser.createdTime.includes('T')) {
      createdAt = apiUser.createdTime.split('T')[0];
    } else {
      // 如果是普通日期格式，取空格前的部分
      createdAt = apiUser.createdTime.split(' ')[0];
    }
  } else {
    createdAt = new Date().toISOString().split('T')[0];
  }

  // 处理最后登录时间
  let lastLogin = undefined;
  if (apiUser.lastLoginTime) {
    // 如果是 ISO 格式，取前 10 位
    if (apiUser.lastLoginTime.includes('T')) {
      lastLogin = apiUser.lastLoginTime.split('T')[0];
    } else {
      // 如果是普通日期格式，取空格前的部分
      lastLogin = apiUser.lastLoginTime.split(' ')[0];
    }
  }

  // 处理状态数据
  let statusValue = apiUser.status;
  // 确保状态值是字符串类型的'ENABLED'或'DISABLED'
  if (typeof statusValue === 'number') {
    statusValue = statusValue === 1 ? 'ENABLED' : 'DISABLED';
  } else if (typeof statusValue === 'string') {
    // 如果已经是字符串，确保是大写形式
    statusValue = statusValue.toUpperCase();
    // 确保值是有效的
    if (statusValue !== 'ENABLED' && statusValue !== 'DISABLED') {
      statusValue = 'ENABLED'; // 默认启用
    }
  } else {
    // 如果状态值无效，使用默认值
    statusValue = 'ENABLED';
  }

  const user: User = {
    id: String(apiUser.id),
    phone: apiUser.phone,
    name: apiUser.realName,
    realName: apiUser.realName, // 保留原始的realName字段
    role: roleObj || mapRoleToUserRole(roleName),
    roleName: roleName,
    campus: campusData, // 使用处理后的校区数据
    status: statusValue, // 使用处理后的状态值
    statusText: apiUser.statusText || (statusValue === 'ENABLED' ? '启用' : '禁用'),
    createdAt: createdAt,
    lastLogin: lastLogin,
    createdTime: apiUser.createdTime, // 保留原始的createdTime字段
    lastLoginTime: apiUser.lastLoginTime // 保留原始的lastLoginTime字段
  };

  console.log('Transformed User:', user);
  return user;
};

// 将前端用户状态映射到API用户状态
export const userStatusToApiStatus = (status: 'ENABLED' | 'DISABLED' | number): UserStatus => {
  if (typeof status === 'number') {
    return status === 1 ? UserStatus.ACTIVE : UserStatus.INACTIVE;
  }
  return status === 'ENABLED' ? UserStatus.ACTIVE : UserStatus.INACTIVE;
};
