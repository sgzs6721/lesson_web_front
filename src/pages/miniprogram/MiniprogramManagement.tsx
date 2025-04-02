import { useState } from 'react';
import {
  Card,
  Tabs,
  Form,
  Input,
  Button,
  Upload,
  message,
  Space,
  Typography,
  Row,
  Col,
  Table,
  Tag,
  Divider,
  Switch,
  Modal,
  Select,
  Radio
} from 'antd';
import {
  UploadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  QrcodeOutlined,
  AppstoreOutlined,
  MobileOutlined,
  SettingOutlined,
  NotificationOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadProps } from 'antd';
import type { TabsProps } from 'antd';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

// Types
interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
  sortOrder: number;
}

interface Notification {
  id: string;
  title: string;
  content: string;
  type: 'announcement' | 'promotion' | 'update';
  publishDate: string;
  isPublished: boolean;
}

const MiniprogramManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [bannerForm] = Form.useForm();
  const [notificationForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState('1');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewQrCodeVisible, setPreviewQrCodeVisible] = useState(false);
  const [bannerModalVisible, setBannerModalVisible] = useState(false);
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [editingNotificationId, setEditingNotificationId] = useState<string | null>(null);
  
  // Mock data
  const [banners, setBanners] = useState<Banner[]>([
    { id: '1', title: '新课程上线', imageUrl: 'https://via.placeholder.com/750x350', linkUrl: '/courses/new', isActive: true, sortOrder: 1 },
    { id: '2', title: '夏季优惠', imageUrl: 'https://via.placeholder.com/750x350', linkUrl: '/promotions/summer', isActive: true, sortOrder: 2 },
    { id: '3', title: '教练团队', imageUrl: 'https://via.placeholder.com/750x350', linkUrl: '/coaches', isActive: false, sortOrder: 3 },
  ]);
  
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', title: '端午节放假通知', content: '各位家长，学校将于6月22日至6月24日放假三天，6月25日正常上课。', type: 'announcement', publishDate: '2023-06-10', isPublished: true },
    { id: '2', title: '泳池维护通知', content: '由于泳池设备维护，A区泳池将于下周一至周三暂停使用，请相关课程的学员到B区泳池上课。', type: 'announcement', publishDate: '2023-06-08', isPublished: true },
    { id: '3', title: '暑期班开始报名', content: '2023年暑期游泳强化班现已开始报名，欢迎新老学员前来咨询报名。', type: 'promotion', publishDate: '2023-06-01', isPublished: true },
    { id: '4', title: '小程序更新公告', content: '我们的小程序已升级到2.0版本，新增了在线请假、课程评价等功能，欢迎体验。', type: 'update', publishDate: '2023-05-25', isPublished: true },
    { id: '5', title: '未发布测试公告', content: '这是一条测试公告，只有管理员可以看到。', type: 'announcement', publishDate: '2023-06-15', isPublished: false },
  ]);

  // Handle banner actions
  const handleAddBanner = () => {
    bannerForm.resetFields();
    setEditingBannerId(null);
    setBannerModalVisible(true);
  };

  const handleEditBanner = (record: Banner) => {
    bannerForm.setFieldsValue(record);
    setEditingBannerId(record.id);
    setBannerModalVisible(true);
  };

  const handleDeleteBanner = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个轮播图吗？',
      onOk() {
        setBanners(banners.filter(banner => banner.id !== id));
        message.success('轮播图已删除');
      }
    });
  };

  const handleSaveBanner = async () => {
    try {
      const values = await bannerForm.validateFields();
      if (editingBannerId) {
        setBanners(banners.map(banner => 
          banner.id === editingBannerId ? { ...banner, ...values } : banner
        ));
        message.success('轮播图已更新');
      } else {
        const newBanner: Banner = {
          id: `${banners.length + 1}`,
          ...values,
          sortOrder: banners.length + 1
        };
        setBanners([...banners, newBanner]);
        message.success('轮播图已添加');
      }
      setBannerModalVisible(false);
    } catch (error) {
      console.error('提交表单验证失败:', error);
    }
  };

  // Handle notification actions
  const handleAddNotification = () => {
    notificationForm.resetFields();
    setEditingNotificationId(null);
    setNotificationModalVisible(true);
  };

  const handleEditNotification = (record: Notification) => {
    notificationForm.setFieldsValue(record);
    setEditingNotificationId(record.id);
    setNotificationModalVisible(true);
  };

  const handleDeleteNotification = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条通知吗？',
      onOk() {
        setNotifications(notifications.filter(notification => notification.id !== id));
        message.success('通知已删除');
      }
    });
  };

  const handleSaveNotification = async () => {
    try {
      const values = await notificationForm.validateFields();
      if (editingNotificationId) {
        setNotifications(notifications.map(notification => 
          notification.id === editingNotificationId ? { ...notification, ...values } : notification
        ));
        message.success('通知已更新');
      } else {
        const newNotification: Notification = {
          id: `${notifications.length + 1}`,
          ...values,
          publishDate: new Date().toISOString().split('T')[0]
        };
        setNotifications([...notifications, newNotification]);
        message.success('通知已添加');
      }
      setNotificationModalVisible(false);
    } catch (error) {
      console.error('提交表单验证失败:', error);
    }
  };

  // Toggle notification publish status
  const toggleNotificationStatus = (id: string, currentStatus: boolean) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, isPublished: !currentStatus } : notification
    ));
    message.success(`通知已${currentStatus ? '取消发布' : '发布'}`);
  };

  // Toggle banner active status
  const toggleBannerStatus = (id: string, currentStatus: boolean) => {
    setBanners(banners.map(banner => 
      banner.id === id ? { ...banner, isActive: !currentStatus } : banner
    ));
    message.success(`轮播图已${currentStatus ? '禁用' : '启用'}`);
  };

  // Upload props
  const uploadProps: UploadProps = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      }
    },
  };

  // Table columns
  const bannerColumns: ColumnsType<Banner> = [
    {
      title: '排序',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 80,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '图片',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl) => (
        <img 
          src={imageUrl} 
          alt="轮播图" 
          style={{ width: 120, height: 60, objectFit: 'cover', cursor: 'pointer' }} 
          onClick={() => {
            setPreviewVisible(true);
          }}
        />
      ),
    },
    {
      title: '链接',
      dataIndex: 'linkUrl',
      key: 'linkUrl',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive, record) => (
        <Switch 
          checked={isActive} 
          onChange={() => toggleBannerStatus(record.id, isActive)}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEditBanner(record)}
          />
          <Button 
            type="text" 
            danger
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteBanner(record.id)}
          />
        </Space>
      ),
    },
  ];

  const notificationColumns: ColumnsType<Notification> = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        let color = '';
        let text = '';
        switch (type) {
          case 'announcement':
            color = 'blue';
            text = '公告';
            break;
          case 'promotion':
            color = 'green';
            text = '促销';
            break;
          case 'update':
            color = 'orange';
            text = '更新';
            break;
          default:
            break;
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '发布日期',
      dataIndex: 'publishDate',
      key: 'publishDate',
    },
    {
      title: '状态',
      dataIndex: 'isPublished',
      key: 'isPublished',
      render: (isPublished, record) => (
        <Switch 
          checked={isPublished} 
          onChange={() => toggleNotificationStatus(record.id, isPublished)}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEditNotification(record)}
          />
          <Button 
            type="text" 
            danger
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteNotification(record.id)}
          />
        </Space>
      ),
    },
  ];

  // Handle form submission
  const handleSubmit = (values: any) => {
    console.log('提交的表单数据:', values);
    message.success('小程序设置已保存');
  };

  // Tabs items
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <span>
          <SettingOutlined />
          基本设置
        </span>
      ),
      children: (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            appName: '游泳培训小程序',
            appDesc: '专业的游泳培训服务',
            primaryColor: '#1890ff',
            secondaryColor: '#52c41a',
            contactPhone: '400-123-4567',
            contactEmail: 'support@example.com',
            address: '北京市朝阳区体育馆路1号',
          }}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="小程序名称"
                name="appName"
                rules={[{ required: true, message: '请输入小程序名称' }]}
              >
                <Input placeholder="请输入小程序名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="小程序Logo"
                name="appLogo"
              >
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>上传Logo</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="小程序简介"
            name="appDesc"
            rules={[{ required: true, message: '请输入小程序简介' }]}
          >
            <TextArea rows={4} placeholder="请输入小程序简介" />
          </Form.Item>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="主题色"
                name="primaryColor"
              >
                <Input type="color" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="辅助色"
                name="secondaryColor"
              >
                <Input type="color" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">联系信息</Divider>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="联系电话"
                name="contactPhone"
                rules={[{ required: true, message: '请输入联系电话' }]}
              >
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="联系邮箱"
                name="contactEmail"
                rules={[
                  { required: true, message: '请输入联系邮箱' },
                  { type: 'email', message: '邮箱格式不正确' }
                ]}
              >
                <Input placeholder="请输入联系邮箱" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="联系地址"
            name="address"
            rules={[{ required: true, message: '请输入联系地址' }]}
          >
            <Input placeholder="请输入联系地址" />
          </Form.Item>

          <Form.Item
            label="地图位置"
            name="mapLocation"
          >
            <div style={{ height: 200, background: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              地图位置选择器（示例）
            </div>
          </Form.Item>

          <Divider />

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                保存设置
              </Button>
              <Button onClick={() => setPreviewQrCodeVisible(true)}>
                查看小程序码
              </Button>
            </Space>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: '2',
      label: (
        <span>
          <AppstoreOutlined />
          轮播图管理
        </span>
      ),
      children: (
        <div>
          <div style={{ marginBottom: 16 }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddBanner}>
              添加轮播图
            </Button>
          </div>
          <Table 
            columns={bannerColumns} 
            dataSource={banners}
            rowKey="id"
            pagination={false}
          />
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <span>
          <NotificationOutlined />
          消息通知
        </span>
      ),
      children: (
        <div>
          <div style={{ marginBottom: 16 }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNotification}>
              添加通知
            </Button>
          </div>
          <Table 
            columns={notificationColumns} 
            dataSource={notifications}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        </div>
      ),
    },
    {
      key: '4',
      label: (
        <span>
          <MobileOutlined />
          小程序预览
        </span>
      ),
      children: (
        <div style={{ textAlign: 'center' }}>
          <div style={{ background: '#f5f5f5', width: 375, margin: '0 auto', padding: 16, borderRadius: 8 }}>
            <div style={{ background: 'white', borderRadius: 8, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <Title level={4}>游泳培训小程序</Title>
              <div style={{ margin: '16px 0', height: 200, background: '#e6f7ff', borderRadius: 8, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                轮播图区域
              </div>
              
              <Title level={5}>功能区</Title>
              <Row gutter={[16, 16]}>
                {['课程预约', '签到打卡', '学员信息', '课程记录', '缴费记录', '联系我们'].map((item, index) => (
                  <Col span={8} key={index}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ width: 50, height: 50, background: '#1890ff', borderRadius: '50%', margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <AppstoreOutlined style={{ color: 'white' }} />
                      </div>
                      <Text>{item}</Text>
                    </div>
                  </Col>
                ))}
              </Row>
              
              <Title level={5} style={{ marginTop: 16 }}>通知公告</Title>
              <div>
                {notifications.filter(n => n.isPublished).slice(0, 3).map(notification => (
                  <div key={notification.id} style={{ borderBottom: '1px solid #f0f0f0', padding: '8px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text strong>{notification.title}</Text>
                      <Text type="secondary">{notification.publishDate}</Text>
                    </div>
                    <Text type="secondary" style={{ display: 'block', marginTop: 4 }} ellipsis={{ rows: 2 }}>
                      {notification.content}
                    </Text>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="miniprogram-management">
      <Title level={2}>小程序管理</Title>
      <Divider />
      
      <Card bordered={false}>
        <Tabs
          defaultActiveKey="1"
          items={items}
          activeKey={activeTab}
          onChange={setActiveTab}
        />
      </Card>
      
      {/* 轮播图预览模态框 */}
      <Modal
        open={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="轮播图预览" style={{ width: '100%' }} src="https://via.placeholder.com/750x350" />
      </Modal>
      
      {/* 小程序码预览模态框 */}
      <Modal
        title="小程序码"
        open={previewQrCodeVisible}
        footer={null}
        onCancel={() => setPreviewQrCodeVisible(false)}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: 16 }}>
            <QrcodeOutlined style={{ fontSize: 120, color: '#1890ff' }} />
          </div>
          <Text>使用微信扫描二维码访问小程序</Text>
        </div>
      </Modal>
      
      {/* 轮播图编辑模态框 */}
      <Modal
        title={editingBannerId ? "编辑轮播图" : "添加轮播图"}
        open={bannerModalVisible}
        onOk={handleSaveBanner}
        onCancel={() => setBannerModalVisible(false)}
      >
        <Form
          form={bannerForm}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入轮播图标题' }]}
          >
            <Input placeholder="请输入轮播图标题" />
          </Form.Item>
          
          <Form.Item
            name="imageUrl"
            label="图片URL"
            rules={[{ required: true, message: '请输入图片URL' }]}
          >
            <Input placeholder="请输入图片URL或上传图片" />
          </Form.Item>
          
          <Form.Item
            name="linkUrl"
            label="链接URL"
            rules={[{ required: true, message: '请输入链接URL' }]}
          >
            <Input placeholder="请输入链接URL" />
          </Form.Item>
          
          <Form.Item
            name="isActive"
            label="是否启用"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 通知编辑模态框 */}
      <Modal
        title={editingNotificationId ? "编辑通知" : "添加通知"}
        open={notificationModalVisible}
        onOk={handleSaveNotification}
        onCancel={() => setNotificationModalVisible(false)}
      >
        <Form
          form={notificationForm}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入通知标题' }]}
          >
            <Input placeholder="请输入通知标题" />
          </Form.Item>
          
          <Form.Item
            name="content"
            label="内容"
            rules={[{ required: true, message: '请输入通知内容' }]}
          >
            <TextArea rows={4} placeholder="请输入通知内容" />
          </Form.Item>
          
          <Form.Item
            name="type"
            label="类型"
            rules={[{ required: true, message: '请选择通知类型' }]}
            initialValue="announcement"
          >
            <Radio.Group>
              <Radio value="announcement">公告</Radio>
              <Radio value="promotion">促销</Radio>
              <Radio value="update">更新</Radio>
            </Radio.Group>
          </Form.Item>
          
          <Form.Item
            name="isPublished"
            label="是否发布"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MiniprogramManagement; 