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
  Tabs,
  List
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
  FileImageOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  FilterOutlined,
  SortAscendingOutlined
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
  consumedHours: number;
  hoursPerClass: number;
  unitPrice: number;
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
  const [sortOrder, setSortOrder] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list');
  const [form] = Form.useForm();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string>('');
  const [deletingCourseName, setDeletingCourseName] = useState<string>('');

  // 模拟课程分类
  const categoryOptions = [
    { value: 'sports', label: '体育运动' },
    { value: 'arts', label: '艺术创作' },
    { value: 'music', label: '音乐培训' },
    { value: 'education', label: '学科教育' },
    { value: 'technology', label: '科技培训' },
    { value: 'language', label: '语言学习' },
  ];

  // 排序选项
  const sortOptions = [
    { value: 'priceAsc', label: '课筹单价升序' },
    { value: 'priceDesc', label: '课筹单价降序' },
    { value: 'hoursAsc', label: '总课时升序' },
    { value: 'hoursDesc', label: '总课时降序' },
    { value: 'consumedHoursAsc', label: '已销课时升序' },
    { value: 'consumedHoursDesc', label: '已销课时降序' },
    { value: 'latestUpdate', label: '最近更新' },
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
  }, [currentPage, pageSize, searchText, selectedCategory, sortOrder]);

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
          const totalHours = 10 + (index % 10) * 4;
          
          return {
            id: `C${10000 + index}`,
            name: `${categoryOptions[index % categoryOptions.length].label}${level === 'beginner' ? '初级' : level === 'intermediate' ? '中级' : '高级'}班`,
            category,
            level,
            price: 500 + index * 100,
            capacity: 10 + (index % 15),
            period: 1 + (index % 5),
            periodUnit,
            totalHours,
            consumedHours: Math.floor(totalHours * (0.1 + Math.random() * 0.7)),
            hoursPerClass: 1 + (index % 3),
            unitPrice: 50 + (index % 10) * 15,
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
      
      // 排序
      if (sortOrder) {
        switch (sortOrder) {
          case 'priceAsc':
            filteredData.sort((a, b) => a.unitPrice - b.unitPrice);
            break;
          case 'priceDesc':
            filteredData.sort((a, b) => b.unitPrice - a.unitPrice);
            break;
          case 'hoursAsc':
            filteredData.sort((a, b) => a.totalHours - b.totalHours);
            break;
          case 'hoursDesc':
            filteredData.sort((a, b) => b.totalHours - a.totalHours);
            break;
          case 'consumedHoursAsc':
            filteredData.sort((a, b) => a.consumedHours - b.consumedHours);
            break;
          case 'consumedHoursDesc':
            filteredData.sort((a, b) => b.consumedHours - a.consumedHours);
            break;
          case 'latestUpdate':
            filteredData.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
            break;
          default:
            break;
        }
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
    setSortOrder('');
    setCurrentPage(1);
    fetchCourses();
  };

  const showAddModal = () => {
    form.resetFields();
    setEditingCourse(null);
    setIsModalVisible(true);
  };
  
  const showEditModal = (record: Course) => {
    setEditingCourse(record);
    form.setFieldsValue({
      ...record,
    });
    
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields()
      .then(values => {
        let formattedValues = { ...values };

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
            consumedHours: 0,
            campuses: [],
            coaches: formattedValues.coaches ? [formattedValues.coaches] : []
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
    setDeleteModalVisible(false);
  };

  const showDeleteConfirm = (id: string, name: string) => {
    setCourseToDelete(id);
    setDeletingCourseName(name);
    setDeleteModalVisible(true);
  };

  // 获取教练名称
  const getCoachNames = (coachIds: string[]) => {
    if (!coachIds || coachIds.length === 0) return '';
    // 只取第一个教练
    const id = coachIds[0];
    const coach = coachOptions.find(c => c.value === id);
    return coach ? coach.label : id;
  };

  // 获取课程分类名称
  const getCategoryName = (categoryId: string) => {
    const category = categoryOptions.find(c => c.value === categoryId);
    return category ? category.label : categoryId;
  };

  const columns: ColumnsType<Course> = [
    {
      title: '课程名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '课程类型',
      dataIndex: 'category',
      key: 'category',
      render: (category) => getCategoryName(category),
    },
    {
      title: '总课时',
      dataIndex: 'totalHours',
      key: 'totalHours',
      render: (hours) => `${hours}小时`,
    },
    {
      title: '已销课时',
      dataIndex: 'consumedHours',
      key: 'consumedHours',
      render: (hours) => `${hours}小时`,
    },
    {
      title: '上课教练',
      dataIndex: 'coaches',
      key: 'coaches',
      render: (coaches) => getCoachNames(coaches),
    },
    {
      title: '课筹单价',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (price) => `¥${price}`,
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
            <Button 
              type="text" 
              size="small" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => showDeleteConfirm(record.id, record.name)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const renderStatusTag = (status: string) => {
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
  };

  return (
    <div className="course-management">
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4}>课程管理</Title>
        </Col>
        <Col>
          <Space>
            <Button 
              type={viewMode === 'list' ? 'primary' : 'default'} 
              icon={<UnorderedListOutlined />}
              onClick={() => setViewMode('list')}
            >
              列表视图
            </Button>
            <Button 
              type={viewMode === 'card' ? 'primary' : 'default'} 
              icon={<AppstoreOutlined />}
              onClick={() => setViewMode('card')}
            >
              卡片视图
            </Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={showAddModal}
            >
              添加课程
            </Button>
          </Space>
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
              placeholder="排序方式"
              style={{ width: '100%' }}
              value={sortOrder}
              onChange={value => setSortOrder(value)}
              allowClear
              suffixIcon={<SortAscendingOutlined />}
            >
              {sortOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={2} lg={2} style={{ textAlign: 'right' }}>
            <Button 
              icon={<FilterOutlined />} 
              onClick={handleReset}
            >
              重置
            </Button>
          </Col>
        </Row>
      </Card>

      <Card>
        {viewMode === 'list' ? (
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
        ) : (
          <List
            grid={{ 
              gutter: 16, 
              xs: 1, 
              sm: 2, 
              md: 3, 
              lg: 4, 
              xl: 4,
              xxl: 4 
            }}
            dataSource={courses}
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
            renderItem={item => (
              <List.Item>
                <Card 
                  hoverable 
                  style={{ height: 280 }}
                  actions={[
                    <EditOutlined key="edit" style={{ color: '#1890ff' }} onClick={() => showEditModal(item)} />,
                    <DeleteOutlined key="delete" style={{ color: '#ff4d4f' }} onClick={() => showDeleteConfirm(item.id, item.name)} />
                  ]}
                >
                  <Card.Meta
                    title={<div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold' }}>
                      <span>{item.name}</span>
                      {renderStatusTag(item.status)}
                    </div>}
                    description={
                      <div style={{ height: 160, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'auto' }}>
                        <div>
                          <div style={{ borderBottom: '1px solid #f0f0f0', marginBottom: 12, paddingBottom: 8 }}></div>
                          <div style={{ marginBottom: 8, display: 'flex', flexWrap: 'wrap' }}>
                            <Tag color="blue">{getCategoryName(item.category)}</Tag>
                            <Tag color="purple">{getCoachNames(item.coaches)}</Tag>
                          </div>
                          <div style={{ marginBottom: 8 }}>
                            <div style={{ fontWeight: 'bold', display: 'block' }}>总课时： {item.totalHours}小时</div>
                          </div>
                          <div style={{ marginBottom: 8 }}>
                            <div style={{ fontWeight: 'bold', display: 'block' }}>已销课时： {item.consumedHours}小时</div>
                          </div>
                          {item.unitPrice && (
                            <div style={{ marginBottom: 8 }}>
                              <div style={{ fontWeight: 'bold', display: 'block' }}>教练课筹单价： ¥{item.unitPrice}</div>
                            </div>
                          )}
                          {item.description && (
                            <div style={{ marginBottom: 8 }}>
                              <div style={{ fontWeight: 'bold', display: 'block' }}>课程描述：</div>
                              <Paragraph ellipsis={{ rows: 2 }} style={{ marginTop: 4 }}>{item.description}</Paragraph>
                            </div>
                          )}
                        </div>
                        <div style={{ textAlign: 'right', fontSize: '12px' }}><span style={{ fontWeight: 'bold' }}>更新时间:</span> {dayjs(item.updatedAt).format('YYYY-MM-DD')}</div>
                      </div>
                    }
                  />
                </Card>
              </List.Item>
            )}
          />
        )}
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
        <div style={{ borderBottom: '1px solid #f0f0f0', marginBottom: 16, paddingBottom: 8 }}></div>
        <Form
          form={form}
          layout="vertical"
          name="courseForm"
          initialValues={{
            level: 'beginner',
            status: 'active',
            hoursPerClass: 1,
            unitPrice: 100
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
                label="课程类型"
                rules={[{ required: true, message: '请选择课程类型' }]}
              >
                <Select placeholder="请选择课程类型">
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
            <Col span={12}>
              <Form.Item
                name="coaches"
                label="上课教练"
                rules={[{ required: true, message: '请选择上课教练' }]}
              >
                <Select 
                  placeholder="请选择上课教练"
                  style={{ width: '100%' }}
                >
                  {coachOptions.map(option => (
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
                name="hoursPerClass"
                label="每次消耗课时"
                rules={[{ required: true, message: '请输入每次消耗课时' }]}
              >
                <InputNumber
                  min={0.5}
                  step={0.5}
                  style={{ width: '100%' }}
                  placeholder="请输入每次消耗课时"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="unitPrice"
                label="课筹单价(元)"
                rules={[{ required: false, message: '请输入课筹单价' }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  prefix={<DollarOutlined />}
                  placeholder="请输入课筹单价"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="课程描述"
            rules={[{ required: false, message: '请输入课程描述' }]}
          >
            <TextArea rows={4} placeholder="请输入课程描述" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="删除课程"
        open={deleteModalVisible}
        onOk={() => handleDeleteCourse(courseToDelete)}
        onCancel={() => setDeleteModalVisible(false)}
        okText="确认删除"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <p>确定要删除课程 <strong>{deletingCourseName}</strong> 吗？</p>
        <p>此操作不可恢复，删除后数据将无法找回。</p>
      </Modal>
    </div>
  );
};

export default CourseManagement; 