import { CourseType, CourseStatus } from '../types/course';
import { constants } from '@/api/constants';
import { Constant } from '@/api/constants/types';

// 课程类型选项 - 将由API动态获取
export const categoryOptions: { value: number; label: string }[] = [
  // 初始为空，将从API动态加载
];

// 获取课程类型选项的函数
export const fetchCategoryOptions = async (): Promise<{ value: number; label: string }[]> => {
  try {
    const courseTypes = await constants.getList('COURSE_TYPE');
    return courseTypes.map(item => ({
      value: item.id,
      label: item.constantValue
    }));
  } catch (error) {
    console.error('获取课程类型选项失败', error);
    return [];
  }
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