import { CourseType, CourseStatus } from '../types/course';

// 课程类型选项
export const categoryOptions = [
  { value: 1, label: '私教课' },
  { value: 2, label: '团体课' },
  { value: 3, label: '线上课' },
];

// 排序选项
export const sortOptions = [
  { value: 'priceAsc', label: '课筹单价升序' },
  { value: 'priceDesc', label: '课筹单价降序' },
  { value: 'hoursAsc', label: '总课时升序' },
  { value: 'hoursDesc', label: '总课时降序' },
  { value: 'consumedHoursAsc', label: '已销课时升序' },
  { value: 'consumedHoursDesc', label: '已销课时降序' },
  { value: 'latestUpdate', label: '最近更新' },
];

// 状态选项
export const statusOptions = [
  { value: CourseStatus.DRAFT, label: '草稿' },
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