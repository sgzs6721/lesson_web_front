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
  const [expenseTypeOptions, setExpenseTypeOptions] = useState<IOptionItem[]>([]);
  const [incomeTypeOptions, setIncomeTypeOptions] = useState<IOptionItem[]>([]);
  const [studentSourceOptions, setStudentSourceOptions] = useState<IOptionItem[]>([]);
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

  // 加载所有选项数据 - 新的实现：一次性获取所有常量
  const loadAllOptions = async () => {
    if (optionsLoaded) return; // 如果已经加载过，不再重复加载
    
    // 设置所有类型为加载状态
    setLoading({
      'COURSE_TYPE': true,
      'PAYMENT_TYPE': true,
      'GIFT_ITEM': true,
      'HANDLING_FEE_TYPE': true,
      'VALIDITY_PERIOD': true,
      'EXPEND': true,
      'INCOME': true,
      'STUDENT_SOURCE': true,
    });
    
    try {
      // 一次性获取所有常量
      const allConstants = await API.constants.getListByTypes([
        'COURSE_TYPE',
        'PAYMENT_TYPE', 
        'GIFT_ITEM',
        'HANDLING_FEE_TYPE',
        'VALIDITY_PERIOD',
        'EXPEND',
        'INCOME',
        'STUDENT_SOURCE'
      ]);
      
      // 按type分组数据
      const groupedConstants: Record<string, IOptionItem[]> = {
        'COURSE_TYPE': [],
        'PAYMENT_TYPE': [],
        'GIFT_ITEM': [],
        'HANDLING_FEE_TYPE': [],
        'VALIDITY_PERIOD': [],
        'EXPEND': [],
        'INCOME': [],
        'STUDENT_SOURCE': [],
      };
      
      // 将数据分组到对应的类型中
      allConstants.forEach((constant: any) => {
        if (groupedConstants[constant.type]) {
          groupedConstants[constant.type].push(mapConstantToOptionItem(constant));
        }
      });
      
      // 更新各种选项状态
      setCourseTypeOptions(groupedConstants['COURSE_TYPE']);
      setPaymentMethodOptions(groupedConstants['PAYMENT_TYPE']);
      setGiftOptions(groupedConstants['GIFT_ITEM']);
      setFeeOptions(groupedConstants['HANDLING_FEE_TYPE']);
      setExpireTypeOptions(groupedConstants['VALIDITY_PERIOD']);
      setExpenseTypeOptions(groupedConstants['EXPEND']);
      setIncomeTypeOptions(groupedConstants['INCOME']);
      setStudentSourceOptions(groupedConstants['STUDENT_SOURCE']);
      
      console.log('所有选项数据加载成功:', groupedConstants);
      setOptionsLoaded(true);
    } catch (error) {
      console.error('加载选项数据失败:', error);
      message.error(`加载选项数据失败: ${error instanceof Error ? error.message : '请稍后重试'}`);
    } finally {
      // 清除所有加载状态
      setLoading({
        'COURSE_TYPE': false,
        'PAYMENT_TYPE': false,
        'GIFT_ITEM': false,
        'HANDLING_FEE_TYPE': false,
        'VALIDITY_PERIOD': false,
        'EXPEND': false,
        'INCOME': false,
        'STUDENT_SOURCE': false,
      });
    }
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
    setExpenseTypeOptions([]);
    setIncomeTypeOptions([]);
    setStudentSourceOptions([]);

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
  const handleAddOption = async (type: string, option: IOptionItem): Promise<void> => {
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
          case 'EXPEND':
            setExpenseTypeOptions(prev => [...prev, newOption]);
            break;
          case 'INCOME':
            setIncomeTypeOptions(prev => [...prev, newOption]);
            break;
          case 'STUDENT_SOURCE':
            setStudentSourceOptions(prev => [...prev, newOption]);
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
      case 'EXPEND':
        optionsList = expenseTypeOptions;
        break;
      case 'INCOME':
        optionsList = incomeTypeOptions;
        break;
      case 'STUDENT_SOURCE':
        optionsList = studentSourceOptions;
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
          case 'EXPEND':
            setExpenseTypeOptions(prev => prev.filter(item => item.id !== id));
            break;
          case 'INCOME':
            setIncomeTypeOptions(prev => prev.filter(item => item.id !== id));
            break;
          case 'STUDENT_SOURCE':
            setStudentSourceOptions(prev => prev.filter(item => item.id !== id));
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

  const handleUpdateOption = async (id: string, option: IOptionItem): Promise<void> => {
    // 通过 id 在各个选项中查找来确定类型
    let apiType: string | undefined;

    if (courseTypeOptions.some(item => item.id === id)) {
      apiType = 'COURSE_TYPE';
    } else if (expireTypeOptions.some(item => item.id === id)) {
      apiType = 'VALIDITY_PERIOD';
    } else if (paymentMethodOptions.some(item => item.id === id)) {
      apiType = 'PAYMENT_TYPE';
    } else if (giftOptions.some(item => item.id === id)) {
      apiType = 'GIFT_ITEM';
    } else if (feeOptions.some(item => item.id === id)) {
      apiType = 'HANDLING_FEE_TYPE';
    } else if (expenseTypeOptions.some(item => item.id === id)) {
      apiType = 'EXPEND';
    } else if (incomeTypeOptions.some(item => item.id === id)) {
      apiType = 'INCOME';
    } else if (studentSourceOptions.some(item => item.id === id)) {
      apiType = 'STUDENT_SOURCE';
    }

    if (!apiType) {
      console.error('未能找到选项的类型，ID:', id);
      message.error('更新失败：未能确定选项类型');
      return;
    }
      
    setLoading(prev => ({ ...prev, [apiType!]: true }));
    setCloseEditForm(prev => ({ ...prev, [apiType!]: false }));

    try {
      const constantToUpdate = { ...mapOptionItemToConstant(option, apiType), id: Number(id) };
      const result = await API.constants.update(constantToUpdate);

      if (result) {
        message.success(`更新选项成功`);
        
        let updateState;
        switch (apiType) {
          case 'COURSE_TYPE':
            updateState = setCourseTypeOptions;
            break;
          case 'PAYMENT_TYPE':
            updateState = setPaymentMethodOptions;
            break;
          case 'GIFT_ITEM':
            updateState = setGiftOptions;
            break;
          case 'HANDLING_FEE_TYPE':
            updateState = setFeeOptions;
            break;
          case 'VALIDITY_PERIOD':
            updateState = setExpireTypeOptions;
            break;
          case 'EXPEND':
            updateState = setExpenseTypeOptions;
            break;
          case 'INCOME':
            updateState = setIncomeTypeOptions;
            break;
          case 'STUDENT_SOURCE':
            updateState = setStudentSourceOptions;
            break;
          default:
            return;
        }

        updateState(prev => prev.map(item => item.id === id ? { ...item, ...option, id } : item));
        
        setCloseEditForm(prev => ({ ...prev, [apiType!]: true }));
      }
    } catch (error: any) {
      console.error(`更新选项失败:`, error);
      message.error(error.message || `更新选项失败`);
    } finally {
      setLoading(prev => ({ ...prev, [apiType!]: false }));
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
      case 'expenseType': return 'EXPEND';
      case 'incomeType': return 'INCOME';
      case 'studentSource': return 'STUDENT_SOURCE';
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
      case 'expenseType': return '费用类型';
      case 'incomeType': return '收入类型';
      case 'studentSource': return '学生来源';
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



  return (
    <div className="settings-management">
      <Card className="settings-management-card">
        <div className="settings-header">
          <Title level={4} className="settings-title">系统设置</Title>
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            className="header-tabs"
            items={[
              {
                key: 'basic',
                label: (
                  <span>
                    <SettingOutlined />
                    基础设置
                  </span>
                ),
              },
              {
                key: 'advanced',
                label: (
                  <span>
                    <ToolOutlined />
                    高级设置
                  </span>
                ),
              },
              {
                key: 'options',
                label: (
                  <span>
                    <AppstoreOutlined />
                    选项管理
                  </span>
                ),
              },
              {
                key: 'backup',
                label: (
                  <span>
                    <SafetyCertificateOutlined />
                    备份恢复
                  </span>
                ),
              },
            ]}
          />
        </div>

        <div className="settings-tabs-content">
          {activeTab === 'basic' && (
            <BasicSettingsTab 
              form={basicForm} 
              onSave={handleSaveBasicSettings}
              logoFileList={logoFileList}
              handleLogoChange={handleLogoChange}
              beforeUpload={beforeUpload}
              themes={SYSTEM_THEMES}
              languages={SYSTEM_LANGUAGES}
            />
          )}
          {activeTab === 'advanced' && (
            <AdvancedSettingsTab 
              form={advancedForm} 
              onSave={handleSaveAdvancedSettings}
            />
          )}
          {activeTab === 'options' && (
            <Spin spinning={
              loading['COURSE_TYPE'] || 
              loading['PAYMENT_TYPE'] || 
              loading['GIFT_ITEM'] || 
              loading['HANDLING_FEE_TYPE'] || 
              loading['VALIDITY_PERIOD'] ||
              loading['EXPEND'] ||
              loading['INCOME'] ||
              loading['STUDENT_SOURCE']
            } tip="正在加载选项数据...">
              <OptionsTab
                courseTypeOptions={courseTypeOptions}
                paymentMethodOptions={paymentMethodOptions}
                giftOptions={giftOptions}
                feeOptions={feeOptions}
                expireTypeOptions={expireTypeOptions}
                expenseTypeOptions={expenseTypeOptions}
                incomeTypeOptions={incomeTypeOptions}
                studentSourceOptions={studentSourceOptions}
                loading={loading}
                onAddOption={handleAddOption}
                onUpdateOption={handleUpdateOption}
                showDeleteConfirm={showDeleteConfirm}
                closeAddForm={closeAddForm}
                closeEditForm={closeEditForm}
              />
            </Spin>
          )}
          {activeTab === 'backup' && (
            <BackupTab
              backupList={backupList}
              onCreateBackup={handleCreateBackup}
              onRestoreBackup={handleRestoreBackup}
              onDeleteBackup={handleDeleteBackup}
              onDownloadBackup={handleDownloadBackup}
              onUploadBackup={handleUploadBackup}
            />
          )}
        </div>
        
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
