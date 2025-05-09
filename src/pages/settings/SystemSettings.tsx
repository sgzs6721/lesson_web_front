import React, { useState, useEffect } from 'react';
import { Tabs, Form, message, Card, Typography, Divider, Spin } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { 
  IBasicSettings, 
  IAdvancedSettings, 
  IOptionItem,
  IBackupItem,
  TabKey 
} from './types';
import { SYSTEM_THEMES, SYSTEM_LANGUAGES } from './constants';
import BasicSettingsTab from './components/BasicSettingsTab';
import AdvancedSettingsTab from './components/AdvancedSettingsTab';
import OptionsTab from './components/OptionsTab';
import BackupTab from './components/BackupTab';
import ConstantDeleteModal from './components/ConstantDeleteModal';
import {
  SettingOutlined,
  ToolOutlined,
  AppstoreOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import './SystemSettings.css';
import { API } from '@/api';
import { Constant } from '@/api/constants/types';

const { TabPane } = Tabs;
const { Title } = Typography;

// 将API常量类型转换为选项项类型
const mapConstantToOptionItem = (constant: Constant): IOptionItem => ({
  id: String(constant.id),
  name: constant.constantValue,
  value: constant.constantKey,
  description: constant.description,
  enabled: constant.status !== 0,
  status: constant.status
});

// 将选项项类型转换为API常量类型
const mapOptionItemToConstant = (option: IOptionItem, type: string): Omit<Constant, 'id'> => ({
  constantKey: option.value,
  constantValue: option.name,
  description: option.description || '',
  type,
  status: option.status !== undefined ? option.status : (option.enabled === false ? 0 : 1)
});

const SystemSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('basic');
  const [basicForm] = Form.useForm<IBasicSettings>();
  const [advancedForm] = Form.useForm<IAdvancedSettings>();
  
  // 各选项状态 - 都初始化为空数组
  const [courseTypeOptions, setCourseTypeOptions] = useState<IOptionItem[]>([]);
  const [paymentMethodOptions, setPaymentMethodOptions] = useState<IOptionItem[]>([]);
  const [giftOptions, setGiftOptions] = useState<IOptionItem[]>([]);
  const [feeOptions, setFeeOptions] = useState<IOptionItem[]>([]);
  const [expireTypeOptions, setExpireTypeOptions] = useState<IOptionItem[]>([]);
  const [backupList, setBackupList] = useState<IBackupItem[]>([]);
  const [logoFileList, setLogoFileList] = useState<any[]>([]);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [closeAddForm, setCloseAddForm] = useState<Record<string, boolean>>({});
  const [closeEditForm, setCloseEditForm] = useState<Record<string, boolean>>({});
  // 记录选项管理是否已经加载过
  const [optionsLoaded, setOptionsLoaded] = useState(false);
  
  // 删除模态框相关状态
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: string, type: string, name: string} | null>(null);

  // 加载选项数据 - 修改为强制返回空数组
  const loadOptions = async (type: string) => {
    setLoading(prev => ({ ...prev, [type]: true }));
    try {
      // 从API获取数据
      const data = await API.constants.getList(type);
      const options: IOptionItem[] = (data || []).map(mapConstantToOptionItem);
      
      switch (type) {
        case 'COURSE_TYPE':
          setCourseTypeOptions(options);
          break;
        case 'PAYMENT_TYPE':
          setPaymentMethodOptions(options);
          break;
        case 'GIFT_ITEM':
          setGiftOptions(options);
          break;
        case 'HANDLING_FEE_TYPE':
          setFeeOptions(options);
          break;
        case 'VALIDITY_PERIOD':
          setExpireTypeOptions(options);
          break;
      }
    } catch (error) {
      console.error(`加载${type}选项失败:`, error);
      message.error(`加载${type}选项失败: ${error instanceof Error ? error.message : '请稍后重试'}`);
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  // 加载所有选项数据
  const loadAllOptions = () => {
    if (optionsLoaded) return; // 如果已经加载过，不再重复加载
    
    loadOptions('COURSE_TYPE');
    loadOptions('PAYMENT_TYPE');
    loadOptions('GIFT_ITEM');
    loadOptions('HANDLING_FEE_TYPE');
    loadOptions('VALIDITY_PERIOD');
    setOptionsLoaded(true);
  };

  // 初始化数据
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

    // 确保所有选项为空数组
    setCourseTypeOptions([]);
    setPaymentMethodOptions([]);
    setGiftOptions([]);
    setFeeOptions([]);
    setExpireTypeOptions([]);

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
    
    // 不再初始加载选项管理的数据
    // 而是等用户点击选项管理选项卡时加载
  }, [basicForm, advancedForm]);

  // 处理选项卡变更
  const handleTabChange = (activeKey: string) => {
    setActiveTab(activeKey as TabKey);
    
    // 如果切换到选项管理标签，加载选项数据
    if (activeKey === 'options' && !optionsLoaded) {
      loadAllOptions();
    }
  };

  // Logo 文件上传相关处理
  const handleLogoChange = (info: { fileList: any[] }) => {
    setLogoFileList(info.fileList);
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
    const apiType = getApiType(type);
    setLoading(prev => ({ ...prev, [apiType]: true }));
    setCloseAddForm(prev => ({ ...prev, [apiType]: false }));
    
    try {
      const constant = mapOptionItemToConstant(option, apiType);
      const result = await API.constants.save(constant);
      
      if (result) {
        message.success(`添加${getOptionTypeName(type)}选项成功`);
        // 直接在前端更新状态，而不是重新请求API
        const newOption = { ...option, id: String(result.id || Date.now()) };
        
        switch (apiType) {
          case 'COURSE_TYPE':
            setCourseTypeOptions(prev => [...prev, newOption]);
            break;
          case 'PAYMENT_TYPE':
            setPaymentMethodOptions(prev => [...prev, newOption]);
            break;
          case 'GIFT_ITEM':
            setGiftOptions(prev => [...prev, newOption]);
            break;
          case 'HANDLING_FEE_TYPE':
            setFeeOptions(prev => [...prev, newOption]);
            break;
          case 'VALIDITY_PERIOD':
            setExpireTypeOptions(prev => [...prev, newOption]);
            break;
        }
        
        // API调用成功，设置closeForm为true
        setCloseAddForm(prev => ({ ...prev, [apiType]: true }));
      }
      
      // 设置loading为false
      setLoading(prev => ({ ...prev, [apiType]: false }));
    } catch (error: any) {
      console.error(`添加${type}选项失败:`, error);
      message.error(error.message || `添加${getOptionTypeName(type)}选项失败`);
      // 发生错误时也需要设置loading为false，但不关闭表单
      setLoading(prev => ({ ...prev, [apiType]: false }));
    }
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
    await handleDeleteOption(type, id);
    
    setDeleteModalVisible(false);
    setItemToDelete(null);
  };

  // 修改已有的删除选项函数
  const handleDeleteOption = async (type: string, id: string) => {
    const apiType = getApiType(type);
    
    // 检查选项是否已启用
    let optionsList: IOptionItem[] = [];
    
    switch (apiType) {
      case 'COURSE_TYPE':
        optionsList = courseTypeOptions;
        break;
      case 'PAYMENT_TYPE':
        optionsList = paymentMethodOptions;
        break;
      case 'GIFT_ITEM':
        optionsList = giftOptions;
        break;
      case 'HANDLING_FEE_TYPE':
        optionsList = feeOptions;
        break;
      case 'VALIDITY_PERIOD':
        optionsList = expireTypeOptions;
        break;
    }
    
    const targetOption = optionsList.find(item => item.id === id);
    if (targetOption && targetOption.enabled) {
      message.error(`已启用的${getOptionTypeName(type)}选项不能删除`);
      return;
    }
    
    setLoading(prev => ({ ...prev, [apiType]: true }));
    
    try {
      const success = await API.constants.delete(Number(id));
      
      if (success) {
        message.success(`删除${getOptionTypeName(type)}选项成功`);
        // 直接在前端更新状态，而不是重新请求API
        switch (apiType) {
          case 'COURSE_TYPE':
            setCourseTypeOptions(prev => prev.filter(item => item.id !== id));
            break;
          case 'PAYMENT_TYPE':
            setPaymentMethodOptions(prev => prev.filter(item => item.id !== id));
            break;
          case 'GIFT_ITEM':
            setGiftOptions(prev => prev.filter(item => item.id !== id));
            break;
          case 'HANDLING_FEE_TYPE':
            setFeeOptions(prev => prev.filter(item => item.id !== id));
            break;
          case 'VALIDITY_PERIOD':
            setExpireTypeOptions(prev => prev.filter(item => item.id !== id));
            break;
        }
      }
      
      setLoading(prev => ({ ...prev, [apiType]: false }));
    } catch (error: any) {
      console.error(`删除${type}选项失败:`, error);
      message.error(error.message || `删除${getOptionTypeName(type)}选项失败`);
      setLoading(prev => ({ ...prev, [apiType]: false }));
    }
  };

  const handleUpdateOption = async (id: string, option: IOptionItem) => {
    // 通过 id 在各个选项中查找来确定类型
    let apiType: string;
    let type: string;
    
    // 在各个选项中查找匹配的 id
    if (courseTypeOptions.some(item => item.id === id)) {
      apiType = 'COURSE_TYPE';
      type = 'courseType';
    } else if (expireTypeOptions.some(item => item.id === id)) {
      apiType = 'VALIDITY_PERIOD';
      type = 'expireType';
    } else if (paymentMethodOptions.some(item => item.id === id)) {
      apiType = 'PAYMENT_TYPE';
      type = 'paymentMethod';
    } else if (giftOptions.some(item => item.id === id)) {
      apiType = 'GIFT_ITEM';
      type = 'gift';
    } else if (feeOptions.some(item => item.id === id)) {
      apiType = 'HANDLING_FEE_TYPE';
      type = 'fee';
    } else {
      console.error('未能找到选项的类型，ID:', id);
      message.error('更新失败：未能确定选项类型');
      return;
    }
    
    setLoading(prev => ({ ...prev, [apiType]: true }));
    setCloseEditForm(prev => ({ ...prev, [apiType]: false }));
    
    try {
      const constant = {
        ...mapOptionItemToConstant(option, apiType),
        id: Number(id)
      };
      
      const success = await API.constants.update(constant);
      
      if (success) {
        message.success(`更新${getOptionTypeName(type)}选项成功`);
        
        // 找到并更新选项
        const updateState = (prevOptions: IOptionItem[]) => {
          return prevOptions.map(item => 
            item.id === id ? { ...option, id } : item
          );
        };
        
        // 根据类型更新相应的状态
        switch (apiType) {
          case 'COURSE_TYPE':
            setCourseTypeOptions(updateState);
            break;
          case 'PAYMENT_TYPE':
            setPaymentMethodOptions(updateState);
            break;
          case 'GIFT_ITEM':
            setGiftOptions(updateState);
            break;
          case 'HANDLING_FEE_TYPE':
            setFeeOptions(updateState);
            break;
          case 'VALIDITY_PERIOD':
            setExpireTypeOptions(updateState);
            break;
        }
        
        // API调用成功，设置closeForm为true
        setCloseEditForm(prev => ({ ...prev, [apiType]: true }));
      }
      
      // 设置loading为false
      setLoading(prev => ({ ...prev, [apiType]: false }));
    } catch (error: any) {
      console.error(`更新${type}选项失败:`, error);
      message.error(error.message || `更新${getOptionTypeName(type)}选项失败`);
      // 发生错误时也需要设置loading为false，但不关闭表单
      setLoading(prev => ({ ...prev, [apiType]: false }));
    }
  };

  // 获取API类型常量
  const getApiType = (type: string): string => {
    switch (type) {
      case 'courseType': return 'COURSE_TYPE';
      case 'paymentMethod': return 'PAYMENT_TYPE';
      case 'gift': return 'GIFT_ITEM';
      case 'fee': return 'HANDLING_FEE_TYPE';
      case 'expireType': return 'VALIDITY_PERIOD';
      default: return type.toUpperCase();
    }
  };

  // 获取选项类型中文名称
  const getOptionTypeName = (type: string): string => {
    switch (type) {
      case 'courseType': return '课程类型';
      case 'paymentMethod': return '支付类型';
      case 'gift': return '赠品';
      case 'fee': return '手续费';
      case 'expireType': 
      case 'VALIDITY_PERIOD': return '有效期时长';
      default: return '选项';
    }
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
    message.success('系统备份下载开始');
  };

  const handleUploadBackup = (file: File) => {
    console.log('上传备份文件:', file.name);
    const newBackup = {
      id: uuidv4(),
      name: file.name,
      createdAt: new Date().toLocaleString(),
      size: `${(file.size / (1024 * 1024)).toFixed(2)}MB`
    };
    setBackupList([...backupList, newBackup]);
  };

  // 是否显示指定选项卡
  const shouldRenderTab = (tab: TabKey) => {
    return tab === activeTab;
  };

  // 定义各个选项卡的内容
  const items = [
    {
      key: 'basic',
      label: (
        <span className="tab-label">
          <SettingOutlined />
          基础设置
        </span>
      ),
      children: shouldRenderTab('basic') ? (
        <BasicSettingsTab 
          form={basicForm} 
          onSave={handleSaveBasicSettings}
          logoFileList={logoFileList}
          handleLogoChange={handleLogoChange}
          beforeUpload={beforeUpload}
          themes={SYSTEM_THEMES}
          languages={SYSTEM_LANGUAGES}
        />
      ) : null
    },
    {
      key: 'advanced',
      label: (
        <span className="tab-label">
          <ToolOutlined />
          高级设置
        </span>
      ),
      children: shouldRenderTab('advanced') ? (
        <AdvancedSettingsTab 
          form={advancedForm} 
          onSave={handleSaveAdvancedSettings}
        />
      ) : null
    },
    {
      key: 'options',
      label: (
        <span className="tab-label">
          <AppstoreOutlined />
          选项管理
        </span>
      ),
      children: shouldRenderTab('options') ? (
        <Spin spinning={
          loading['COURSE_TYPE'] || 
          loading['PAYMENT_TYPE'] || 
          loading['GIFT_ITEM'] || 
          loading['HANDLING_FEE_TYPE'] || 
          loading['VALIDITY_PERIOD']
        } tip="正在加载选项数据...">
          <OptionsTab
            courseTypeOptions={courseTypeOptions}
            paymentMethodOptions={paymentMethodOptions}
            giftOptions={giftOptions}
            feeOptions={feeOptions}
            expireTypeOptions={expireTypeOptions}
            onAddOption={handleAddOption}
            onDeleteOption={(type, id) => handleDeleteOption(type, id)}
            onUpdateOption={handleUpdateOption}
            showDeleteConfirm={showDeleteConfirm}
            loading={loading}
            closeAddForm={closeAddForm}
            closeEditForm={closeEditForm}
          />
        </Spin>
      ) : null
    },
    {
      key: 'backup',
      label: (
        <span className="tab-label">
          <SafetyCertificateOutlined />
          备份恢复
        </span>
      ),
      children: shouldRenderTab('backup') ? (
        <BackupTab
          backupList={backupList}
          onCreateBackup={handleCreateBackup}
          onRestoreBackup={handleRestoreBackup}
          onDeleteBackup={handleDeleteBackup}
          onDownloadBackup={handleDownloadBackup}
          onUploadBackup={handleUploadBackup}
        />
      ) : null
    }
  ];

  return (
    <div className="system-settings">
      <Card className="system-settings-card">
        <div className="settings-header">
          <Title level={4} className="settings-title">系统设置</Title>
        </div>
        
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={items}
          destroyInactiveTabPane
          className="settings-tabs"
          type="card"
        />
        
        <ConstantDeleteModal
          visible={deleteModalVisible}
          title={itemToDelete?.name || ''}
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
        />
      </Card>
    </div>
  );
};

export default SystemSettings;
