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
  Divider,
  Upload,
  Radio,
  DatePicker
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  PhoneOutlined,
  UploadOutlined,
  IdcardOutlined,
  MailOutlined,
  CalendarOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd/es/upload/interface';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// 定义教练数据类型
interface Coach {
  id: string;
  name: string;
  gender: 'male' | 'female';
  age: number;
  phone: string;
  email: string;
  avatar?: string;
  jobTitle: string;
  specialties: string[];
  certifications: string[];
  experience: number;
  bio: string;
  status: 'active' | 'vacation' | 'resigned';
  hireDate: string;
  workHours: string[];
}

const CoachManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCoach, setEditingCoach] = useState<Coach | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();

  // 专业领域选项
  const specialtyOptions = [
    { value: 'basketball', label: '篮球' },
    { value: 'swimming', label: '游泳' },
    { value: 'tennis', label: '网球' },
    { value: 'fitness', label: '健身' },
    { value: 'yoga', label: '瑜伽' },
    { value: 'taekwondo', label: '跆拳道' },
    { value: 'dancing', label: '舞蹈' },
    { value: 'football', label: '足球' },
  ];

  // 认证证书选项
  const certificationOptions = [
    { value: 'national_cert', label: '国家体育教练员证' },
    { value: 'first_aid', label: '急救证' },
    { value: 'professional_coach', label: '专业教练认证' },
    { value: 'nutritionist', label: '营养师证书' },
    { value: 'fitness_trainer', label: '健身教练证' },
    { value: 'sports_rehab', label: '运动康复师' },
  ];

  // 模拟获取教练数据
  useEffect(() => {
    fetchCoaches();
  }, [currentPage, pageSize, searchText, selectedStatus, selectedSpecialty]);

  const fetchCoaches = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 生成测试数据
      const mockData: Coach[] = Array(50)
        .fill(null)
        .map((_, index) => {
          // 随机生成专业和证书
          const specialtiesCount = Math.floor(Math.random() * 3) + 1;
          const selectedSpecialties = specialtyOptions
            .sort(() => 0.5 - Math.random())
            .slice(0, specialtiesCount)
            .map(s => s.value);

          const certificationsCount = Math.floor(Math.random() * 3) + 1;
          const selectedCertifications = certificationOptions
            .sort(() => 0.5 - Math.random())
            .slice(0, certificationsCount)
            .map(c => c.value);

          // 生成工作时间
          const workHours = [
            '周一 09:00-18:00',
            '周二 09:00-18:00',
            '周三 09:00-18:00',
            '周四 09:00-18:00',
            '周五 09:00-18:00',
            '周六 10:00-16:00',
          ];
          
          // 随机排除一些工作日
          const filteredWorkHours = workHours.filter(() => Math.random() > 0.2);

          return {
            id: `C${10000 + index}`,
            name: `教练${index + 1}`,
            gender: index % 2 === 0 ? 'male' : 'female',
            age: 25 + (index % 20),
            phone: `13${String(9000000000 + index).substring(0, 10)}`,
            email: `coach${index + 1}@example.com`,
            avatar: `https://randomuser.me/api/portraits/${index % 2 === 0 ? 'men' : 'women'}/${index % 100}.jpg`,
            jobTitle: index % 5 === 0 ? '高级教练' : index % 3 === 0 ? '中级教练' : '初级教练',
            specialties: selectedSpecialties,
            certifications: selectedCertifications,
            experience: 1 + (index % 15),
            bio: `这是教练${index + 1}的个人简介，拥有${1 + (index % 15)}年相关教学经验。`,
            status: index % 7 === 0 ? 'vacation' : index % 11 === 0 ? 'resigned' : 'active',
            hireDate: dayjs().subtract(index % 1000, 'day').format('YYYY-MM-DD'),
            workHours: filteredWorkHours,
          };
        });

      // 过滤数据
      let filteredData = mockData;
      
      if (searchText) {
        filteredData = filteredData.filter(
          coach => 
            coach.name.includes(searchText) || 
            coach.id.includes(searchText) ||
            coach.phone.includes(searchText) ||
            coach.email.includes(searchText)
        );
      }
      
      if (selectedStatus) {
        filteredData = filteredData.filter(coach => coach.status === selectedStatus);
      }
      
      if (selectedSpecialty) {
        filteredData = filteredData.filter(coach => 
          coach.specialties.includes(selectedSpecialty)
        );
      }

      // 分页
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      const paginatedData = filteredData.slice(start, end);
      
      setTotal(filteredData.length);
      setCoaches(paginatedData);
    } catch (error) {
      message.error('获取教练列表失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 处理搜索和筛选重置
  const handleReset = () => {
    setSearchText('');
    setSelectedStatus('');
    setSelectedSpecialty('');
    setCurrentPage(1);
    fetchCoaches();
  };

  // 显示添加教练模态框
  const showAddModal = () => {
    form.resetFields();
    setFileList([]);
    setEditingCoach(null);
    setIsModalVisible(true);
  };
  
  // 显示编辑教练模态框
  const showEditModal = (record: Coach) => {
    setEditingCoach(record);
    form.setFieldsValue({
      ...record,
      hireDate: dayjs(record.hireDate),
    });
    
    if (record.avatar) {
      setFileList([
        {
          uid: '-1',
          name: 'avatar.jpg',
          status: 'done',
          url: record.avatar,
        },
      ]);
    } else {
      setFileList([]);
    }
    
    setIsModalVisible(true);
  };

  // 处理模态框确认
  const handleModalOk = () => {
    form.validateFields()
      .then(values => {
        let formattedValues = { ...values };
        
        // 处理日期
        if (values.hireDate) {
          formattedValues.hireDate = values.hireDate.format('YYYY-MM-DD');
        }
        
        // 处理头像
        if (fileList.length > 0 && fileList[0].url) {
          formattedValues.avatar = fileList[0].url;
        }

        if (editingCoach) {
          // 编辑现有教练
          setCoaches(prevCoaches => 
            prevCoaches.map(coach => 
              coach.id === editingCoach.id 
                ? { ...coach, ...formattedValues } 
                : coach
            )
          );
          message.success('教练信息已更新');
        } else {
          // 添加新教练
          const newCoach: Coach = {
            id: `C${10000 + Math.floor(Math.random() * 90000)}`,
            ...formattedValues,
          };
          setCoaches(prevCoaches => [newCoach, ...prevCoaches]);
          setTotal(prev => prev + 1);
          message.success('教练添加成功');
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

  // 处理删除教练
  const handleDeleteCoach = (id: string) => {
    setCoaches(coaches.filter(coach => coach.id !== id));
    setTotal(prev => prev - 1);
    message.success('教练已删除');
  };

  // 处理头像上传变化
  const handleAvatarChange = ({ fileList }: { fileList: UploadFile[] }) => {
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
  const columns: ColumnsType<Coach> = [
    {
      title: '教练ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {record.avatar && (
            <img 
              src={record.avatar} 
              alt={text} 
              style={{ 
                width: 32, 
                height: 32, 
                marginRight: 8, 
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
          )}
          <span>
            {text} 
            {record.gender === 'male' ? 
              <span style={{ color: '#1890ff', marginLeft: 5 }}>♂</span> : 
              <span style={{ color: '#eb2f96', marginLeft: 5 }}>♀</span>
            }
          </span>
        </div>
      ),
    },
    {
      title: '职位',
      dataIndex: 'jobTitle',
      key: 'jobTitle',
    },
    {
      title: '专业领域',
      key: 'specialties',
      render: (_, record) => (
        <>
          {record.specialties.map(specialty => {
            const specialtyInfo = specialtyOptions.find(option => option.value === specialty);
            return (
              <Tag color="blue" key={specialty}>
                {specialtyInfo?.label || specialty}
              </Tag>
            );
          })}
        </>
      ),
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
      title: '入职日期',
      dataIndex: 'hireDate',
      key: 'hireDate',
      render: text => dayjs(text).format('YYYY-MM-DD'),
    },
    {
      title: '教龄',
      dataIndex: 'experience',
      key: 'experience',
      render: (years) => `${years}年`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: status => {
        let color = '';
        let text = '';
        
        switch (status) {
          case 'active':
            color = 'green';
            text = '在职';
            break;
          case 'vacation':
            color = 'orange';
            text = '休假中';
            break;
          case 'resigned':
            color = 'red';
            text = '已离职';
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
              title="确定要删除此教练吗？"
              onConfirm={() => handleDeleteCoach(record.id)}
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
    <div className="coach-management">
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4}>教练管理</Title>
        </Col>
        <Col>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={showAddModal}
          >
            添加教练
          </Button>
        </Col>
      </Row>

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={8} lg={8}>
            <Input
              placeholder="搜索教练姓名/ID/电话/邮箱"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6} lg={6}>
            <Select
              placeholder="选择状态"
              style={{ width: '100%' }}
              value={selectedStatus}
              onChange={value => setSelectedStatus(value)}
              allowClear
            >
              <Option value="active">在职</Option>
              <Option value="vacation">休假中</Option>
              <Option value="resigned">已离职</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={8}>
            <Select
              placeholder="选择专业领域"
              style={{ width: '100%' }}
              value={selectedSpecialty}
              onChange={value => setSelectedSpecialty(value)}
              allowClear
            >
              {specialtyOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={24} md={2} lg={2} style={{ textAlign: 'right' }}>
            <Button icon={<SearchOutlined />} onClick={handleReset}>
              重置
            </Button>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={coaches}
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
        title={editingCoach ? '编辑教练信息' : '添加教练'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
        okText={editingCoach ? '保存' : '添加'}
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          name="coachForm"
          initialValues={{
            gender: 'male',
            status: 'active',
            experience: 1,
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="姓名"
                rules={[{ required: true, message: '请输入教练姓名' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="请输入教练姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="gender"
                label="性别"
                rules={[{ required: true, message: '请选择性别' }]}
              >
                <Radio.Group>
                  <Radio value="male">男</Radio>
                  <Radio value="female">女</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="age"
                label="年龄"
                rules={[{ required: true, message: '请输入年龄' }]}
              >
                <Input type="number" placeholder="请输入年龄" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="联系电话"
                rules={[{ required: true, message: '请输入联系电话' }]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="邮箱"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入有效的邮箱地址' }
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="请输入邮箱" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="avatar"
                label="头像"
              >
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onChange={handleAvatarChange}
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

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="jobTitle"
                label="职位"
                rules={[{ required: true, message: '请输入职位' }]}
              >
                <Input placeholder="请输入职位" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="experience"
                label="教龄(年)"
                rules={[{ required: true, message: '请输入教龄' }]}
              >
                <Input type="number" placeholder="请输入教龄" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="specialties"
                label="专业领域"
                rules={[{ required: true, message: '请选择至少一个专业领域' }]}
              >
                <Select
                  mode="multiple"
                  placeholder="请选择专业领域"
                  style={{ width: '100%' }}
                >
                  {specialtyOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="certifications"
                label="持有证书"
                rules={[{ required: true, message: '请选择至少一个证书' }]}
              >
                <Select
                  mode="multiple"
                  placeholder="请选择证书"
                  style={{ width: '100%' }}
                >
                  {certificationOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="hireDate"
                label="入职日期"
                rules={[{ required: true, message: '请选择入职日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select placeholder="请选择状态">
                  <Option value="active">在职</Option>
                  <Option value="vacation">休假中</Option>
                  <Option value="resigned">已离职</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="bio"
            label="个人简介"
            rules={[{ required: true, message: '请输入个人简介' }]}
          >
            <TextArea rows={4} placeholder="请输入个人简介" />
          </Form.Item>

          <Form.Item
            name="workHours"
            label="工作时间"
          >
            <Select
              mode="multiple"
              placeholder="请选择工作时间"
              style={{ width: '100%' }}
            >
              <Option value="周一 09:00-18:00">周一 09:00-18:00</Option>
              <Option value="周二 09:00-18:00">周二 09:00-18:00</Option>
              <Option value="周三 09:00-18:00">周三 09:00-18:00</Option>
              <Option value="周四 09:00-18:00">周四 09:00-18:00</Option>
              <Option value="周五 09:00-18:00">周五 09:00-18:00</Option>
              <Option value="周六 10:00-16:00">周六 10:00-16:00</Option>
              <Option value="周日 10:00-16:00">周日 10:00-16:00</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CoachManagement; 