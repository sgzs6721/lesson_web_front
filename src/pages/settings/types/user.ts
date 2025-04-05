export type UserRole = 'admin' | 'manager' | 'teacher' | 'finance' | 'receptionist';

export interface User {
  id: string;
  phone: string;
  name: string;
  role: UserRole;
  campus?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin?: string;
}

export interface CampusOption {
  value: string;
  label: string;
}

export interface RoleOption {
  value: UserRole;
  label: string;
}

export type UserSearchParams = {
  searchText: string;
  selectedRole: string[];
  selectedCampus: string[];
  selectedStatus: ('active' | 'inactive')[];
}; 