// Course type definitions

export interface Course {
  id: string;
  name: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  capacity: number;
  period: number;
  periodUnit: 'day' | 'week' | 'month';
  totalHours: number;
  consumedHours: number;
  hoursPerClass: number;
  unitPrice: number;
  status: 'active' | 'inactive' | 'pending';
  description: string;
  cover?: string;
  createdAt: string;
  updatedAt: string;
  campuses: string[];
  coaches: string[];
}

export type CourseSearchParams = {
  searchText: string;
  selectedCategory: string | undefined;
  selectedStatus: string | undefined;
  sortOrder: string | undefined;
};