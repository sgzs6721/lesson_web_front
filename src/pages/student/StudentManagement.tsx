import { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Button,
  Input,
  Select,
  DatePicker,
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
  Divider
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
  ImportOutlined,
  ReloadOutlined,
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface Student {
  id: string;
  name: string;
  gender: 'male' | 'female';
  age: number;
  phone: string;
  parentName: string;
  parentPhone: string;
  address: string;
  courses: string[];
  enrollDate: string;
  status: 'active' | 'inactive' | 'pending';
}

const StudentManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form] = Form.useForm();

  // 模拟课程列表
  const courseOptions = [
    { value: 'basketball', label: '篮球训练' },
    { value: 'swimming', label: '游泳课程' },
    { value: 'tennis', label: '网球培训' },
    { value: 'art', label: '美术班' },
    { value: 'piano', label: '钢琴培训' },
    { value: 'dance', label: '舞蹈课程' },
  ];

  useEffect(() => {
    fetchStudents();
  }, [currentPage, pageSize, searchText, selectedStatus, selectedCourse, dateRange]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 生成测试数据
      const mockData: Student[] = Array(50)
        .fill(null)
        .map((_, index) => ({
          id: `ST${100000 + index}`,
          name: `学员${index + 1}`,
          gender: index % 2 === 0 ? 'male' : 'female',
          age: 6 + (index % 15),
          phone: `13${String(9000000000 + index).substring(0, 10)}`,
          parentName: `家长${index + 1}`,
          parentPhone: `13${String(8000000000 + index).substring(0, 10)}`,
          address: `北京市朝阳区建国路${index + 1}号`,
          courses: [
            courseOptions[index % 3].value,
            courseOptions[(index + 2) % 6].value,
          ],
          enrollDate: dayjs().subtract(index % 180, 'day').format('YYYY-MM-DD'),
          status: index % 5 === 0 ? 'pending' : index % 7 === 0 ? 'inactive' : 'active',
        }));

      // 过滤数据
      let filteredData = mockData;
      
      if (searchText) {
        filteredData = filteredData.filter(
          student => 
            student.name.includes(searchText) || 
            student.id.includes(searchText) ||
            student.phone.includes(searchText) ||
            student.parentName.includes(searchText) ||
            student.parentPhone.includes(searchText)
        );
      }
      
      if (selectedStatus) {
        filteredData = filteredData.filter(student => student.status === selectedStatus);
      }
      
      if (selectedCourse) {
        filteredData = filteredData.filter(student => 
          student.courses.includes(selectedCourse)
        );
      }
      
      if (dateRange && dateRange[0] && dateRange[1]) {
        const startDate = dateRange[0].format('YYYY-MM-DD');
        const endDate = dateRange[1].format('YYYY-MM-DD');
        filteredData = filteredData.filter(student => 
          student.enrollDate >= startDate && student.enrollDate <= endDate
        );
      }

      // 分页
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      const paginatedData = filteredData.slice(start, end);
      
      setTotal(filteredData.length);
      setStudents(paginatedData);
    } catch (error) {
      message.error('获取学员列表失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchText('');
    setSelectedStatus('');
    setSelectedCourse('');
    setDateRange(null);
    setCurrentPage(1);
    fetchStudents();
  };

  const showAddModal = () => {
    form.resetFields();
    setEditingStudent(null);
    setIsModalVisible(true);
  };
  
  const showEditModal = (record: Student) => {
    setEditingStudent(record);
    form.setFieldsValue({
      ...record,
      enrollDate: dayjs(record.enrollDate),
    });
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields()
      .then(values => {
        const formattedValues = {
          ...values,
          enrollDate: values.enrollDate.format('YYYY-MM-DD'),
        };

        if (editingStudent) {
          // 编辑现有学员
          setStudents(prevStudents => 
            prevStudents.map(student => 
              student.id === editingStudent.id 
                ? { ...student, ...formattedValues } 
                : student
            )
          );
          message.success('学员信息已更新');
        } else {
          // 添加新学员
          const newStudent: Student = {
            id: `ST${100000 + Math.floor(Math.random() * 900000)}`,
            ...formattedValues,
          };
          setStudents(prevStudents => [newStudent, ...prevStudents]);
          setTotal(prev => prev + 1);
          message.success('学员添加成功');
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

  const handleDeleteStudent = (id: string) => {
    setStudents(students.filter(student => student.id !== id));
    setTotal(prev => prev - 1);
    message.success('学员已删除');
  };

  const columns: ColumnsType<Student> = [
    {
      title: '学员ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <span>
          {text} 
          {record.gender === 'male' ? 
            <span style={{ color: '#1890ff', marginLeft: 5 }}>♂</span> : 
            <span style={{ color: '#eb2f96', marginLeft: 5 }}>♀</span>
          }
        </span>
      ),
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: 80,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '家长信息',
      key: 'parent',
      render: (_, record) => (
        <span>{record.parentName} ({record.parentPhone})</span>
      ),
    },
    {
      title: '课程',
      key: 'courses',
      render: (_, record) => (
        <>
          {record.courses.map(course => {
            const courseInfo = courseOptions.find(option => option.value === course);
            return (
              <Tag color="blue" key={course}>
                {courseInfo?.label || course}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: '入学日期',
      dataIndex: 'enrollDate',
      key: 'enrollDate',
      render: text => dayjs(text).format('YYYY-MM-DD'),
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
            text = '在学';
            break;
          case 'inactive':
            color = 'red';
            text = '停课';
            break;
          case 'pending':
            color = 'orange';
            text = '待处理';
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
              title="确定要删除此学员吗？"
              onConfirm={() => handleDeleteStudent(record.id)}
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
    <div className="student-management">
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4}>学员管理</Title>
        </Col>
        <Col>
          <Space>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={showAddModal}
            >
              添加学员
            </Button>
            <Button icon={<ImportOutlined />}>导入</Button>
            <Button icon={<ExportOutlined />}>导出</Button>
          </Space>
        </Col>
      </Row>

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6} lg={6}>
            <Input
              placeholder="搜索学员名称/ID/电话"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6} lg={5}>
            <Select
              placeholder="选择状态"
              style={{ width: '100%' }}
              value={selectedStatus}
              onChange={value => setSelectedStatus(value)}
              allowClear
            >
              <Option value="active">在学</Option>
              <Option value="inactive">停课</Option>
              <Option value="pending">待处理</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6} lg={5}>
            <Select
              placeholder="选择课程"
              style={{ width: '100%' }}
              value={selectedCourse}
              onChange={value => setSelectedCourse(value)}
              allowClear
            >
              {courseOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6} lg={6}>
            <RangePicker
              style={{ width: '100%' }}
              placeholder={['入学开始日期', '入学结束日期']}
              value={dateRange}
              onChange={dates => setDateRange(dates)}
            />
          </Col>
          <Col xs={24} sm={24} md={24} lg={2} style={{ textAlign: 'right' }}>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              重置
            </Button>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={students}
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
        title={editingStudent ? '编辑学员' : '添加学员'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={700}
        okText={editingStudent ? '保存' : '添加'}
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          name="studentForm"
          initialValues={{
            gender: 'male',
            status: 'active',
            enrollDate: dayjs(),
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="学员姓名"
                rules={[{ required: true, message: '请输入学员姓名' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="请输入学员姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="gender"
                label="性别"
                rules={[{ required: true, message: '请选择性别' }]}
              >
                <Select placeholder="请选择">
                  <Option value="male">男</Option>
                  <Option value="female">女</Option>
                </Select>
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
                name="parentName"
                label="家长姓名"
                rules={[{ required: true, message: '请输入家长姓名' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="请输入家长姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="parentPhone"
                label="家长电话"
                rules={[{ required: true, message: '请输入家长电话' }]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="请输入家长电话" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="address"
            label="家庭住址"
          >
            <Input prefix={<EnvironmentOutlined />} placeholder="请输入家庭住址" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="courses"
                label="报名课程"
                rules={[{ required: true, message: '请选择至少一门课程' }]}
              >
                <Select 
                  mode="multiple" 
                  placeholder="请选择课程"
                  optionLabelProp="label"
                >
                  {courseOptions.map(option => (
                    <Option key={option.value} value={option.value} label={option.label}>
                      <div>
                        <TeamOutlined /> {option.label}
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select placeholder="请选择">
                  <Option value="active">在学</Option>
                  <Option value="inactive">停课</Option>
                  <Option value="pending">待处理</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="enrollDate"
            label="入学日期"
            rules={[{ required: true, message: '请选择入学日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StudentManagement; 