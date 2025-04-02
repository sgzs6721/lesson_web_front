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
  Radio,
  Switch,
  Upload,
  Tabs
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  DollarOutlined,
  CalendarOutlined,
  BookOutlined,
  UploadOutlined,
  FileImageOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd/es/upload/interface';
import dayjs from 'dayjs';

const { Title, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

interface Course {
  id: string;
  name: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  capacity: number;
  period: number;
  periodUnit: 'day' | 'week' | 'month';
  totalHours: number;
  status: 'active' | 'inactive' | 'pending';
  description: string;
  cover?: string;
  createdAt: string;
  updatedAt: string;
  campuses: string[];
  coaches: string[];
}

const CourseManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [activeTab, setActiveTab] = useState('1');
  const [form] = Form.useForm();

  // 模拟课程分类
  const categoryOptions = [
    { value: 'sports', label: '体育运动' },
    { value: 'arts', label: '艺术创作' },
    { value: 'music', label: '音乐培训' },
    { value: 'education', label: '学科教育' },
    { value: 'technology', label: '科技培训' },
    { value: 'language', label: '语言学习' },
  ];

  // 模拟校区和教练数据
  const campusOptions = [
    { value: 'campus_1', label: '北京中关村校区' },
    { value: 'campus_2', label: '北京望京校区' },
    { value: 'campus_3', label: '上海徐汇校区' },
    { value: 'campus_4', label: '上海浦东校区' },
    { value: 'campus_5', label: '广州天河校区' },
    { value: 'campus_6', label: '深圳南山校区' },
  ];

  const coachOptions = [
    { value: 'coach_1', label: '张教练' },
    { value: 'coach_2', label: '李教练' },
    { value: 'coach_3', label: '王教练' },
    { value: 'coach_4', label: '刘教练' },
    { value: 'coach_5', label: '陈教练' },
    { value: 'coach_6', label: '林教练' },
  ];

  useEffect(() => {
    fetchCourses();
  }, [currentPage, pageSize, searchText, selectedCategory, selectedStatus]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 生成测试数据
      const mockData: Course[] = Array(30)
        .fill(null)
        .map((_, index) => {
          const category = categoryOptions[index % categoryOptions.length].value;
          const level = index % 3 === 0 ? 'beginner' : index % 3 === 1 ? 'intermediate' : 'advanced';
          const periodUnit = index % 3 === 0 ? 'day' : index % 3 === 1 ? 'week' : 'month';
          
          return {
            id: `C${10000 + index}`,
            name: `${categoryOptions[index % categoryOptions.length].label}${level === 'beginner' ? '初级' : level === 'intermediate' ? '中级' : '高级'}班`,
            category,
            level,
            price: 500 + index * 100,
            capacity: 10 + (index % 15),
            period: 1 + (index % 5),
            periodUnit,
            totalHours: 10 + (index % 10) * 4,
            status: index % 5 === 0 ? 'pending' : index % 7 === 0 ? 'inactive' : 'active',
            description: `这是一个${categoryOptions[index % categoryOptions.length].label}${level === 'beginner' ? '初级' : level === 'intermediate' ? '中级' : '高级'}班，适合${level === 'beginner' ? '初学者' : level === 'intermediate' ? '有一定基础的学员' : '高级学员'}。`,
            cover: `https://picsum.photos/200/300?random=${index}`,
            createdAt: dayjs().subtract(index * 2, 'day').format('YYYY-MM-DD HH:mm:ss'),
            updatedAt: dayjs().subtract(index, 'day').format('YYYY-MM-DD HH:mm:ss'),
            campuses: [
              campusOptions[index % campusOptions.length].value,
              campusOptions[(index + 2) % campusOptions.length].value,
            ],
            coaches: [
              coachOptions[index % coachOptions.length].value,
              coachOptions[(index + 3) % coachOptions.length].value,
            ],
          };
        });

      // 过滤数据
      let filteredData = mockData;
      
      if (searchText) {
        filteredData = filteredData.filter(
          course => 
            course.name.includes(searchText) || 
            course.id.includes(searchText) ||
            course.description.includes(searchText)
        );
      }
      
      if (selectedCategory) {
        filteredData = filteredData.filter(course => course.category === selectedCategory);
      }
      
      if (selectedStatus) {
        filteredData = filteredData.filter(course => course.status === selectedStatus);
      }

      // 分页
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      const paginatedData = filteredData.slice(start, end);
      
      setTotal(filteredData.length);
      setCourses(paginatedData);
    } catch (error) {
      message.error('获取课程列表失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchText('');
    setSelectedCategory('');
    setSelectedStatus('');
    setCurrentPage(1);
    fetchCourses();
  };

  const showAddModal = () => {
    form.resetFields();
    setFileList([]);
    setEditingCourse(null);
    setActiveTab('1');
    setIsModalVisible(true);
  };
  
  const showEditModal = (record: Course) => {
    setEditingCourse(record);
    form.setFieldsValue({
      ...record,
    });
    
    if (record.cover) {
      setFileList([
        {
          uid: '-1',
          name: 'course-cover.jpg',
          status: 'done',
          url: record.cover,
        },
      ]);
    } else {
      setFileList([]);
    }
    
    setActiveTab('1');
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields()
      .then(values => {
        let formattedValues = { ...values };
        
        // 处理封面图片
        if (fileList.length > 0 && fileList[0].url) {
          formattedValues.cover = fileList[0].url;
        }

        if (editingCourse) {
          // 编辑现有课程
          setCourses(prevCourses => 
            prevCourses.map(course => 
              course.id === editingCourse.id 
                ? { 
                    ...course, 
                    ...formattedValues,
                    updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                  } 
                : course
            )
          );
          message.success('课程信息已更新');
        } else {
          // 添加新课程
          const newCourse: Course = {
            id: `C${10000 + Math.floor(Math.random() * 90000)}`,
            ...formattedValues,
            createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          };
          setCourses(prevCourses => [newCourse, ...prevCourses]);
          setTotal(prev => prev + 1);
          message.success('课程添加成功');
        }

        form.resetFields();
        setIsModalVisible(false);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handleModalCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(courses.filter(course => course.id !== id));
    setTotal(prev => prev - 1);
    message.success('课程已删除');
  };

  const columns: ColumnsType<Course> = [
    {
      title: '课程ID',
      dataIndex: 'id',
      key: 'id',
      width: 90,
    },
    {
      title: '课程名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {record.cover && (
            <img 
              src={record.cover} 
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
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category) => {
        const categoryInfo = categoryOptions.find(cat => cat.value === category);
        return categoryInfo?.label || category;
      },
    },
    {
      title: '难度',
      dataIndex: 'level',
      key: 'level',
      render: (level) => {
        let color = '';
        let text = '';
        
        switch (level) {
          case 'beginner':
            color = 'green';
            text = '初级';
            break;
          case 'intermediate':
            color = 'blue';
            text = '中级';
            break;
          case 'advanced':
            color = 'purple';
            text = '高级';
            break;
          default:
            color = 'default';
            text = level;
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '价格(元)',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `¥${price}`,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: '周期',
      key: 'period',
      render: (_, record) => {
        let unit = '';
        switch (record.periodUnit) {
          case 'day':
            unit = '天';
            break;
          case 'week':
            unit = '周';
            break;
          case 'month':
            unit = '月';
            break;
        }
        return `${record.period} ${unit}`;
      },
    },
    {
      title: '总课时',
      dataIndex: 'totalHours',
      key: 'totalHours',
      render: (hours) => `${hours}小时`,
    },
    {
      title: '班容量',
      dataIndex: 'capacity',
      key: 'capacity',
      render: (capacity) => `${capacity}人`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = '';
        let text = '';
        
        switch (status) {
          case 'active':
            color = 'green';
            text = '开课中';
            break;
          case 'inactive':
            color = 'red';
            text = '已停课';
            break;
          case 'pending':
            color = 'orange';
            text = '待开课';
            break;
          default:
            color = 'default';
            text = status;
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date) => dayjs(date).format('YYYY-MM-DD'),
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
              title="确定要删除此课程吗？"
              onConfirm={() => handleDeleteCourse(record.id)}
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

  const handleCoverChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
  };

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
    <div className="course-management">
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4}>课程管理</Title>
        </Col>
        <Col>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={showAddModal}
          >
            添加课程
          </Button>
        </Col>
      </Row>

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8} lg={8}>
            <Input
              placeholder="搜索课程名称/ID"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Col>
          <Col xs={24} sm={7} lg={7}>
            <Select
              placeholder="选择课程分类"
              style={{ width: '100%' }}
              value={selectedCategory}
              onChange={value => setSelectedCategory(value)}
              allowClear
            >
              {categoryOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={7} lg={7}>
            <Select
              placeholder="选择状态"
              style={{ width: '100%' }}
              value={selectedStatus}
              onChange={value => setSelectedStatus(value)}
              allowClear
            >
              <Option value="active">开课中</Option>
              <Option value="inactive">已停课</Option>
              <Option value="pending">待开课</Option>
            </Select>
          </Col>
          <Col xs={24} sm={2} lg={2} style={{ textAlign: 'right' }}>
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
          dataSource={courses}
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
        title={editingCourse ? '编辑课程' : '添加课程'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
        okText={editingCourse ? '保存' : '添加'}
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
              name="courseForm"
              initialValues={{
                level: 'beginner',
                status: 'active',
                period: 1,
                periodUnit: 'month',
                capacity: 15,
              }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="课程名称"
                    rules={[{ required: true, message: '请输入课程名称' }]}
                  >
                    <Input prefix={<BookOutlined />} placeholder="请输入课程名称" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="category"
                    label="课程分类"
                    rules={[{ required: true, message: '请选择课程分类' }]}
                  >
                    <Select placeholder="请选择课程分类">
                      {categoryOptions.map(option => (
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
                    name="level"
                    label="课程难度"
                    rules={[{ required: true, message: '请选择课程难度' }]}
                  >
                    <Radio.Group>
                      <Radio value="beginner">初级</Radio>
                      <Radio value="intermediate">中级</Radio>
                      <Radio value="advanced">高级</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="status"
                    label="课程状态"
                    rules={[{ required: true, message: '请选择课程状态' }]}
                  >
                    <Radio.Group>
                      <Radio value="active">开课中</Radio>
                      <Radio value="inactive">已停课</Radio>
                      <Radio value="pending">待开课</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="price"
                    label="课程价格(元)"
                    rules={[{ required: true, message: '请输入课程价格' }]}
                  >
                    <InputNumber
                      min={0}
                      style={{ width: '100%' }}
                      prefix={<DollarOutlined />}
                      placeholder="请输入课程价格"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="totalHours"
                    label="总课时(小时)"
                    rules={[{ required: true, message: '请输入总课时' }]}
                  >
                    <InputNumber
                      min={1}
                      style={{ width: '100%' }}
                      prefix={<ClockCircleOutlined />}
                      placeholder="请输入总课时"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="capacity"
                    label="班容量(人)"
                    rules={[{ required: true, message: '请输入班容量' }]}
                  >
                    <InputNumber
                      min={1}
                      style={{ width: '100%' }}
                      prefix={<TeamOutlined />}
                      placeholder="请输入班容量"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="period"
                    label="周期数量"
                    rules={[{ required: true, message: '请输入周期数量' }]}
                  >
                    <InputNumber
                      min={1}
                      style={{ width: '100%' }}
                      placeholder="请输入周期数量"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="periodUnit"
                    label="周期单位"
                    rules={[{ required: true, message: '请选择周期单位' }]}
                  >
                    <Select placeholder="请选择周期单位">
                      <Option value="day">天</Option>
                      <Option value="week">周</Option>
                      <Option value="month">月</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="cover"
                    label="课程封面"
                  >
                    <Upload
                      listType="picture-card"
                      fileList={fileList}
                      onChange={handleCoverChange}
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

              <Form.Item
                name="description"
                label="课程描述"
                rules={[{ required: true, message: '请输入课程描述' }]}
              >
                <TextArea rows={4} placeholder="请输入课程描述" />
              </Form.Item>
            </Form>
          </TabPane>
          
          <TabPane tab="校区分配" key="2">
            <Form.Item
              name="campuses"
              label="可开课校区"
              rules={[{ required: true, message: '请选择至少一个校区' }]}
            >
              <Select
                mode="multiple"
                placeholder="请选择校区"
                style={{ width: '100%' }}
              >
                {campusOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </TabPane>
          
          <TabPane tab="教练分配" key="3">
            <Form.Item
              name="coaches"
              label="可授课教练"
              rules={[{ required: true, message: '请选择至少一个教练' }]}
            >
              <Select
                mode="multiple"
                placeholder="请选择教练"
                style={{ width: '100%' }}
              >
                {coachOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </TabPane>
        </Tabs>
      </Modal>
    </div>
  );
};

export default CourseManagement; 