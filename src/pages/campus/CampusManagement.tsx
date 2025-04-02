import { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Button,
  Input,
  Select,
  Space,
  Modal,
  Form,
  message,
  Tooltip,
  Tag,
  Popconfirm,
  Typography,
  Row,
  Col,
  InputNumber,
  Upload,
  Tabs,
  List,
  Avatar
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  UploadOutlined,
  HomeOutlined,
  TeamOutlined,
  UserOutlined,
  MailOutlined,
  PictureOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd/es/upload/interface';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

// 定义校区数据类型
interface Campus {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  manager: string;
  managerPhone: string;
  capacity: number;
  area: number; // 面积，单位：平方米
  openTime: string;
  closeTime: string;
  facilities: string[];
  image?: string;
  status: 'open' | 'closed' | 'renovating';
  openDate: string;
  studentCount: number;
  coachCount: number;
  courseCount: number;
}

// 定义设施选项
const facilityOptions = [
  { value: 'parking', label: '停车场' },
  { value: 'wifi', label: 'WiFi' },
  { value: 'shower', label: '淋浴间' },
  { value: 'lockers', label: '储物柜' },
  { value: 'cafe', label: '咖啡厅' },
  { value: 'gym', label: '健身房' },
  { value: 'pool', label: '游泳池' },
  { value: 'basketball', label: '篮球场' },
  { value: 'tennis', label: '网球场' },
  { value: 'yoga_room', label: '瑜伽室' },
  { value: 'dance_room', label: '舞蹈室' },
];

// 主组件
const CampusManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCampus, setEditingCampus] = useState<Campus | null>(null);
  const [activeTab, setActiveTab] = useState('1');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();

  // 页面加载时获取数据
  useEffect(() => {
    fetchCampuses();
  }, [currentPage, pageSize, searchText, selectedStatus]);

  // 模拟获取校区数据
  const fetchCampuses = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 生成测试数据
      const mockData: Campus[] = Array(30)
        .fill(null)
        .map((_, index) => {
          // 随机生成设施
          const facilitiesCount = Math.floor(Math.random() * 6) + 3;
          const selectedFacilities = facilityOptions
            .sort(() => 0.5 - Math.random())
            .slice(0, facilitiesCount)
            .map(f => f.value);

          const studentCount = Math.floor(Math.random() * 300) + 100;
          const coachCount = Math.floor(Math.random() * 20) + 5;
          
          return {
            id: `CA${10000 + index}`,
            name: ['北京中关村校区', '北京望京校区', '上海徐汇校区', '上海浦东校区', '广州天河校区', '深圳南山校区', '杭州西湖校区', '成都锦江校区', '武汉江岸校区', '南京鼓楼校区'][index % 10],
            address: `${['北京市', '上海市', '广州市', '深圳市', '杭州市', '成都市', '武汉市', '南京市', '天津市', '重庆市'][index % 10]}${['海淀区', '朝阳区', '徐汇区', '浦东新区', '天河区', '南山区', '西湖区', '锦江区', '江岸区', '鼓楼区'][index % 10]}${['中关村大街', '望京街道', '徐家汇路', '张江高科技园区', '天河路', '科技园路', '西湖大道', '锦江大道', '江岸大道', '鼓楼街'][index % 10]}${index + 1}号`,
            phone: `${['010', '021', '020', '0755', '0571', '028', '027', '025', '022', '023'][index % 10]}-${String(55000000 + index * 10000).substring(0, 8)}`,
            email: `campus${index + 1}@example.com`,
            manager: `校区经理${index + 1}`,
            managerPhone: `13${String(9000000000 + index).substring(0, 10)}`,
            capacity: (index % 5 + 2) * 100,
            area: (index % 10 + 5) * 200,
            openTime: '08:30',
            closeTime: '22:00',
            facilities: selectedFacilities,
            image: `https://picsum.photos/800/400?random=${index}`,
            status: index % 10 === 0 ? 'closed' : index % 15 === 0 ? 'renovating' : 'open',
            openDate: dayjs().subtract((index + 1) * 90, 'day').format('YYYY-MM-DD'),
            studentCount,
            coachCount,
            courseCount: Math.floor(Math.random() * 30) + 10,
          };
        });

      // 过滤数据
      let filteredData = mockData;
      
      if (searchText) {
        filteredData = filteredData.filter(
          campus => 
            campus.name.includes(searchText) || 
            campus.id.includes(searchText) ||
            campus.address.includes(searchText) ||
            campus.phone.includes(searchText)
        );
      }
      
      if (selectedStatus) {
        filteredData = filteredData.filter(campus => campus.status === selectedStatus);
      }

      // 分页
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      const paginatedData = filteredData.slice(start, end);
      
      setTotal(filteredData.length);
      setCampuses(paginatedData);
    } catch (error) {
      message.error('获取校区列表失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 重置筛选条件
  const handleReset = () => {
    setSearchText('');
    setSelectedStatus('');
    setCurrentPage(1);
    fetchCampuses();
  };

  // 显示添加校区模态框
  const showAddModal = () => {
    form.resetFields();
    setFileList([]);
    setEditingCampus(null);
    setActiveTab('1');
    setIsModalVisible(true);
  };
  
  // 显示编辑校区模态框
  const showEditModal = (record: Campus) => {
    setEditingCampus(record);
    form.setFieldsValue({
      ...record,
    });
    
    if (record.image) {
      setFileList([
        {
          uid: '-1',
          name: 'campus-image.jpg',
          status: 'done',
          url: record.image,
        },
      ]);
    } else {
      setFileList([]);
    }
    
    setActiveTab('1');
    setIsModalVisible(true);
  };

  // 处理模态框确认
  const handleModalOk = () => {
    form.validateFields()
      .then(values => {
        let formattedValues = { ...values };
        
        // 处理图片
        if (fileList.length > 0 && fileList[0].url) {
          formattedValues.image = fileList[0].url;
        }

        if (editingCampus) {
          // 编辑现有校区
          setCampuses(prevCampuses => 
            prevCampuses.map(campus => 
              campus.id === editingCampus.id 
                ? { 
                    ...campus, 
                    ...formattedValues,
                  } 
                : campus
            )
          );
          message.success('校区信息已更新');
        } else {
          // 添加新校区
          const newCampus: Campus = {
            id: `CA${10000 + Math.floor(Math.random() * 90000)}`,
            ...formattedValues,
            studentCount: 0,
            coachCount: 0,
            courseCount: 0,
            openDate: dayjs().format('YYYY-MM-DD'),
          };
          setCampuses(prevCampuses => [newCampus, ...prevCampuses]);
          setTotal(prev => prev + 1);
          message.success('校区添加成功');
        }

        form.resetFields();
        setIsModalVisible(false);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  // 处理模态框取消
  const handleModalCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  // 处理删除校区
  const handleDeleteCampus = (id: string) => {
    setCampuses(campuses.filter(campus => campus.id !== id));
    setTotal(prev => prev - 1);
    message.success('校区已删除');
  };

  // 处理图片上传变化
  const handleImageChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
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

  // 表格列配置
  const columns: ColumnsType<Campus> = [
    {
      title: '校区ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '校区名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {record.image && (
            <img 
              src={record.image} 
              alt={text} 
              style={{ 
                width: 40, 
                height: 40, 
                marginRight: 8, 
                borderRadius: 4,
                objectFit: 'cover'
              }}
            />
          )}
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
    },
    {
      title: '联系方式',
      key: 'contact',
      render: (_, record) => (
        <>
          <div><PhoneOutlined /> {record.phone}</div>
          <div><MailOutlined /> {record.email}</div>
        </>
      ),
    },
    {
      title: '校区规模',
      key: 'scale',
      render: (_, record) => (
        <>
          <div>学员数: {record.studentCount}</div>
          <div>教练数: {record.coachCount}</div>
          <div>课程数: {record.courseCount}</div>
        </>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: status => {
        let color = '';
        let text = '';
        
        switch (status) {
          case 'open':
            color = 'green';
            text = '营业中';
            break;
          case 'closed':
            color = 'red';
            text = '已关闭';
            break;
          case 'renovating':
            color = 'orange';
            text = '装修中';
            break;
          default:
            color = 'default';
            text = status;
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="编辑">
            <Button 
              type="text" 
              size="small" 
              icon={<EditOutlined />} 
              onClick={() => showEditModal(record)} 
            />
          </Tooltip>
          <Tooltip title="删除">
            <Popconfirm
              title="确定要删除此校区吗？"
              onConfirm={() => handleDeleteCampus(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button 
                type="text" 
                size="small" 
                danger 
                icon={<DeleteOutlined />} 
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="campus-management">
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4}>校区管理</Title>
        </Col>
        <Col>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={showAddModal}
          >
            添加校区
          </Button>
        </Col>
      </Row>

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={8}>
            <Input
              placeholder="搜索校区名称/ID/地址/电话"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={8}>
            <Select
              placeholder="选择状态"
              style={{ width: '100%' }}
              value={selectedStatus}
              onChange={value => setSelectedStatus(value)}
              allowClear
            >
              <Option value="open">营业中</Option>
              <Option value="closed">已关闭</Option>
              <Option value="renovating">装修中</Option>
            </Select>
          </Col>
          <Col xs={24} sm={24} md={8} lg={8} style={{ textAlign: 'right' }}>
            <Button 
              icon={<SearchOutlined />} 
              onClick={handleReset}
            >
              重置
            </Button>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={campuses}
          rowKey="id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共 ${total} 条记录`,
            onChange: (page, pageSize) => {
              setCurrentPage(page);
              setPageSize(pageSize);
            },
          }}
        />
      </Card>

      <Modal
        title={editingCampus ? '编辑校区' : '添加校区'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
        okText={editingCampus ? '保存' : '添加'}
        cancelText="取消"
      >
        <Tabs 
          activeKey={activeTab} 
          onChange={key => setActiveTab(key)}
          style={{ marginBottom: 20 }}
        >
          <TabPane tab="基本信息" key="1">
            <Form
              form={form}
              layout="vertical"
              name="campusForm"
              initialValues={{
                status: 'open',
                capacity: 200,
                area: 1000,
                openTime: '08:30',
                closeTime: '22:00',
              }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="校区名称"
                    rules={[{ required: true, message: '请输入校区名称' }]}
                  >
                    <Input prefix={<HomeOutlined />} placeholder="请输入校区名称" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="address"
                    label="地址"
                    rules={[{ required: true, message: '请输入地址' }]}
                  >
                    <Input prefix={<EnvironmentOutlined />} placeholder="请输入地址" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="phone"
                    label="联系电话"
                    rules={[{ required: true, message: '请输入联系电话' }]}
                  >
                    <Input prefix={<PhoneOutlined />} placeholder="请输入联系电话" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="email"
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

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="manager"
                    label="校区经理"
                    rules={[{ required: true, message: '请输入校区经理姓名' }]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="请输入校区经理姓名" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="managerPhone"
                    label="经理电话"
                    rules={[{ required: true, message: '请输入经理电话' }]}
                  >
                    <Input prefix={<PhoneOutlined />} placeholder="请输入经理电话" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="openTime"
                    label="开放时间"
                    rules={[{ required: true, message: '请输入开放时间' }]}
                  >
                    <Input placeholder="请输入开放时间，例如：08:30" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="closeTime"
                    label="关闭时间"
                    rules={[{ required: true, message: '请输入关闭时间' }]}
                  >
                    <Input placeholder="请输入关闭时间，例如：22:00" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="capacity"
                    label="容纳人数"
                    rules={[{ required: true, message: '请输入容纳人数' }]}
                  >
                    <InputNumber
                      min={1}
                      style={{ width: '100%' }}
                      prefix={<TeamOutlined />}
                      placeholder="请输入容纳人数"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="area"
                    label="面积(平方米)"
                    rules={[{ required: true, message: '请输入面积' }]}
                  >
                    <InputNumber
                      min={1}
                      style={{ width: '100%' }}
                      placeholder="请输入面积"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="status"
                    label="状态"
                    rules={[{ required: true, message: '请选择状态' }]}
                  >
                    <Select placeholder="请选择状态">
                      <Option value="open">营业中</Option>
                      <Option value="closed">已关闭</Option>
                      <Option value="renovating">装修中</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="facilities"
                    label="设施"
                    rules={[{ required: true, message: '请选择至少一项设施' }]}
                  >
                    <Select
                      mode="multiple"
                      placeholder="请选择设施"
                      style={{ width: '100%' }}
                    >
                      {facilityOptions.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="image"
                    label="校区图片"
                  >
                    <Upload
                      listType="picture-card"
                      fileList={fileList}
                      onChange={handleImageChange}
                      beforeUpload={beforeUpload}
                      maxCount={1}
                    >
                      {fileList.length >= 1 ? null : (
                        <div>
                          <UploadOutlined />
                          <div style={{ marginTop: 8 }}>上传</div>
                        </div>
                      )}
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </TabPane>
          
          <TabPane tab="设施详情" key="2">
            <List
              itemLayout="horizontal"
              dataSource={facilityOptions}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<HomeOutlined />} />}
                    title={item.label}
                    description={`校区可能提供的${item.label}设施`}
                  />
                  {form.getFieldValue('facilities')?.includes(item.value) ? 
                    <Tag color="green">已有</Tag> : 
                    <Tag color="default">未有</Tag>
                  }
                </List.Item>
              )}
            />
          </TabPane>
        </Tabs>
      </Modal>
    </div>
  );
};

export default CampusManagement; 