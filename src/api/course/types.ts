// Remove imports for shared types
// import { ApiResponse } from '../auth/types';
import { ApiResponse, PaginatedResponse } from '../types';

// 课程类型
export interface Course {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  institutionId: string;
  institutionName: string;
  createdAt: string;
  updatedAt: string;
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  capacity?: number;
  totalHours?: number;
  hoursPerClass?: number;
  unitPrice?: number;
  status?: 'active' | 'inactive' | 'pending';
  cover?: string;
  campuses?: string[];
  coaches?: string[];
}

// 课程搜索参数
export interface CourseSearchParams {
  searchText: string;
  selectedCategory?: string;
  selectedStatus?: string;
  sortOrder?: string;
}
