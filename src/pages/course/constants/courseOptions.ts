import { CourseType, CourseStatus } from '../types/course';
import { constants } from '@/api/constants';
import { Constant } from '@/api/constants/types';

// 课程类型选项 - 将由API动态获取
export const categoryOptions: { value: number; label: string }[] = [
  // 初始为空，将从API动态加载
];

// 添加缓存
let cachedCourseTypes: { value: number; label: string }[] = [];
let lastFetchTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 缓存5分钟

// 获取课程类型选项的函数
export const fetchCategoryOptions = async (): Promise<{ value: number; label: string }[]> => {
  // 检查缓存是否有效
  const now = Date.now();
  if (cachedCourseTypes.length > 0 && now - lastFetchTime < CACHE_TTL) {
    console.log('使用缓存的课程类型选项列表');
    return cachedCourseTypes;
  }

  try {
    console.log('从API获取课程类型选项');
    const courseTypes = await constants.getList('COURSE_TYPE');
    const result = courseTypes.map(item => ({
      value: item.id,
      label: item.constantValue
    }));
    
    // 更新缓存
    cachedCourseTypes = result;
    lastFetchTime = now;
    
    return result;
  } catch (error) {
    console.error('获取课程类型选项失败', error);
    // 如果获取失败但有缓存，返回缓存的数据
    if (cachedCourseTypes.length > 0) {
      console.log('API获取失败，使用缓存的课程类型选项');
      return cachedCourseTypes;
    }
    return [];
  }
};

// 提供静态方法获取已缓存的类型，不触发新的API请求
export const getCachedCategoryOptions = (): { value: number; label: string }[] => {
  return cachedCourseTypes;
};

// 通过ID获取类型名称
export const getTypeNameById = (id: number | string): string => {
  const typeOption = cachedCourseTypes.find(option => Number(option.value) === Number(id));
  if (typeOption) {
    return typeOption.label;
  }
  
  // 尝试使用常用类型名称
  const commonTypeNames: Record<string, string> = {
    '1': '一对一',
    '2': '一对二',
    '3': '大课'
  };
  
  return commonTypeNames[String(id)] || `类型${id}`;
};

// 排序选项
export const sortOptions = [
  { value: 'priceAsc', label: '课程单价升序' },
  { value: 'priceDesc', label: '课程单价降序' },
  { value: 'hoursAsc', label: '总课时升序' },
  { value: 'hoursDesc', label: '总课时降序' },
  { value: 'consumedHoursAsc', label: '已销课时升序' },
  { value: 'consumedHoursDesc', label: '已销课时降序' },
  { value: 'latestUpdate', label: '最近更新' },
];

// 状态选项
export const statusOptions = [
  { value: CourseStatus.PUBLISHED, label: '已发布' },
  { value: CourseStatus.SUSPENDED, label: '已暂停' },
  { value: CourseStatus.TERMINATED, label: '已终止' },
];

// 模拟校区和教练数据
export const campusOptions = [
  { value: 'campus_1', label: '北京中关村校区' },
  { value: 'campus_2', label: '北京望京校区' },
  { value: 'campus_3', label: '上海徐汇校区' },
  { value: 'campus_4', label: '上海浦东校区' },
  { value: 'campus_5', label: '广州天河校区' },
  { value: 'campus_6', label: '深圳南山校区' },
];

export const coachOptions = [
  { value: 'coach_1', label: '张教练' },
  { value: 'coach_2', label: '李教练' },
  { value: 'coach_3', label: '王教练' },
  { value: 'coach_4', label: '刘教练' },
  { value: 'coach_5', label: '陈教练' },
  { value: 'coach_6', label: '林教练' },
];