import { RoleOption, CampusOption, UserRole } from '../types/user';

// 角色选项配置
export const roleOptions: RoleOption[] = [
  { value: UserRole.SUPER_ADMIN, label: '超级管理员', description: '系统超级管理员' },
  { value: UserRole.COLLABORATOR, label: '协同管理员', description: '协同管理员，协助管理系统' },
  { value: UserRole.CAMPUS_ADMIN, label: '校区管理员', description: '校区管理员，管理单个校区' }
];

// 校区选项配置
export const campusOptions: CampusOption[] = [
  { value: 'campus1', label: '北京中关村校区' },
  { value: 'campus2', label: '北京望京校区' },
  { value: 'campus3', label: '上海徐汇校区' },
  { value: 'campus4', label: '上海浦东校区' },
  { value: 'campus5', label: '广州天河校区' }
];

// 状态选项 - 启用放在第一位
export const statusOptions = [
  { value: 'ENABLED', label: '启用' },
  { value: 'DISABLED', label: '禁用' }
];

// 默认状态值
export const DEFAULT_STATUS = 'ENABLED';