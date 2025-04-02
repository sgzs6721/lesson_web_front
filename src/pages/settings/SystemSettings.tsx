import { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Switch,
  Select,
  Typography,
  Tabs,
  Row,
  Col,
  Divider,
  TimePicker,
  Upload,
  message,
  Space,
  Popconfirm
} from 'antd';
import {
  SaveOutlined,
  UploadOutlined,
  BankOutlined,
  SettingOutlined,
  NotificationOutlined,
  GlobalOutlined,
  LockOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  CloudSyncOutlined,
  ApiOutlined,
  DatabaseOutlined
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

const SystemSettings: React.FC = () => {
  const [logoFileList, setLogoFileList] = useState<UploadFile[]>([]);
  const [activeTab, setActiveTab] = useState('general');
  const [generalForm] = Form.useForm();
  const [notificationForm] = Form.useForm();
  const [apiForm] = Form.useForm();
  const [backupForm] = Form.useForm();

  useEffect(() => {
    // 模拟加载系统配置数据
    generalForm.setFieldsValue({
      institutionName: '好学健身培训机构',
      address: '北京市海淀区中关村大街1号',
      contactPhone: '010-88888888',
      contactEmail: 'contact@example.com',
      businessHoursStart: dayjs('09:00', 'HH:mm'),
      businessHoursEnd: dayjs('21:00', 'HH:mm'),
      businessDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      enableOnlinePayment: true,
      enableAutoReminder: true,
      currency: 'CNY',
      language: 'zh_CN',
      timezone: 'Asia/Shanghai',
    });
    
    notificationForm.setFieldsValue({
      enableSMS: true,
      enableEmail: true,
      enableWechat: true,
      reminderBeforeClass: 2,
      enableMarketingMessage: false,
      smsSignature: '【好学健身】',
    });
    
    apiForm.setFieldsValue({
      apiEndpoint: 'https://api.example.com/v1',
      apiKey: 'sk_test_123456789012345678901234',
      enableOpenApi: false,
      rateLimit: 1000,
    });
    
    backupForm.setFieldsValue({
      enableAutoBackup: true,
      backupFrequency: 'daily',
      backupTime: dayjs('02:00', 'HH:mm'),
      retentionDays: 30,
    });
  }, []);

  // 保存设置
  const saveGeneralSettings = (values: any) => {
    console.log('General settings saved:', values);
    message.success('基本设置已保存');
  };
  
  const saveNotificationSettings = (values: any) => {
    console.log('Notification settings saved:', values);
    message.success('通知设置已保存');
  };
  
  const saveApiSettings = (values: any) => {
    console.log('API settings saved:', values);
    message.success('API设置已保存');
  };
  
  const saveBackupSettings = (values: any) => {
    console.log('Backup settings saved:', values);
    message.success('备份设置已保存');
  };

  // 执行手动备份
  const handleManualBackup = () => {
    message.loading('正在备份数据...', 1.5)
      .then(() => message.success('数据备份成功'));
  };

  // 恢复出厂设置
  const handleFactoryReset = () => {
    message.loading('正在恢复出厂设置...', 1.5)
      .then(() => message.success('已恢复出厂设置'));
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

  return (
    <div className="system-settings">
      <Title level={4}>系统设置</Title>
      
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane
          tab={
            <span>
              <SettingOutlined />
              基本设置
            </span>
          }
          key="general"
        >
          <Card>
            <Form
              form={generalForm}
              layout="vertical"
              onFinish={saveGeneralSettings}
            >
              <Title level={5}>机构信息</Title>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="institutionName"
                    label="机构名称"
                    rules={[{ required: true, message: '请输入机构名称' }]}
                  >
                    <Input prefix={<BankOutlined />} placeholder="请输入机构名称" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="logo"
                    label="机构LOGO"
                  >
                    <Upload
                      listType="picture-card"
                      fileList={logoFileList}
                      onChange={handleLogoChange}
                      beforeUpload={beforeUpload}
                      maxCount={1}
                    >
                      {logoFileList.length >= 1 ? null : (
                        <div>
                          <UploadOutlined />
                          <div style={{ marginTop: 8 }}>上传</div>
                        </div>
                      )}
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={24}>
                <Col span={24}>
                  <Form.Item
                    name="address"
                    label="机构地址"
                    rules={[{ required: true, message: '请输入机构地址' }]}
                  >
                    <Input placeholder="请输入机构地址" />
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="contactPhone"
                    label="联系电话"
                    rules={[{ required: true, message: '请输入联系电话' }]}
                  >
                    <Input prefix={<PhoneOutlined />} placeholder="请输入联系电话" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="contactEmail"
                    label="联系邮箱"
                    rules={[
                      { required: true, message: '请输入联系邮箱' },
                      { type: 'email', message: '请输入有效的邮箱地址' }
                    ]}
                  >
                    <Input prefix={<MailOutlined />} placeholder="请输入联系邮箱" />
                  </Form.Item>
                </Col>
              </Row>
              
              <Divider />
              
              <Title level={5}>运营设置</Title>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="businessHoursStart"
                    label="营业开始时间"
                    rules={[{ required: true, message: '请选择营业开始时间' }]}
                  >
                    <TimePicker format="HH:mm" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="businessHoursEnd"
                    label="营业结束时间"
                    rules={[{ required: true, message: '请选择营业结束时间' }]}
                  >
                    <TimePicker format="HH:mm" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item
                name="businessDays"
                label="营业日"
                rules={[{ required: true, message: '请选择营业日' }]}
              >
                <Select mode="multiple" placeholder="请选择营业日">
                  <Option value="monday">周一</Option>
                  <Option value="tuesday">周二</Option>
                  <Option value="wednesday">周三</Option>
                  <Option value="thursday">周四</Option>
                  <Option value="friday">周五</Option>
                  <Option value="saturday">周六</Option>
                  <Option value="sunday">周日</Option>
                </Select>
              </Form.Item>
              
              <Row gutter={24}>
                <Col span={8}>
                  <Form.Item
                    name="currency"
                    label="货币单位"
                    rules={[{ required: true, message: '请选择货币单位' }]}
                  >
                    <Select placeholder="请选择货币单位">
                      <Option value="CNY">人民币 (CNY)</Option>
                      <Option value="USD">美元 (USD)</Option>
                      <Option value="EUR">欧元 (EUR)</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="language"
                    label="系统语言"
                    rules={[{ required: true, message: '请选择系统语言' }]}
                  >
                    <Select placeholder="请选择系统语言">
                      <Option value="zh_CN">简体中文</Option>
                      <Option value="en_US">English (US)</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="timezone"
                    label="时区"
                    rules={[{ required: true, message: '请选择时区' }]}
                  >
                    <Select placeholder="请选择时区">
                      <Option value="Asia/Shanghai">北京时间 (GMT+8)</Option>
                      <Option value="America/New_York">纽约时间 (GMT-5)</Option>
                      <Option value="Europe/London">伦敦时间 (GMT+0)</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="enableOnlinePayment"
                    label="启用在线支付"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="enableAutoReminder"
                    label="启用自动提醒"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                  保存设置
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>
        
        <TabPane
          tab={
            <span>
              <NotificationOutlined />
              通知设置
            </span>
          }
          key="notification"
        >
          <Card>
            <Form
              form={notificationForm}
              layout="vertical"
              onFinish={saveNotificationSettings}
            >
              <Row gutter={24}>
                <Col span={8}>
                  <Form.Item
                    name="enableSMS"
                    label="启用短信通知"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="enableEmail"
                    label="启用邮件通知"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="enableWechat"
                    label="启用微信通知"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="reminderBeforeClass"
                    label="上课提前提醒时间(小时)"
                    rules={[{ required: true, message: '请输入提醒时间' }]}
                  >
                    <Select>
                      <Option value={1}>1小时</Option>
                      <Option value={2}>2小时</Option>
                      <Option value={3}>3小时</Option>
                      <Option value={6}>6小时</Option>
                      <Option value={12}>12小时</Option>
                      <Option value={24}>24小时</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="smsSignature"
                    label="短信签名"
                  >
                    <Input placeholder="请输入短信签名，如：【好学健身】" />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item
                name="enableMarketingMessage"
                label="启用营销信息推送"
                valuePropName="checked"
                extra="营销内容将会通过短信、邮件和微信推送给学员"
              >
                <Switch />
              </Form.Item>
              
              <Divider />
              
              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                  保存设置
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>
        
        <TabPane
          tab={
            <span>
              <ApiOutlined />
              API接口
            </span>
          }
          key="api"
        >
          <Card>
            <Form
              form={apiForm}
              layout="vertical"
              onFinish={saveApiSettings}
            >
              <Form.Item
                name="apiEndpoint"
                label="API接口地址"
                rules={[{ required: true, message: '请输入API接口地址' }]}
              >
                <Input prefix={<GlobalOutlined />} placeholder="请输入API接口地址" />
              </Form.Item>
              
              <Form.Item
                name="apiKey"
                label="API密钥"
                rules={[{ required: true, message: '请输入API密钥' }]}
                extra="请妥善保管您的API密钥，不要泄露给他人"
              >
                <Input.Password prefix={<LockOutlined />} placeholder="请输入API密钥" />
              </Form.Item>
              
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="enableOpenApi"
                    label="启用开放API"
                    valuePropName="checked"
                    extra="开放API允许第三方应用接入您的系统"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="rateLimit"
                    label="API速率限制(次/天)"
                    rules={[{ required: true, message: '请输入API速率限制' }]}
                  >
                    <Input type="number" placeholder="请输入API速率限制" />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                  保存设置
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>
        
        <TabPane
          tab={
            <span>
              <DatabaseOutlined />
              数据备份
            </span>
          }
          key="backup"
        >
          <Card>
            <Form
              form={backupForm}
              layout="vertical"
              onFinish={saveBackupSettings}
            >
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="enableAutoBackup"
                    label="启用自动备份"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="backupFrequency"
                    label="备份频率"
                    rules={[{ required: true, message: '请选择备份频率' }]}
                  >
                    <Select placeholder="请选择备份频率">
                      <Option value="daily">每天</Option>
                      <Option value="weekly">每周</Option>
                      <Option value="monthly">每月</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="backupTime"
                    label="备份时间"
                    rules={[{ required: true, message: '请选择备份时间' }]}
                  >
                    <TimePicker format="HH:mm" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="retentionDays"
                    label="备份保留天数"
                    rules={[{ required: true, message: '请输入备份保留天数' }]}
                  >
                    <Input type="number" placeholder="请输入备份保留天数" />
                  </Form.Item>
                </Col>
              </Row>
              
              <Divider />
              
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                    保存设置
                  </Button>
                  <Button 
                    type="default" 
                    icon={<CloudSyncOutlined />}
                    onClick={handleManualBackup}
                  >
                    立即备份
                  </Button>
                  <Popconfirm
                    title="确定要恢复出厂设置吗？"
                    description="恢复出厂设置将清除所有自定义配置，该操作无法撤销。"
                    onConfirm={handleFactoryReset}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button danger>恢复出厂设置</Button>
                  </Popconfirm>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default SystemSettings; 