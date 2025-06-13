import React, { useState, useEffect } from 'react';
import { Tabs, Form, message, Space } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { 
  SettingOutlined, 
  ToolOutlined, 
  AppstoreOutlined, 
  SafetyCertificateOutlined
} from '@ant-design/icons';
import { 
  IBasicSettings, 
  IAdvancedSettings, 
  IOptionItem,
  IBackupItem,
  TabKey 
} from '../types';
import { SYSTEM_THEMES, SYSTEM_LANGUAGES } from '../constants';
import BasicSettingsTab from './BasicSettingsTab';
import AdvancedSettingsTab from './AdvancedSettingsTab';
import OptionsTab from './OptionsTab';
import BackupTab from './BackupTab';
import './SystemSettings.css';
import '../styles/settings.css';

const SystemSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('basic');
  const [basicForm] = Form.useForm<IBasicSettings>();
  const [advancedForm] = Form.useForm<IAdvancedSettings>();
  
  // 各选项状态
  const [courseTypeOptions, setCourseTypeOptions] = useState<IOptionItem[]>([]);
  const [paymentMethodOptions, setPaymentMethodOptions] = useState<IOptionItem[]>([]);
  const [giftOptions, setGiftOptions] = useState<IOptionItem[]>([]);
  const [feeOptions, setFeeOptions] = useState<IOptionItem[]>([]);
  const [expireTypeOptions, setExpireTypeOptions] = useState<IOptionItem[]>([]);
  const [expenseTypeOptions, setExpenseTypeOptions] = useState<IOptionItem[]>([]);
  const [backupList, setBackupList] = useState<IBackupItem[]>([]);
  const [logoFileList, setLogoFileList] = useState<any[]>([]);
  
  // 删除模态框相关状态
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: string, type: string, name: string} | null>(null);

  // 模拟初始化数据
  useEffect(() => {
    // 初始化基本设置表单数据
    basicForm.setFieldsValue({
      institutionTitle: '课程管理系统',
      institutionSubtitle: '高效的教学管理平台',
      systemLogo: '',
      theme: 'default',
      favicon: '',
      language: 'zh_CN',
    });

    // 初始化高级设置表单数据
    advancedForm.setFieldsValue({
      enableCache: true,
      cacheExpirationTime: 30,
      enableLogs: true,
      logLevel: 'info',
      maxUploadFileSize: 50,
      maxSessionDuration: 120,
      enableMaintenance: false,
      enableUserRegistration: true,
    });

    // 初始化备份列表
    setBackupList([
      { 
        id: uuidv4(), 
        name: '系统备份-20230601', 
        createdAt: '2023-06-01 14:30:00', 
        size: '25MB' 
      },
      { 
        id: uuidv4(), 
        name: '系统备份-20230701', 
        createdAt: '2023-07-01 10:15:00', 
        size: '28MB' 
      },
    ]);
  }, [basicForm, advancedForm]);

  // Logo 文件上传相关处理
  const handleLogoChange = (info: { fileList: any[] }) => {
    setLogoFileList(info.fileList || []);
  };

  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传 JPG/PNG 格式的图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  // 保存基础设置
  const handleSaveBasicSettings = (values: IBasicSettings) => {
    console.log('保存基础设置:', values);
    message.success('基础设置保存成功');
  };

  // 保存高级设置
  const handleSaveAdvancedSettings = (values: IAdvancedSettings) => {
    console.log('保存高级设置:', values);
    message.success('高级设置保存成功');
  };

  // 选项管理相关处理
  const handleAddOption = async (type: string, option: IOptionItem) => {
    const newOption = {
      ...option,
      id: uuidv4()
    };
    
    switch (type) {
      case 'courseType':
        setCourseTypeOptions([...courseTypeOptions, newOption]);
        break;
      case 'expireType':
      case 'VALIDITY_PERIOD':
        setExpireTypeOptions([...expireTypeOptions, newOption]);
        break;
      case 'paymentMethod':
        setPaymentMethodOptions([...paymentMethodOptions, newOption]);
        break;
      case 'gift':
        setGiftOptions([...giftOptions, newOption]);
        break;
      case 'fee':
        setFeeOptions([...feeOptions, newOption]);
        break;
      default:
        break;
    }
    message.success(`添加${
      type === 'courseType' ? '课程类型' : 
      type === 'expireType' || type === 'VALIDITY_PERIOD' ? '有效期类型' :
      type === 'paymentMethod' ? '支付类型' : 
      type === 'gift' ? '赠品' : 
      type === 'fee' ? '手续费' :
      ''}选项成功`);
  };

  // 显示删除确认模态框
  const showDeleteConfirm = (type: string, id: string, name: string) => {
    setItemToDelete({ id, type, name });
    setDeleteModalVisible(true);
  };

  // 取消删除
  const cancelDelete = () => {
    setDeleteModalVisible(false);
    setItemToDelete(null);
  };

  // 确认删除选项
  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    const { type, id } = itemToDelete;
    handleDeleteOption(type, id);
    
    setDeleteModalVisible(false);
    setItemToDelete(null);
  };

  const handleDeleteOption = (type: string, id: string) => {
    switch (type) {
      case 'courseType':
        setCourseTypeOptions(courseTypeOptions.filter(item => item.id !== id));
        break;
      case 'expireType':
      case 'VALIDITY_PERIOD':
        setExpireTypeOptions(expireTypeOptions.filter(item => item.id !== id));
        break;
      case 'paymentMethod':
        setPaymentMethodOptions(paymentMethodOptions.filter(item => item.id !== id));
        break;
      case 'gift':
        setGiftOptions(giftOptions.filter(item => item.id !== id));
        break;
      case 'fee':
        setFeeOptions(feeOptions.filter(item => item.id !== id));
        break;
      default:
        break;
    }
    message.success(`删除${
      type === 'courseType' ? '课程类型' : 
      type === 'expireType' || type === 'VALIDITY_PERIOD' ? '有效期类型' :
      type === 'paymentMethod' ? '支付类型' : 
      type === 'gift' ? '赠品' : 
      type === 'fee' ? '手续费' :
      ''}选项成功`);
  };

  const handleUpdateOption = async (id: string, option: IOptionItem) => {
    // 通过 id 查找对应的选项类型
    let type: string;
    
    if (courseTypeOptions.some(item => item.id === id)) {
      type = 'courseType';
    } else if (expireTypeOptions.some(item => item.id === id)) {
      type = 'expireType';
    } else if (paymentMethodOptions.some(item => item.id === id)) {
      type = 'paymentMethod';
    } else if (giftOptions.some(item => item.id === id)) {
      type = 'gift';
    } else if (feeOptions.some(item => item.id === id)) {
      type = 'fee';
    } else {
      console.error('未能找到选项的类型，ID:', id);
      message.error('更新失败：未能确定选项类型');
      return;
    }
    
    switch (type) {
      case 'courseType':
        setCourseTypeOptions(courseTypeOptions.map(item => (item.id === id ? { ...item, ...option } : item)));
        break;
      case 'expireType':
      case 'VALIDITY_PERIOD':
        setExpireTypeOptions(expireTypeOptions.map(item => (item.id === id ? { ...item, ...option } : item)));
        break;
      case 'paymentMethod':
        setPaymentMethodOptions(paymentMethodOptions.map(item => (item.id === id ? { ...item, ...option } : item)));
        break;
      case 'gift':
        setGiftOptions(giftOptions.map(item => (item.id === id ? { ...item, ...option } : item)));
        break;
      case 'fee':
        setFeeOptions(feeOptions.map(item => (item.id === id ? { ...item, ...option } : item)));
        break;
      default:
        break;
    }
    message.success(`更新${
      type === 'courseType' ? '课程类型' : 
      type === 'expireType' || type === 'VALIDITY_PERIOD' ? '有效期类型' :
      type === 'paymentMethod' ? '支付类型' : 
      type === 'gift' ? '赠品' : 
      type === 'fee' ? '手续费' :
      ''}选项成功`);
  };

  // 备份相关处理
  const handleCreateBackup = () => {
    const newBackup = {
      id: uuidv4(),
      name: `系统备份-${new Date().toISOString().split('T')[0].replace(/-/g, '')}`,
      createdAt: new Date().toLocaleString(),
      size: `${Math.floor(Math.random() * 10) + 20}MB`
    };
    setBackupList([...backupList, newBackup]);
    message.success('系统备份创建成功');
  };

  const handleRestoreBackup = (id: string) => {
    console.log('恢复备份:', id);
    message.success('系统备份恢复成功');
  };

  const handleDeleteBackup = (id: string) => {
    setBackupList(backupList.filter(item => item.id !== id));
    message.success('系统备份删除成功');
  };

  const handleDownloadBackup = (id: string) => {
    console.log('下载备份:', id);
    message.success('系统备份下载已开始');
  };

  const handleUploadBackup = (file: File) => {
    const newBackup = {
      id: uuidv4(),
      name: file.name,
      createdAt: new Date().toLocaleString(),
      size: `${Math.round(file.size / 1024 / 1024)}MB`
    };
    setBackupList([...backupList, newBackup]);
    message.success('备份文件上传成功');
    return false;
  };

  // 是否显示指定选项卡
  const shouldRenderTab = (tab: TabKey) => {
    return true;
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key as TabKey);
  };

  // 定义 tabs 的 items 配置
  const tabItems = [
    {
      key: 'basic',
      label: (
        <span className="tab-item">
          <SettingOutlined />
          基础设置
        </span>
      ),
      children: (
        <div className="tab-content-card">
          <BasicSettingsTab 
            form={basicForm}
            handleLogoChange={handleLogoChange}
            logoFileList={logoFileList || []}
            beforeUpload={beforeUpload}
            onSave={handleSaveBasicSettings}
          />
        </div>
      )
    },
    {
      key: 'advanced',
      label: (
        <span className="tab-item">
          <ToolOutlined />
          高级设置
        </span>
      ),
      children: (
        <div className="tab-content-card">
          <AdvancedSettingsTab 
            form={advancedForm}
            onSave={handleSaveAdvancedSettings}
          />
        </div>
      )
    },
    {
      key: 'options',
      label: (
        <span className="tab-item">
          <AppstoreOutlined />
          选项管理
        </span>
      ),
      children: (
        <div className="tab-content-card">
          <OptionsTab 
            courseTypeOptions={courseTypeOptions}
            paymentMethodOptions={paymentMethodOptions}
            giftOptions={giftOptions}
            feeOptions={feeOptions}
            expireTypeOptions={expireTypeOptions}
            expenseTypeOptions={expenseTypeOptions}
            loading={{}}
            onAddOption={handleAddOption}
            onUpdateOption={handleUpdateOption}
            showDeleteConfirm={showDeleteConfirm}
            closeAddForm={{}}
            closeEditForm={{}}
          />
        </div>
      )
    },
    {
      key: 'backup',
      label: (
        <span className="tab-item">
          <SafetyCertificateOutlined />
          备份与恢复
        </span>
      ),
      children: (
        <div className="tab-content-card">
          <BackupTab 
            backupList={backupList}
            onCreateBackup={handleCreateBackup}
            onRestoreBackup={handleRestoreBackup}
            onDeleteBackup={handleDeleteBackup}
            onDownloadBackup={handleDownloadBackup}
            onUploadBackup={handleUploadBackup}
          />
        </div>
      )
    }
  ];

  return (
    <div className="settings-container">
      <Tabs 
        activeKey={activeTab} 
        onChange={handleTabChange}
        className="settings-tabs"
        tabPosition="top"
        type="card"
        items={tabItems}
      />
    </div>
  );
};

export default SystemSettings; 