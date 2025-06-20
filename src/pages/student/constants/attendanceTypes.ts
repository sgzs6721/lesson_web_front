// 出勤类型定义
export const ATTENDANCE_TYPES = {
  NORMAL: 'NORMAL',     // 正常打卡
  LEAVE: 'LEAVE',       // 请假
  ABSENT: 'ABSENT'      // 缺勤
} as const;

// 出勤类型选项（用于下拉选择）
export const ATTENDANCE_TYPE_OPTIONS = [
  { value: ATTENDANCE_TYPES.NORMAL, label: '正常打卡' },
  { value: ATTENDANCE_TYPES.LEAVE, label: '请假' },
  { value: ATTENDANCE_TYPES.ABSENT, label: '缺勤' }
];

// 出勤类型标签颜色
export const ATTENDANCE_TYPE_COLORS = {
  [ATTENDANCE_TYPES.NORMAL]: '#52c41a',   // 绿色
  [ATTENDANCE_TYPES.LEAVE]: '#faad14',    // 橙色
  [ATTENDANCE_TYPES.ABSENT]: '#f5222d'    // 红色
};

// 出勤类型描述
export const ATTENDANCE_TYPE_DESCRIPTIONS = {
  [ATTENDANCE_TYPES.NORMAL]: '学员正常上课打卡',
  [ATTENDANCE_TYPES.LEAVE]: '学员请假，不扣除课时',
  [ATTENDANCE_TYPES.ABSENT]: '学员缺勤，扣除课时'
};

export type AttendanceType = typeof ATTENDANCE_TYPES[keyof typeof ATTENDANCE_TYPES]; 