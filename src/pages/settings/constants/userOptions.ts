import { RoleOption, CampusOption } from '../types/user';

// 角色选项配置
export const roleOptions: RoleOption[] = [
  { value: '1', label: '超级管理员' },
  { value: '2', label: '协同管理员' },
  { value: '3', label: '校区管理员' }
];

// 校区选项配置
export const campusOptions: CampusOption[] = [
  { value: 'campus1', label: '北京中关村校区' },
  { value: 'campus2', label: '北京望京校区' },
  { value: 'campus3', label: '上海徐汇校区' },
  { value: 'campus4', label: '上海浦东校区' },
  { value: 'campus5', label: '广州天河校区' }
];

// 状态选项
export const statusOptions = [
  { value: 'ENABLED', label: '启用' },
  { value: 'DISABLED', label: '禁用' }
];