import { useState } from 'react';
import { Form, message, UploadFile } from 'antd';
import { FormInstance } from 'antd/lib/form';
import dayjs from 'dayjs';
import { 
  IBasicSettings, 
  ISalarySettings, 
  IBackupSettings, 
  TabKey 
} from '../types';

export interface IUseSystemSettingsResult {
  // 状态
  activeTab: TabKey;
  logoFileList: UploadFile[];
  coachTypeOptions: string[];
  coachLevelOptions: string[];
  courseTypeOptions: string[];
  courseLevelOptions: string[];
  
  // 表单实例
  basicForm: FormInstance;
  salaryForm: FormInstance;
  backupForm: FormInstance;
  
  // 方法
  setActiveTab: (tab: TabKey) => void;
  handleLogoChange: (info: { fileList: UploadFile[] }) => void;
  beforeUpload: (file: File) => boolean;
  handleManualBackup: () => void;
  saveBasicSettings: (values: IBasicSettings) => void;
  saveSalarySettings: (values: ISalarySettings) => void;
  saveBackupSettings: (values: IBackupSettings) => void;
  saveAllOptions: () => void;
  
  // 选项管理方法
  addOption: (type: string, value: string) => void;
  deleteOption: (type: string, index: number) => void;
  updateOption: (type: string, index: number, value: string) => void;
}

export default function useSystemSettings(): IUseSystemSettingsResult {
  // 状态
  const [activeTab, setActiveTab] = useState<TabKey>('basic');
  const [logoFileList, setLogoFileList] = useState<UploadFile[]>([]);
  
  // 表单实例
  const [basicForm] = Form.useForm<IBasicSettings>();
  const [salaryForm] = Form.useForm<ISalarySettings>();
  const [backupForm] = Form.useForm<IBackupSettings>();
  
  // 选项管理状态
  const [coachTypeOptions, setCoachTypeOptions] = useState<string[]>([
    '全职教练', '兼职教练', '合同教练'
  ]);
  const [coachLevelOptions, setCoachLevelOptions] = useState<string[]>([
    '初级教练', '资深教练', '专家教练'
  ]);
  const [courseTypeOptions, setCourseTypeOptions] = useState<string[]>([
    '一对一课程', '一对二课程', '小班课程', '团体课程'
  ]);
  const [courseLevelOptions, setCourseLevelOptions] = useState<string[]>([
    '初级课程', '中级课程', '高级课程'
  ]);

  // 初始化表单数据
  useState(() => {
    // 模拟加载系统配置数据
    basicForm.setFieldsValue({
      institutionTitle: '培训机构管理系统',
      institutionSubtitle: '核心业务管理平台',
      theme: 'default',
      language: 'zh_CN'
    });
    
    salaryForm.setFieldsValue({
      salaryCycle: 'monthly',
      salaryDate: 5,
      periodStart: 1,
      periodEnd: 31,
      basicSalary: true,
      classHourFee: true,
      performanceBonus: true,
      socialInsurance: true,
      housingFund: true,
      personalIncomeTax: true,
      overtimeRate: '1.5',
      attendanceDeduction: 'hourly',
      bonusRules: 'percentage',
      salaryBase: 5000,
      performanceRules: 'standard',
      commissionRules: 'percentage'
    });
    
    backupForm.setFieldsValue({
      enableAutoBackup: true,
      backupFrequency: 'weekly',
      backupTime: dayjs('03:00', 'HH:mm').format(),
      retentionDays: 30,
      backupStorage: 'local'
    });
  });

  // 保存设置方法
  const saveBasicSettings = (values: IBasicSettings) => {
    console.log('Basic settings saved:', values);
    message.success('基本设置已保存');
  };
  
  const saveSalarySettings = (values: ISalarySettings) => {
    console.log('Salary settings saved:', values);
    message.success('工资设置已保存');
  };
  
  const saveBackupSettings = (values: IBackupSettings) => {
    console.log('Backup settings saved:', values);
    message.success('备份设置已保存');
  };

  // 执行手动备份
  const handleManualBackup = () => {
    message.loading('正在备份数据...', 1.5)
      .then(() => message.success('数据备份成功'));
  };

  // 处理Logo上传
  const handleLogoChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setLogoFileList(fileList);
    if (fileList.length > 0) {
      message.success('Logo上传成功');
    }
  };

  // 上传前检查
  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传JPG/PNG格式的图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过2MB!');
    }
    return false;
  };

  // 选项管理方法
  const addOption = (type: string, value: string) => {
    if (!value.trim()) {
      message.error('选项内容不能为空');
      return;
    }

    switch (type) {
      case 'coachType':
        setCoachTypeOptions([...coachTypeOptions, value]);
        break;
      case 'coachLevel':
        setCoachLevelOptions([...coachLevelOptions, value]);
        break;
      case 'courseType':
        setCourseTypeOptions([...courseTypeOptions, value]);
        break;
      case 'courseLevel':
        setCourseLevelOptions([...courseLevelOptions, value]);
        break;
      default:
        break;
    }
    message.success('选项添加成功');
  };

  const deleteOption = (type: string, index: number) => {
    switch (type) {
      case 'coachType':
        setCoachTypeOptions(coachTypeOptions.filter((_, i) => i !== index));
        break;
      case 'coachLevel':
        setCoachLevelOptions(coachLevelOptions.filter((_, i) => i !== index));
        break;
      case 'courseType':
        setCourseTypeOptions(courseTypeOptions.filter((_, i) => i !== index));
        break;
      case 'courseLevel':
        setCourseLevelOptions(courseLevelOptions.filter((_, i) => i !== index));
        break;
      default:
        break;
    }
    message.success('选项删除成功');
  };

  const updateOption = (type: string, index: number, value: string) => {
    if (!value.trim()) {
      message.error('选项内容不能为空');
      return;
    }

    switch (type) {
      case 'coachType':
        const newCoachTypes = [...coachTypeOptions];
        newCoachTypes[index] = value;
        setCoachTypeOptions(newCoachTypes);
        break;
      case 'coachLevel':
        const newCoachLevels = [...coachLevelOptions];
        newCoachLevels[index] = value;
        setCoachLevelOptions(newCoachLevels);
        break;
      case 'courseType':
        const newCourseTypes = [...courseTypeOptions];
        newCourseTypes[index] = value;
        setCourseTypeOptions(newCourseTypes);
        break;
      case 'courseLevel':
        const newCourseLevels = [...courseLevelOptions];
        newCourseLevels[index] = value;
        setCourseLevelOptions(newCourseLevels);
        break;
      default:
        break;
    }
  };

  const saveAllOptions = () => {
    console.log('Saving options:', {
      coachTypeOptions,
      coachLevelOptions,
      courseTypeOptions,
      courseLevelOptions
    });
    message.success('选项设置已保存');
  };

  return {
    activeTab,
    logoFileList,
    coachTypeOptions,
    coachLevelOptions,
    courseTypeOptions,
    courseLevelOptions,
    basicForm,
    salaryForm,
    backupForm,
    setActiveTab,
    handleLogoChange,
    beforeUpload,
    handleManualBackup,
    saveBasicSettings,
    saveSalarySettings,
    saveBackupSettings,
    saveAllOptions,
    addOption,
    deleteOption,
    updateOption
  };
} 