import { User, UserRole } from '../types/user';
import { campusOptions } from './userOptions';

// 生成测试数据
export const mockUsers: User[] = Array(30)
  .fill(null)
  .map((_, index) => {
    const roles = [UserRole.SUPER_ADMIN, UserRole.COLLABORATOR, UserRole.CAMPUS_ADMIN] as const;
    const role = roles[index % 3];

    return {
      id: `U${10000 + index}`,
      phone: `1${Math.floor(Math.random() * 9) + 3}${String(Math.floor(Math.random() * 1000000000)).padStart(9, '0')}`,
      name: `用户${index + 1}`,
      role,
      campus: role === UserRole.SUPER_ADMIN || role === UserRole.COLLABORATOR ? undefined : campusOptions[index % 5].value,
      status: index % 7 === 0 ? 'DISABLED' : 'ENABLED',
      createdAt: `2023-${Math.floor(index / 3) + 1}-${(index % 28) + 1}`,
      lastLogin: index % 3 === 0 ? undefined : `2023-${Math.floor(index / 2) + 1}-${(index % 28) + 1}`
    };
  });