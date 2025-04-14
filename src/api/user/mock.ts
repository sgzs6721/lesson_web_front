import { User, Role, UserStatus } from './types';
import { ApiResponse, PaginatedResponse } from '../types';

// 模拟角色数据
export const mockRoles: Role[] = [
  {
    id: 1,
    name: '超级管理员',
    code: 'SUPER_ADMIN',
    description: '拥有所有权限'
  },
  {
    id: 2,
    name: '机构管理员',
    code: 'INSTITUTION_ADMIN',
    description: '管理机构下的所有校区'
  },
  {
    id: 3,
    name: '校区管理员',
    code: 'CAMPUS_ADMIN',
    description: '管理单个校区'
  },
  {
    id: 4,
    name: '前台接待',
    code: 'RECEPTIONIST',
    description: '负责接待和基础信息录入'
  },
  {
    id: 5,
    name: '财务人员',
    code: 'FINANCE',
    description: '负责财务管理'
  },
  {
    id: 6,
    name: '教练',
    code: 'COACH',
    description: '负责课程教学'
  }
];

// 模拟用户数据
export const mockUsers: User[] = [
  {
    id: 1,
    phone: '13800138000',
    realName: '张三',
    roleId: 1,
    roleName: '超级管理员',
    role: {
      id: 1,
      name: '超级管理员'
    },
    status: UserStatus.ACTIVE,
    createdTime: '2023-01-01 00:00:00',
    lastLoginTime: '2023-06-01 10:00:00'
  },
  {
    id: 2,
    phone: '13800138001',
    realName: '李四',
    roleId: 2,
    roleName: '机构管理员',
    role: {
      id: 2,
      name: '机构管理员'
    },
    institutionId: 1,
    status: UserStatus.ACTIVE,
    createdTime: '2023-01-02 00:00:00',
    lastLoginTime: '2023-06-02 11:00:00'
  },
  {
    id: 3,
    phone: '13800138002',
    realName: '王五',
    roleId: 3,
    roleName: '校区管理员',
    role: {
      id: 3,
      name: '校区管理员'
    },
    institutionId: 1,
    campusId: 1,
    campusName: '北京中关村校区',
    campus: {
      id: 1,
      name: '北京中关村校区'
    },
    status: UserStatus.ACTIVE,
    createdTime: '2023-01-03 00:00:00',
    lastLoginTime: '2023-06-03 12:00:00'
  },
  {
    id: 4,
    phone: '13800138003',
    realName: '赵六',
    roleId: 4,
    roleName: '前台接待',
    role: {
      id: 4,
      name: '前台接待'
    },
    institutionId: 1,
    campusId: 1,
    campusName: '北京中关村校区',
    campus: {
      id: 1,
      name: '北京中关村校区'
    },
    status: UserStatus.ACTIVE,
    createdTime: '2023-01-04 00:00:00',
    lastLoginTime: '2023-06-04 13:00:00'
  },
  {
    id: 5,
    phone: '13800138004',
    realName: '钱七',
    roleId: 5,
    roleName: '财务人员',
    role: {
      id: 5,
      name: '财务人员'
    },
    institutionId: 1,
    campusId: 1,
    campusName: '北京中关村校区',
    campus: {
      id: 1,
      name: '北京中关村校区'
    },
    status: UserStatus.ACTIVE,
    createdTime: '2023-01-05 00:00:00',
    lastLoginTime: '2023-06-05 14:00:00'
  },
  {
    id: 6,
    phone: '13800138005',
    realName: '孙八',
    roleId: 6,
    roleName: '教练',
    role: {
      id: 6,
      name: '教练'
    },
    institutionId: 1,
    campusId: 1,
    campusName: '北京中关村校区',
    campus: {
      id: 1,
      name: '北京中关村校区'
    },
    status: UserStatus.ACTIVE,
    createdTime: '2023-01-06 00:00:00',
    lastLoginTime: '2023-06-06 15:00:00'
  },
  {
    id: 7,
    phone: '13800138006',
    realName: '周九',
    roleId: 6,
    roleName: '教练',
    role: {
      id: 6,
      name: '教练'
    },
    institutionId: 1,
    campusId: 2,
    campusName: '北京望京校区',
    campus: {
      id: 2,
      name: '北京望京校区'
    },
    status: UserStatus.INACTIVE,
    createdTime: '2023-01-07 00:00:00',
    lastLoginTime: '2023-06-07 16:00:00'
  },
  {
    id: 8,
    phone: '13800138007',
    realName: '吴十',
    roleId: 4,
    roleName: '前台接待',
    role: {
      id: 4,
      name: '前台接待'
    },
    institutionId: 1,
    campusId: 2,
    campusName: '北京望京校区',
    campus: {
      id: 2,
      name: '北京望京校区'
    },
    status: UserStatus.ACTIVE,
    createdTime: '2023-01-08 00:00:00',
    lastLoginTime: '2023-06-08 17:00:00'
  },
  {
    id: 9,
    phone: '13800138008',
    realName: '郑十一',
    roleId: 5,
    roleName: '财务人员',
    role: {
      id: 5,
      name: '财务人员'
    },
    institutionId: 1,
    campusId: 2,
    campusName: '北京望京校区',
    campus: {
      id: 2,
      name: '北京望京校区'
    },
    status: UserStatus.ACTIVE,
    createdTime: '2023-01-09 00:00:00',
    lastLoginTime: '2023-06-09 18:00:00'
  },
  {
    id: 10,
    phone: '13800138009',
    realName: '王十二',
    roleId: 3,
    roleName: '校区管理员',
    role: {
      id: 3,
      name: '校区管理员'
    },
    institutionId: 1,
    campusId: 2,
    campusName: '北京望京校区',
    campus: {
      id: 2,
      name: '北京望京校区'
    },
    status: UserStatus.ACTIVE,
    createdTime: '2023-01-10 00:00:00',
    lastLoginTime: '2023-06-10 19:00:00'
  }
];

// 模拟API响应
export const mockApiResponse = <T>(data: T): ApiResponse<T> => ({
  code: 0,
  message: '操作成功',
  data
});

// 模拟分页响应
export const mockPaginatedResponse = <T>(
  list: T[],
  page: number,
  pageSize: number,
  total: number
): PaginatedResponse<T> => ({
  list,
  page,
  pageSize,
  total
});
