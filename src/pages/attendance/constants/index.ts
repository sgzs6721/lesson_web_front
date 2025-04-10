export const STATUS_TEXT_MAP = {
  present: '已到',
  absent: '缺席',
  late: '迟到',
  leave: '请假'
} as const;

export const STATUS_COLOR_MAP = {
  present: 'success',
  absent: 'error',
  late: 'warning',
  leave: 'default'
} as const;

export const COURSE_OPTIONS = [
  { value: 'c1', label: '青少年篮球训练A班' },
  { value: 'c2', label: '网球精英班' },
  { value: 'c3', label: '少儿游泳入门班' },
  { value: 'c4', label: '成人健身基础班' },
  { value: 'c5', label: '瑜伽初级班' },
];

export const CAMPUS_OPTIONS = [
  { value: 'campus1', label: '北京中关村校区' },
  { value: 'campus2', label: '北京望京校区' },
  { value: 'campus3', label: '上海徐汇校区' },
  { value: 'campus4', label: '上海浦东校区' },
  { value: 'campus5', label: '广州天河校区' },
]; 