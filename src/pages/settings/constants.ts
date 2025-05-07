/**
 * 系统主题选项
 */
export const SYSTEM_THEMES = [
  { label: '默认主题', value: 'default' },
  { label: '绿色主题', value: 'green' },
  { label: '紫色主题', value: 'purple' },
  { label: '橙色主题', value: 'orange' },
  { label: '暗黑主题', value: 'dark' },
];

/**
 * 系统语言选项
 */
export const SYSTEM_LANGUAGES = [
  { label: '中文简体', value: 'zh_CN' },
  { label: '英文', value: 'en_US' },
];

/**
 * 日志级别选项
 */
export const LOG_LEVELS = [
  { label: '错误', value: 'error' },
  { label: '警告', value: 'warn' },
  { label: '信息', value: 'info' },
  { label: '调试', value: 'debug' },
  { label: '详细', value: 'verbose' },
];

/**
 * 上传文件类型限制
 */
export const ALLOWED_UPLOAD_TYPES = {
  IMAGE: ['image/jpeg', 'image/png', 'image/gif'],
  DOCUMENT: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  BACKUP: ['.zip', '.sql', '.gz'],
};

/**
 * 默认备份保留数量
 */
export const DEFAULT_BACKUP_COUNT = 10;

/**
 * 文件大小限制（MB）
 */
export const FILE_SIZE_LIMITS = {
  LOGO: 2,
  FAVICON: 1,
  BACKUP: 100,
  DOCUMENT: 10,
};

// 记薪周期选项
export const SALARY_CYCLES = [
  { label: '按月记薪', value: 'monthly' },
  { label: '双周记薪', value: 'biweekly' },
  { label: '按周记薪', value: 'weekly' }
];

// 加班工资计算倍率选项
export const OVERTIME_RATES = [
  { label: '1.5倍（工作日加班）', value: '1.5' },
  { label: '2倍（周末加班）', value: '2' },
  { label: '3倍（法定节假日加班）', value: '3' }
];

// 缺勤扣款规则选项
export const ATTENDANCE_DEDUCTION_RULES = [
  { label: '按天扣款', value: 'daily' },
  { label: '按小时扣款', value: 'hourly' }
];

// 奖金计算规则选项
export const BONUS_RULES = [
  { label: '固定金额', value: 'fixed' },
  { label: '按比例计算', value: 'percentage' }
];

// 绩效计算规则选项
export const PERFORMANCE_RULES = [
  { label: '标准绩效', value: 'standard' },
  { label: '自定义绩效', value: 'custom' }
];

// 提成计算规则选项
export const COMMISSION_RULES = [
  { label: '固定提成', value: 'fixed' },
  { label: '阶梯提成', value: 'tiered' },
  { label: '比例提成', value: 'percentage' }
];

// 备份频率选项
export const BACKUP_FREQUENCIES = [
  { label: '每日备份', value: 'daily' },
  { label: '每周备份', value: 'weekly' },
  { label: '每月备份', value: 'monthly' }
];

// 存储位置选项
export const STORAGE_LOCATIONS = [
  { label: '本地存储', value: 'local' },
  { label: '云存储', value: 'cloud' }
];

// 云服务提供商选项
export const CLOUD_PROVIDERS = [
  { label: '阿里云OSS', value: 'aliyun' },
  { label: '腾讯云COS', value: 'tencent' },
  { label: '亚马逊S3', value: 'aws' }
];

// 机构选项
export const ORGANIZATION_OPTIONS = [
  { label: '所有机构通用规则', value: 'all' },
  { label: '总部校区', value: 'headquarters' },
  { label: '东城校区', value: 'east' },
  { label: '西城校区', value: 'west' },
  { label: '南城校区', value: 'south' },
  { label: '北城校区', value: 'north' }
];

// 备份测试数据
export const MOCK_BACKUP_RECORDS = [
  {
    filename: 'backup_20240328_030000.zip',
    createdAt: '2024-03-28 03:00:00',
    size: '256MB',
    status: '完成'
  },
  {
    filename: 'backup_20240321_030000.zip',
    createdAt: '2024-03-21 03:00:00',
    size: '249MB',
    status: '完成'
  },
  {
    filename: 'backup_20240314_030000.zip',
    createdAt: '2024-03-14 03:00:00',
    size: '245MB',
    status: '完成'
  }
]; 