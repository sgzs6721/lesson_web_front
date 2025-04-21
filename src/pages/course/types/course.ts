// Course type definitions
import { Course as ApiCourse, CourseType, CourseStatus } from '@/api/course/types';

// 将API课程类型重新导出，便于页面使用
export type Course = ApiCourse;

// 导出课程类型和状态枚举
export { CourseType, CourseStatus };

// 课程搜索参数
export type CourseSearchParams = {
  searchText: string;
  selectedType: CourseType | undefined;
  selectedStatus: CourseStatus | undefined;
  sortOrder: string | undefined;
};