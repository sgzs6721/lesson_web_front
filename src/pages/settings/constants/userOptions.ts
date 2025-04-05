import { RoleOption, CampusOption } from '../types/user';

// 角色选项配置
export const roleOptions: RoleOption[] = [
  { value: 'admin', label: '系统管理员' },
  { value: 'manager', label: '校区经理' },
  { value: 'teacher', label: '教练' },
  { value: 'finance', label: '财务' },
  { value: 'receptionist', label: '前台' }
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
  { value: 'active', label: '启用' },
  { value: 'inactive', label: '禁用' }
]; 