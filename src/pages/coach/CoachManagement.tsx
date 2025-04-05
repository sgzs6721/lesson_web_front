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
  Radio,
  DatePicker,
  Avatar,
  List
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
  ClockCircleOutlined,
  TableOutlined,
  AppstoreOutlined,
  SortAscendingOutlined,
  ReloadOutlined // 添加 ReloadOutlined 图标
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// 添加性别类型定义
type Gender = 'male' | 'female';

// 修改头像数据组织方式，区分男女
const avatarOptions: Record<Gender, Array<{id: string, url: string}>> = {
  male: Array(15).fill(null).map((_, index) => ({
    id: `male_avatar_${index + 1}`,
    url: `https://randomuser.me/api/portraits/men/${index}.jpg`
  })),
  female: Array(15).fill(null).map((_, index) => ({
    id: `female_avatar_${index + 1}`,
    url: `https://randomuser.me/api/portraits/women/${index}.jpg`
  }))
};

// 修改教练接口，更新性别类型
interface Coach {
  id: string;
  name: string;
  gender: Gender;
  age: number;
  phone: string;
  avatar?: string;
  jobTitle: string;
  certifications: string;
  experience: number;
  status: 'active' | 'vacation' | 'resigned';
  hireDate: string;
}

type ViewMode = 'table' | 'card';
type SortField = 'experience' | 'hireDate' | 'none';

const CoachManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined); // 明确类型并设为 undefined
  const [sortField, setSortField] = useState<SortField>('none');
  const [selectedJobTitle, setSelectedJobTitle] = useState<string | undefined>(undefined); // 明确类型并设为 undefined
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCoach, setEditingCoach] = useState<Coach | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [form] = Form.useForm();

  // 模拟获取教练数据 - 初始加载
  useEffect(() => {
    fetchCoaches();
  }, []); // 初始加载时调用一次

  // 分页变化时重新获取数据
  useEffect(() => {
    // 仅在分页变化时自动获取，其他过滤条件通过查询按钮触发
    // 注意：如果希望分页也通过查询按钮触发，可以移除此 useEffect 或调整逻辑
    // fetchCoaches(); // 暂时注释掉，让分页也通过查询触发，如果需要分页自动加载则取消注释
  }, [currentPage, pageSize]);

  const fetchCoaches = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 生成测试数据
      const mockData: Coach[] = Array(50)
        .fill(null)
        .map((_, index) => {
          return {
            id: `C${10000 + index}`,
            name: `教练${index + 1}`,
            gender: index % 2 === 0 ? 'male' : 'female',
            age: 25 + (index % 20),
            phone: `13${String(9000000000 + index).substring(0, 10)}`,
            avatar: `https://randomuser.me/api/portraits/${index % 2 === 0 ? 'men' : 'women'}/${index % 15}.jpg`,
            jobTitle: index % 5 === 0 ? '高级教练' : index % 3 === 0 ? '中级教练' : '初级教练',
            certifications: index % 3 === 0 ? '国家体育教练员证' : index % 2 === 0 ? '急救证，专业教练认证' : '健身教练证',
            experience: 1 + (index % 15),
            status: index % 7 === 0 ? 'vacation' : index % 11 === 0 ? 'resigned' : 'active',
            hireDate: dayjs().subtract(index % 1000, 'day').format('YYYY-MM-DD'),
          };
        });

      // 过滤数据
      let filteredData = mockData;
      
      if (searchText) {
        filteredData = filteredData.filter(
          coach => 
            coach.name.includes(searchText) || 
            coach.id.includes(searchText) ||
            coach.phone.includes(searchText)
        );
      }
      
      if (selectedStatus) {
        filteredData = filteredData.filter(coach => coach.status === selectedStatus);
      }

      // 添加职位过滤
      if (selectedJobTitle) {
        filteredData = filteredData.filter(coach => coach.jobTitle === selectedJobTitle);
      }

      // 排序
      if (sortField !== 'none') {
        filteredData = [...filteredData].sort((a, b) => {
          if (sortField === 'experience') {
            return b.experience - a.experience;
          } else if (sortField === 'hireDate') {
            return dayjs(a.hireDate).isAfter(dayjs(b.hireDate)) ? -1 : 1;
          }
          return 0;
        });
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
    setSelectedStatus(undefined); // 重置为 undefined (保持不变)
    setSelectedJobTitle(undefined); // 重置职位为 undefined (保持不变)
    setSortField('none');
    setCurrentPage(1); // 重置到第一页
    // fetchCoaches(); // 移除自动调用，查询通过按钮触发
    // 如果希望重置后立即看到结果，可以取消下面一行的注释
    // fetchCoaches();
  };

  // 显示添加教练模态框
  const showAddModal = () => {
    form.resetFields();
    setSelectedAvatar('');
    setEditingCoach(null);
    setIsModalVisible(true);
  };
  
  // 显示编辑教练模态框
  const showEditModal = (record: Coach) => {
    // 将逗号分隔的证书转换为多行文本
    const formValues = {
      ...record,
      hireDate: dayjs(record.hireDate),
    };
    
    if (record.certifications) {
      formValues.certifications = record.certifications.split('，').join('\n');
    }
    
    setEditingCoach(record);
    form.setFieldsValue(formValues);
    
    if (record.avatar) {
      setSelectedAvatar(record.avatar);
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
        if (selectedAvatar) {
          formattedValues.avatar = selectedAvatar;
        }
        
        // 处理证书文本，将多行转为逗号分隔的格式存储
        if (values.certifications) {
          formattedValues.certifications = values.certifications
            .split('\n')
            .filter((cert: string) => cert.trim() !== '')
            .join('，');
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

  // 选择头像
  const handleAvatarSelect = (avatar: string) => {
    setSelectedAvatar(avatar);
  };

  // 渲染状态标签
  const renderStatusTag = (status: string) => {
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
  };

  // 修改表格列配置，表头居中
  const columns: ColumnsType<Coach> = [
    {
      title: '教练ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      align: 'center',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
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
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: 80,
      align: 'center',
    },
    {
      title: '职位',
      dataIndex: 'jobTitle',
      key: 'jobTitle',
      align: 'center',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
      align: 'center',
      render: (phone) => (
        <div>{phone}</div>
      ),
    },
    {
      title: '入职日期',
      dataIndex: 'hireDate',
      key: 'hireDate',
      align: 'center',
      render: text => dayjs(text).format('YYYY-MM-DD'),
    },
    {
      title: '教龄',
      dataIndex: 'experience',
      key: 'experience',
      align: 'center',
      render: (years) => `${years}年`,
    },
    {
      title: '证书',
      dataIndex: 'certifications',
      key: 'certifications',
      ellipsis: true,
      width: 200,
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: renderStatusTag,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
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

  // 修改选择性别的处理函数，自动设置默认头像
  const handleGenderChange = (e: any) => {
    const gender = e.target.value as Gender;
    // 选择该性别的第一个头像作为默认头像
    const defaultAvatar = avatarOptions[gender][0].url;
    setSelectedAvatar(defaultAvatar);
    // 更新表单中的性别字段
    form.setFieldValue('gender', gender);
  };

  // 渲染卡片视图
  const renderCardView = () => {
    return (
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 2,
          lg: 3,
          xl: 3,
          xxl: 3,
        }}
        dataSource={coaches}
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
        renderItem={(coach) => (
          <List.Item>
            <Card 
              hoverable
              style={{ width: '100%', height: '100%' }}
              actions={[
                <Tooltip title="编辑">
                  <EditOutlined key="edit" onClick={() => showEditModal(coach)} />
                </Tooltip>,
                <Tooltip title="删除">
                  <Popconfirm
                    title="确定要删除此教练吗？"
                    onConfirm={() => handleDeleteCoach(coach.id)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <DeleteOutlined key="delete" />
                  </Popconfirm>
                </Tooltip>,
              ]}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar 
                  size={64} 
                  src={coach.avatar}
                  style={{ marginRight: 16 }}
                />
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <Row gutter={[8, 4]}>
                    <Col span={14}>
                      <div style={{ fontWeight: 'bold', fontSize: 16, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {coach.name}
                        {coach.gender === 'male' ? 
                          <span style={{ color: '#1890ff', marginLeft: 5 }}>♂</span> : 
                          <span style={{ color: '#eb2f96', marginLeft: 5 }}>♀</span>
                        }
                        <span style={{ fontWeight: 'normal', fontSize: 14, marginLeft: 8 }}>{coach.age}岁</span>
                      </div>
                      <div style={{ color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{coach.jobTitle}</div>
                    </Col>
                    <Col span={10} style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 12 }}>ID: {coach.id}</div>
                      <div>{renderStatusTag(coach.status)}</div>
                    </Col>
                  </Row>
                  <Divider style={{ margin: '8px 0' }} />
                  <div style={{ fontSize: 12 }}>
                    <div style={{ marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <PhoneOutlined style={{ marginRight: 4 }} />{coach.phone}
                    </div>
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <ClockCircleOutlined style={{ marginRight: 4 }} />教龄：{coach.experience}年
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </List.Item>
        )}
      />
    );
  };

  return (
    <div className="coach-management">
      {/* 将视图切换和添加按钮移回标题行 */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4}>教练管理</Title>
        </Col>
        <Col>
          <Space>
            <Radio.Group
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              buttonStyle="solid"
            >
              <Radio.Button value="table"><TableOutlined /> 表格视图</Radio.Button>
              <Radio.Button value="card"><AppstoreOutlined /> 卡片视图</Radio.Button>
            </Radio.Group>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={showAddModal}
            >
              添加教练
            </Button>
          </Space>
        </Col>
      </Row>
      
      <Card>
        {/* 过滤条件区域 - 使用 Flex 布局实现均匀分布 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap' }}>
          {/* 移除 Col 的 span 属性，使用 flex: 1 */}
          <Col style={{ flex: 1, minWidth: '150px' }}> {/* 添加 minWidth 避免过窄 */}
            <Input
              placeholder="搜索教练姓名/ID/电话"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Col>
          <Col style={{ flex: 1, minWidth: '120px' }}>
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
          <Col style={{ flex: 1, minWidth: '120px' }}>
            <Select
              placeholder="选择职位"
              style={{ width: '100%' }}
              value={selectedJobTitle}
              onChange={value => setSelectedJobTitle(value)}
              allowClear
            >
              <Option value="高级教练">高级教练</Option>
              <Option value="中级教练">中级教练</Option>
              <Option value="初级教练">初级教练</Option>
            </Select>
          </Col>
          <Col style={{ flex: 1, minWidth: '150px' }}>
            <Select
              placeholder="排序方式"
              style={{ width: '100%' }}
              value={sortField}
              onChange={value => setSortField(value)}
              allowClear
            >
              <Option value="none">默认排序</Option>
              <Option value="experience">按教龄排序</Option>
              <Option value="hireDate">按入职日期排序</Option>
            </Select>
          </Col>
          {/* 按钮组稍微调整，使其在 flex 布局下表现更好 */}
          <Col style={{ flex: 'none' }}> {/* 让按钮组根据内容自适应宽度 */}
             <Space>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={fetchCoaches}
              >
                查询
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleReset}
              >
                重置
              </Button>
            </Space>
          </Col>
        </Row>

        {/* 表格或卡片视图 */}
        {viewMode === 'table' ? (
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
                // 如果希望分页变化时自动查询，取消下一行的注释
                // fetchCoaches();
              },
            }}
          />
        ) : (
          renderCardView() // 卡片视图的分页逻辑在 renderCardView 内部处理
        )}
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
        <Divider style={{ margin: '0 0 24px 0' }} />
        <Form
          form={form}
          layout="vertical"
          name="coachForm"
          initialValues={{
            status: 'active',
            experience: 1,
            age: 25,
            performanceBonus: 0,
            commission: 0,
            dividend: 0,
          }}
        >
          <Divider orientation="left">基本信息</Divider>
          
          <Row gutter={24} justify="space-between">
            <Col span={16}>
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
                    <Radio.Group onChange={handleGenderChange}>
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
                name="certifications"
                label="持有证书"
                extra="每行输入一个证书"
              >
                <TextArea rows={4} placeholder="请输入持有的证书，每行一个" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Row>
                <Col span={24}>
                  <Form.Item label="选择头像">
                    <div style={{ textAlign: 'center', marginBottom: 16 }}>
                      <Avatar
                        size={100}
                        src={selectedAvatar}
                        style={{ marginBottom: 16 }}
                      />
                    </div>
                    <div style={{ height: 310, overflow: 'auto', border: '1px solid #d9d9d9', borderRadius: 2, padding: 8 }}>
                      <div>
                        <div style={{ fontWeight: 'bold', marginBottom: 8 }}>男性头像</div>
                        <Row gutter={[8, 8]} justify="space-between">
                          {avatarOptions.male.map(avatar => (
                            <Col span={7} key={avatar.id} style={{ marginBottom: 12 }}>
                              <Avatar
                                size={48}
                                src={avatar.url}
                                style={{ 
                                  cursor: 'pointer',
                                  border: selectedAvatar === avatar.url ? '2px solid #1890ff' : 'none'
                                }}
                                onClick={() => handleAvatarSelect(avatar.url)}
                              />
                            </Col>
                          ))}
                        </Row>
                        
                        <Divider style={{ margin: '12px 0' }} />
                        
                        <div style={{ fontWeight: 'bold', marginBottom: 8 }}>女性头像</div>
                        <Row gutter={[8, 8]} justify="space-between">
                          {avatarOptions.female.map(avatar => (
                            <Col span={7} key={avatar.id} style={{ marginBottom: 12 }}>
                              <Avatar
                                size={48}
                                src={avatar.url}
                                style={{ 
                                  cursor: 'pointer',
                                  border: selectedAvatar === avatar.url ? '2px solid #1890ff' : 'none'
                                }}
                                onClick={() => handleAvatarSelect(avatar.url)}
                              />
                            </Col>
                          ))}
                        </Row>
                      </div>
                    </div>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
          
          <Divider orientation="left" style={{ marginTop: 16 }}>薪资信息</Divider>
          
          <Row gutter={[16, 0]}>
            <Col span={8}>
              <Form.Item
                name="baseSalary"
                label="基本工资"
                rules={[{ required: true, message: '请输入基本工资' }]}
              >
                <Input type="number" placeholder="请输入基本工资" prefix="¥" suffix="元" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="socialSecurity"
                label="社保费"
                rules={[{ required: true, message: '请输入社保费' }]}
              >
                <Input type="number" placeholder="请输入社保费" prefix="¥" suffix="元" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="hourlyRate"
                label="课时费"
                rules={[{ required: true, message: '请输入课时费' }]}
              >
                <Input type="number" placeholder="请输入课时费" prefix="¥" suffix="元/时" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 0]}>
            <Col span={8}>
              <Form.Item
                name="performanceBonus"
                label="绩效奖金"
                rules={[{ required: true, message: '请输入绩效奖金' }]}
              >
                <Input type="number" placeholder="请输入绩效奖金" prefix="¥" suffix="元" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="commission"
                label="提成"
                rules={[{ required: true, message: '请输入提成' }]}
              >
                <Input type="number" placeholder="请输入提成比例" suffix="%" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="dividend"
                label="分红"
                rules={[{ required: true, message: '请输入分红' }]}
              >
                <Input type="number" placeholder="请输入分红" prefix="¥" suffix="元" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default CoachManagement; 