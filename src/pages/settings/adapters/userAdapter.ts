import { User as ApiUser, UserStatus } from '@/api/user/types';
import { User, UserRole, UserRoleItem } from '../types/user';

// 将API用户角色映射到前端用户角色
const mapRoleToUserRole = (role: string | { id: number | string; name: string }): UserRole => {
  // 如果是对象，使用id属性
  if (typeof role === 'object' && role) {
    // 将id转换为字符串并确保它是有效的UserRole
    const roleId = String(role.id);
    if (roleId === '1') {
      return UserRole.SUPER_ADMIN;
    } else if (roleId === '2') {
      return UserRole.COLLABORATOR;
    } else if (roleId === '3') {
      return UserRole.CAMPUS_ADMIN;
    }
  }

  // 如果是字符串并且是数字字符串
  if (typeof role === 'string') {
    if (role === '1') {
      return UserRole.SUPER_ADMIN;
    } else if (role === '2') {
      return UserRole.COLLABORATOR;
    } else if (role === '3') {
      return UserRole.CAMPUS_ADMIN;
    }

    // 如果是角色名称，映射到角色ID
    const roleNameMap: Record<string, UserRole> = {
      '超级管理员': UserRole.SUPER_ADMIN,
      '系统管理员': UserRole.SUPER_ADMIN, // 兼容旧的名称
      '协同管理员': UserRole.COLLABORATOR,
      '机构管理员': UserRole.COLLABORATOR,
      '校区管理员': UserRole.CAMPUS_ADMIN
    };

    if (roleNameMap[role]) {
      return roleNameMap[role];
    }
  }

  // 默认返回超级管理员
  return UserRole.SUPER_ADMIN;
};

// 将API用户状态映射到前端用户状态
const mapStatusToUserStatus = (status: UserStatus | string | number): 'ENABLED' | 'DISABLED' => {
  if (status === 'ENABLED') return 'ENABLED';
  if (status === 'DISABLED') return 'DISABLED';
  if (typeof status === 'number') {
    return status === 1 ? 'ENABLED' : 'DISABLED';
  }
  return 'ENABLED';
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

  // 处理多角色数据
  let rolesData: UserRoleItem[] = [];
  if (apiUser.roles && Array.isArray(apiUser.roles)) {
    // 如果API返回了多角色数据，直接使用
    rolesData = apiUser.roles.map((roleItem: any) => ({
      name: roleItem.name as UserRole,
      campusId: roleItem.campusId
    }));
  } else {
    // 兼容旧版本的单角色数据，转换为多角色格式
    const roleType = mapRoleToUserRole(roleName);
    let campusId: number | null = null;
    
    // 获取校区ID
    if (apiUser.campus) {
      if (typeof apiUser.campus === 'object' && apiUser.campus !== null) {
        campusId = Number(apiUser.campus.id);
      } else {
        campusId = Number(apiUser.campus);
      }
    } else if (apiUser.campusId) {
      campusId = Number(apiUser.campusId);
    }

    rolesData = [{ name: roleType, campusId }];
  }

  // 处理校区数据，确保它是一个包含 id 和 name 的对象
  let campusData;

  if (apiUser.campus) {
    // 如果校区数据是对象
    if (typeof apiUser.campus === 'object') {
      // 如果校区名称为 null，不设置名称，让表格组件显示横线
      if (apiUser.campus.name === null) {
        campusData = {
          id: apiUser.campus.id,
          name: null
        };
      } else {
        campusData = apiUser.campus;
      }
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

  // 处理日期格式 - 保留完整时间信息（包含时分秒）
  let createdAt = '';
  if (apiUser.createdTime) {
    // 直接使用原始时间字符串，不做处理
    createdAt = apiUser.createdTime;
  } else {
    // 如果没有创建时间，使用当前时间
    const now = new Date();
    createdAt = now.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/\//g, '-');
  }

  // 处理最后登录时间 - 保留完整时间信息（包含时分秒）
  let lastLogin = undefined;
  if (apiUser.lastLoginTime) {
    // 直接使用原始时间字符串，不做处理
    lastLogin = apiUser.lastLoginTime;
  }

  // 处理状态数据
  let statusValue: 'ENABLED' | 'DISABLED' = 'ENABLED';

  // 使用映射函数处理状态
  if (apiUser.status !== undefined) {
    statusValue = mapStatusToUserStatus(apiUser.status);
  }

  const user: User = {
    id: String(apiUser.id),
    phone: apiUser.phone,
    name: apiUser.realName,
    realName: apiUser.realName, // 保留原始的realName字段
    role: roleObj || mapRoleToUserRole(roleName),
    roles: rolesData, // 新增：多角色数据
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
export const userStatusToApiStatus = (status: 'ENABLED' | 'DISABLED'): UserStatus => {
  if (status === 'ENABLED') {
    return UserStatus.ENABLED;
  }
  return UserStatus.DISABLED;
};
