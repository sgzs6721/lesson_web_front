// 基础设置类型
export interface IBasicSettings {
  institutionTitle: string;
  institutionSubtitle: string;
  systemLogo: string;
  theme: string;
  favicon: string;
  language: string;
}

// 工资设置类型
export interface ISalarySettings {
  salaryCycle: 'monthly' | 'biweekly' | 'weekly';
  salaryDate: number;
  periodStart: number;
  periodEnd: number;
  basicSalary: boolean;
  classHourFee: boolean;
  performanceBonus: boolean;
  socialInsurance: boolean;
  housingFund: boolean;
  personalIncomeTax: boolean;
  organizationSelect?: string;
  overtimeRate: string;
  attendanceDeduction: 'daily' | 'hourly';
  bonusRules: 'fixed' | 'percentage';
  salaryBase: number;
  performanceRules: 'standard' | 'custom';
  commissionRules: 'fixed' | 'tiered' | 'percentage';
}

// 备份设置类型
export interface IBackupSettings {
  enableAutoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  backupTime: string;
  retentionDays: number;
  backupStorage: 'local' | 'cloud';
  cloudProvider?: 'aliyun' | 'tencent' | 'aws';
}

// 选项管理类型
export interface IOptionItem {
  id: string;
  name: string;
  value: string;
  enabled?: boolean;
  description?: string;
  status?: number;
}

export interface IOptionListProps {
  type: string;
  options: IOptionItem[];
  title: string;
  addButtonText: string;
  onAdd: (option: IOptionItem) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, option: IOptionItem) => void;
  loading?: boolean;
  closeForm?: boolean;
}

// 备份记录类型
export interface IBackupRecord {
  filename: string;
  createdAt: string;
  size: string;
  status: string;
}

// 表单组件接口
export interface IFormCardProps {
  title: string;
  children: React.ReactNode;
}

// 组件Tab类型
export type TabKey = 'basic' | 'salary' | 'options' | 'backup';

export interface IAdvancedSettings {
  enableCache: boolean;
  cacheExpirationTime: number;
  enableLogs: boolean;
  logLevel: string;
  maxUploadFileSize: number;
  maxSessionDuration: number;
  enableMaintenance: boolean;
  enableUserRegistration: boolean;
}

export interface IBackupItem {
  id: string;
  name: string;
  createdAt: string;
  size: string;
} 