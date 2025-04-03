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
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  HomeOutlined,
  UserOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

// 定义校区数据类型
interface Campus {
  id: string;
  name: string;
  address: string;
  phone: string;
  contactPerson?: string; // 非必填的联系人
  capacity: number;
  area: number; // 面积，单位：平方米
  facilities: string[];
  image?: string;
  status: 'open' | 'closed' | 'renovating';
  openDate: string;
  studentCount: number;
  coachCount: number;
  courseCount: number;
  monthlyRent: number; // 月租金
  propertyFee: number; // 物业费
  utilitiesFee: number; // 固定水电费
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
  const [form] = Form.useForm();
  
  // 添加状态切换确认模态框相关状态
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [campusToToggle, setCampusToToggle] = useState<Campus | null>(null);
  
  // 添加删除确认模态框相关状态
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [campusIdToDelete, setCampusIdToDelete] = useState<string>('');
  const [campusNameToDelete, setCampusNameToDelete] = useState<string>('');

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
            contactPerson: `负责人${index + 1}`,
            capacity: (index % 5 + 2) * 100,
            area: (index % 10 + 5) * 200,
            facilities: selectedFacilities,
            image: `https://picsum.photos/800/400?random=${index}`,
            status: index % 10 === 0 ? 'closed' : index % 15 === 0 ? 'renovating' : 'open',
            openDate: dayjs().subtract((index + 1) * 90, 'day').format('YYYY-MM-DD'),
            studentCount,
            coachCount,
            courseCount: Math.floor(Math.random() * 30) + 10,
            monthlyRent: Math.floor(Math.random() * 50000) + 10000,
            propertyFee: Math.floor(Math.random() * 5000) + 1000,
            utilitiesFee: Math.floor(Math.random() * 3000) + 500,
          };
        });

      // 过滤数据
      let filteredData = mockData;
      
      if (searchText) {
        filteredData = filteredData.filter(
          campus => 
            campus.name.includes(searchText) || 
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
    setEditingCampus(null);
    setIsModalVisible(true);
  };
  
  // 显示编辑校区模态框
  const showEditModal = (record: Campus) => {
    setEditingCampus(record);
    form.setFieldsValue({
      name: record.name,
      address: record.address,
      status: record.status,
      monthlyRent: record.monthlyRent || 0,
      propertyFee: record.propertyFee || 0,
      utilitiesFee: record.utilitiesFee || 0,
      contactPerson: record.contactPerson,
      phone: record.phone,
    });
    
    setIsModalVisible(true);
  };

  // 处理模态框确认
  const handleModalOk = () => {
    form.validateFields()
      .then(values => {
        let formattedValues = { ...values };

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
            monthlyRent: formattedValues.monthlyRent || 0,
            propertyFee: formattedValues.propertyFee || 0,
            utilitiesFee: formattedValues.utilitiesFee || 0,
            // 设置默认值，这些字段在UI中已删除
            capacity: 200,
            area: 1000,
            facilities: [],
            image: '',
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
    setIsDeleteModalVisible(false);
  };

  // 处理校区状态切换（启用/停用）
  const handleToggleStatus = (record: Campus) => {
    const newStatus = record.status === 'closed' ? 'open' : 'closed';
    setCampuses(prevCampuses => 
      prevCampuses.map(campus => 
        campus.id === record.id 
          ? { ...campus, status: newStatus } 
          : campus
      )
    );
    message.success(`校区已${newStatus === 'closed' ? '停用' : '启用'}`);
    setIsStatusModalVisible(false);
  };
  
  // 显示状态切换确认模态框
  const showStatusConfirmModal = (record: Campus) => {
    setCampusToToggle(record);
    setIsStatusModalVisible(true);
  };
  
  // 关闭状态切换确认模态框
  const handleStatusModalCancel = () => {
    setIsStatusModalVisible(false);
    setCampusToToggle(null);
  };
  
  // 显示删除确认模态框
  const showDeleteConfirmModal = (id: string, name: string) => {
    setCampusIdToDelete(id);
    setCampusNameToDelete(name);
    setIsDeleteModalVisible(true);
  };
  
  // 关闭删除确认模态框
  const handleDeleteModalCancel = () => {
    setIsDeleteModalVisible(false);
    setCampusIdToDelete('');
    setCampusNameToDelete('');
  };

  // 表格列配置
  const columns: ColumnsType<Campus> = [
    {
      title: '校区名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
      align: 'center',
    },
    {
      title: '联系方式',
      key: 'contact',
      align: 'center',
      render: (_, record) => (
        <>
          <div>{record.contactPerson}</div>
          <div>{record.phone}</div>
        </>
      ),
    },
    {
      title: '校区规模',
      key: 'scale',
      align: 'center',
      render: (_, record) => (
        <>
          <div>学员数: {record.studentCount}</div>
          <div>教练数: {record.coachCount}</div>
          <div>待销课时: {record.courseCount}</div>
        </>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
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
      width: 200,
      align: 'center',
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
          <Tooltip title={record.status === 'closed' ? '启用' : '停用'}>
            <Button
              type="text"
              size="small"
              icon={record.status === 'closed' ? <PlayCircleOutlined /> : <PauseCircleOutlined />}
              onClick={() => showStatusConfirmModal(record)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button 
              type="text" 
              size="small" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => showDeleteConfirmModal(record.id, record.name)}
            />
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
              placeholder="搜索校区名称/地址/电话"
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
        title={<div style={{ fontSize: '18px', fontWeight: 'bold' }}>{editingCampus ? '编辑校区' : '添加校区'}</div>}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
        okText={editingCampus ? '保存' : '添加'}
        cancelText="取消"
      >
        <div style={{ borderBottom: '1px solid #e8e8e8', paddingBottom: '16px', marginBottom: '24px' }}>
          <Typography.Title level={5} style={{ margin: 0 }}>基本信息</Typography.Title>
        </div>
        <Form
          form={form}
          layout="vertical"
          name="campusForm"
          initialValues={{
            status: 'open',
            monthlyRent: 0,
            propertyFee: 0,
            utilitiesFee: 0,
          }}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="name"
                label="校区名称"
                rules={[{ required: true, message: '请输入校区名称' }]}
              >
                <Input prefix={<HomeOutlined />} placeholder="请输入校区名称" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="address"
                label="地址"
                rules={[{ required: true, message: '请输入地址' }]}
              >
                <Input prefix={<EnvironmentOutlined />} placeholder="请输入地址" />
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
            <Col span={8}>
              <Form.Item
                name="monthlyRent"
                label="月租金"
                rules={[{ required: true, message: '请输入月租金' }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="请输入月租金"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="propertyFee"
                label="物业费"
                rules={[{ required: true, message: '请输入物业费' }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="请输入物业费"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="utilitiesFee"
                label="固定水电费"
                rules={[{ required: true, message: '请输入固定水电费' }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="请输入固定水电费"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="contactPerson"
                label="联系人"
              >
                <Input placeholder="请输入联系人" disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="联系电话"
              >
                <Input prefix={<PhoneOutlined />} placeholder="请输入联系电话" disabled />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 状态切换确认模态框 */}
      <Modal
        title="操作确认"
        open={isStatusModalVisible}
        onOk={() => campusToToggle && handleToggleStatus(campusToToggle)}
        onCancel={handleStatusModalCancel}
        okText="确认"
        cancelText="取消"
      >
        <p>确定要{campusToToggle?.status === 'closed' ? '启用' : '停用'}校区「{campusToToggle?.name}」吗？</p>
      </Modal>

      {/* 删除确认模态框 */}
      <Modal
        title="删除确认"
        open={isDeleteModalVisible}
        onOk={() => handleDeleteCampus(campusIdToDelete)}
        onCancel={handleDeleteModalCancel}
        okText="确认删除"
        cancelText="取消"
      >
        <p>确定要删除校区「{campusNameToDelete}」吗？此操作不可逆！</p>
      </Modal>
    </div>
  );
};

export default CampusManagement; 