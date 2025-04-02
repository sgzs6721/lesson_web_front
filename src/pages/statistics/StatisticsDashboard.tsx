import { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Select,
  DatePicker,
  Spin,
  Tabs,
  Table,
  Progress,
  Button,
  Space
} from 'antd';
import {
  TeamOutlined,
  UserOutlined,
  RiseOutlined,
  FallOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  CalendarOutlined,
  BookOutlined,
  BankOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const StatisticsDashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<string>('week');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(7, 'day'),
    dayjs()
  ]);
  const [selectedCampus, setSelectedCampus] = useState<string>('all');

  // 模拟校区选项
  const campusOptions = [
    { value: 'all', label: '全部校区' },
    { value: 'campus1', label: '北京中关村校区' },
    { value: 'campus2', label: '北京望京校区' },
    { value: 'campus3', label: '上海徐汇校区' },
    { value: 'campus4', label: '上海浦东校区' },
    { value: 'campus5', label: '广州天河校区' },
  ];

  useEffect(() => {
    fetchData();
  }, [timeRange, dateRange, selectedCampus]);

  // 模拟获取数据
  const fetchData = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (error) {
      console.error('Failed to fetch statistics data', error);
    } finally {
      setLoading(false);
    }
  };

  // 处理时间范围变更
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    
    let start: dayjs.Dayjs;
    const end = dayjs();
    
    switch (value) {
      case 'week':
        start = dayjs().subtract(7, 'day');
        break;
      case 'month':
        start = dayjs().subtract(1, 'month');
        break;
      case 'quarter':
        start = dayjs().subtract(3, 'month');
        break;
      case 'year':
        start = dayjs().subtract(1, 'year');
        break;
      default:
        start = dayjs().subtract(7, 'day');
    }
    
    setDateRange([start, end]);
  };

  // 处理校区选择变更
  const handleCampusChange = (value: string) => {
    setSelectedCampus(value);
  };

  // 模拟学员增长数据
  const getStudentGrowth = () => {
    const prevValue = 2345;
    const currentValue = 2456;
    const growth = ((currentValue - prevValue) / prevValue) * 100;
    return {
      value: currentValue,
      growth: growth.toFixed(1),
      isIncrease: growth > 0
    };
  };

  // 模拟收入数据
  const getIncomeData = () => {
    const prevValue = 168500;
    const currentValue = 189200;
    const growth = ((currentValue - prevValue) / prevValue) * 100;
    return {
      value: currentValue,
      growth: growth.toFixed(1),
      isIncrease: growth > 0
    };
  };

  // 模拟课程数据
  const getCourseData = () => {
    const prevValue = 145;
    const currentValue = 152;
    const growth = ((currentValue - prevValue) / prevValue) * 100;
    return {
      value: currentValue,
      growth: growth.toFixed(1),
      isIncrease: growth > 0
    };
  };

  // 模拟校区数据
  const getCampusData = () => {
    return {
      value: 12,
      growth: '0.0',
      isIncrease: false
    };
  };

  // 模拟校区出勤率数据
  const attendanceData = [
    { campus: '北京中关村校区', rate: 92 },
    { campus: '上海徐汇校区', rate: 88 },
    { campus: '广州天河校区', rate: 95 },
    { campus: '深圳南山校区', rate: 90 },
    { campus: '杭州西湖校区', rate: 86 },
  ];

  // 模拟课程排名数据
  const courseRankData = [
    { name: '青少年篮球训练A班', students: 120, income: 96000, courses: 48 },
    { name: '网球精英班', students: 85, income: 76500, courses: 34 },
    { name: '少儿游泳入门班', students: 150, income: 90000, courses: 60 },
    { name: '成人健身基础班', students: 95, income: 66500, courses: 38 },
    { name: '瑜伽初级班', students: 110, income: 77000, courses: 44 },
  ];

  // 获取各项指标数据
  const studentGrowth = getStudentGrowth();
  const incomeData = getIncomeData();
  const courseData = getCourseData();
  const campusData = getCampusData();

  // 表格列配置 - 课程排名
  const courseRankColumns = [
    {
      title: '课程名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '学员人数',
      dataIndex: 'students',
      key: 'students',
      sorter: (a: any, b: any) => a.students - b.students,
    },
    {
      title: '收入(元)',
      dataIndex: 'income',
      key: 'income',
      render: (income: number) => `¥${income.toLocaleString()}`,
      sorter: (a: any, b: any) => a.income - b.income,
    },
    {
      title: '课程数量',
      dataIndex: 'courses',
      key: 'courses',
      sorter: (a: any, b: any) => a.courses - b.courses,
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="statistics-dashboard">
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4}>统计分析</Title>
        </Col>
        <Col>
          <Space>
            <Select
              value={selectedCampus}
              onChange={handleCampusChange}
              style={{ width: 180 }}
            >
              {campusOptions.map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </Select>
            <Select
              value={timeRange}
              onChange={handleTimeRangeChange}
              style={{ width: 120 }}
            >
              <Option value="week">最近一周</Option>
              <Option value="month">最近一月</Option>
              <Option value="quarter">最近一季度</Option>
              <Option value="year">最近一年</Option>
            </Select>
            <RangePicker
              value={[dateRange[0], dateRange[1]]}
              onChange={(dates) => {
                if (dates && dates[0] && dates[1]) {
                  setDateRange([dates[0], dates[1]]);
                }
              }}
            />
            <Button type="primary" icon={<DownloadOutlined />}>
              导出报表
            </Button>
          </Space>
        </Col>
      </Row>

      {/* 核心指标卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="学员总数"
              value={studentGrowth.value}
              valueStyle={{ color: '#4a6cf7' }}
              prefix={<TeamOutlined />}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <div style={{ 
                backgroundColor: '#4a6cf722', 
                color: '#4a6cf7',
                padding: '8px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40
              }}>
                <TeamOutlined />
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {studentGrowth.isIncrease ? (
                  <RiseOutlined style={{ color: '#52c41a', marginRight: 4 }} />
                ) : (
                  <FallOutlined style={{ color: '#f5222d', marginRight: 4 }} />
                )}
                <span style={{ 
                  color: studentGrowth.isIncrease ? '#52c41a' : '#f5222d' 
                }}>
                  {studentGrowth.isIncrease ? '+' : ''}{studentGrowth.growth}%
                </span>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="总收入(元)"
              value={incomeData.value}
              valueStyle={{ color: '#52c41a' }}
              prefix="¥"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <div style={{ 
                backgroundColor: '#52c41a22', 
                color: '#52c41a',
                padding: '8px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40
              }}>
                <RiseOutlined />
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {incomeData.isIncrease ? (
                  <RiseOutlined style={{ color: '#52c41a', marginRight: 4 }} />
                ) : (
                  <FallOutlined style={{ color: '#f5222d', marginRight: 4 }} />
                )}
                <span style={{ 
                  color: incomeData.isIncrease ? '#52c41a' : '#f5222d' 
                }}>
                  {incomeData.isIncrease ? '+' : ''}{incomeData.growth}%
                </span>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="课程数"
              value={courseData.value}
              valueStyle={{ color: '#6c757d' }}
              prefix={<BookOutlined />}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <div style={{ 
                backgroundColor: '#6c757d22', 
                color: '#6c757d',
                padding: '8px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40
              }}>
                <BookOutlined />
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {courseData.isIncrease ? (
                  <RiseOutlined style={{ color: '#52c41a', marginRight: 4 }} />
                ) : (
                  <FallOutlined style={{ color: '#f5222d', marginRight: 4 }} />
                )}
                <span style={{ 
                  color: courseData.isIncrease ? '#52c41a' : '#f5222d' 
                }}>
                  {courseData.isIncrease ? '+' : ''}{courseData.growth}%
                </span>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="校区数"
              value={campusData.value}
              valueStyle={{ color: '#f39c12' }}
              prefix={<BankOutlined />}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <div style={{ 
                backgroundColor: '#f39c1222', 
                color: '#f39c12',
                padding: '8px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40
              }}>
                <BankOutlined />
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#8c8c8c' }}>
                  {campusData.growth}%
                </span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Tabs defaultActiveKey="overview" style={{ marginBottom: 16 }}>
        <TabPane tab="总览" key="overview">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <Card title="课程排名" extra={<BarChartOutlined />}>
                <Table 
                  dataSource={courseRankData} 
                  columns={courseRankColumns} 
                  pagination={false} 
                  rowKey="name"
                />
              </Card>
            </Col>
            
            <Col xs={24} lg={8}>
              <Card title="校区出勤率" extra={<CalendarOutlined />}>
                {attendanceData.map((item, index) => (
                  <div key={index} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span>{item.campus}</span>
                      <span>{item.rate}%</span>
                    </div>
                    <Progress 
                      percent={item.rate} 
                      showInfo={false} 
                      strokeColor={item.rate >= 90 ? '#52c41a' : item.rate >= 80 ? '#1890ff' : '#faad14'} 
                    />
                  </div>
                ))}
              </Card>
            </Col>
          </Row>
        </TabPane>
        
        <TabPane tab="学员分析" key="student">
          <Card>
            <Text>学员分析内容 - 此处会展示学员增长趋势、年龄分布、性别比例等数据</Text>
          </Card>
        </TabPane>
        
        <TabPane tab="收入分析" key="income">
          <Card>
            <Text>收入分析内容 - 此处会展示收入趋势、各课程收入占比、各校区收入占比等数据</Text>
          </Card>
        </TabPane>
        
        <TabPane tab="课程分析" key="course">
          <Card>
            <Text>课程分析内容 - 此处会展示课程热度排行、各类型课程占比、课程满班率等数据</Text>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default StatisticsDashboard; 