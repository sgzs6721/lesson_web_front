import { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Button,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  Typography,
  Tag,
  Space,
  Tooltip,
  Badge,
  Statistic,
  Tabs
} from 'antd';
import {
  SearchOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FieldTimeOutlined,
  TeamOutlined,
  UserOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

// 定义考勤数据类型
interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  coachId: string;
  coachName: string;
  campusId: string;
  campusName: string;
  scheduleId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'present' | 'absent' | 'late' | 'leave';
  checkInTime?: string;
  checkOutTime?: string;
  remarks?: string;
}

// 出勤状态文本
const statusTextMap = {
  present: '已到',
  absent: '缺席',
  late: '迟到',
  leave: '请假'
};

// 出勤状态颜色
const statusColorMap = {
  present: 'success',
  absent: 'error',
  late: 'warning',
  leave: 'default'
};

const AttendanceManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [filteredData, setFilteredData] = useState<AttendanceRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedCampus, setSelectedCampus] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [activeTab, setActiveTab] = useState('records');

  // 模拟课程数据
  const courseOptions = [
    { value: 'c1', label: '青少年篮球训练A班' },
    { value: 'c2', label: '网球精英班' },
    { value: 'c3', label: '少儿游泳入门班' },
    { value: 'c4', label: '成人健身基础班' },
    { value: 'c5', label: '瑜伽初级班' },
  ];

  // 模拟校区数据
  const campusOptions = [
    { value: 'campus1', label: '北京中关村校区' },
    { value: 'campus2', label: '北京望京校区' },
    { value: 'campus3', label: '上海徐汇校区' },
    { value: 'campus4', label: '上海浦东校区' },
    { value: 'campus5', label: '广州天河校区' },
  ];

  useEffect(() => {
    fetchAttendanceData();
  }, [currentPage, pageSize]);

  useEffect(() => {
    filterData();
  }, [attendanceData, searchText, selectedCourse, selectedCampus, selectedStatus, dateRange]);

  // 模拟获取考勤数据
  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 生成测试数据
      const today = dayjs();
      const mockData: AttendanceRecord[] = [];

      for (let i = 0; i < 100; i++) {
        const date = today.subtract(i % 30, 'day');
        const courseIndex = i % 5;
        const campusIndex = i % 5;
        const status = i % 10 === 0 ? 'absent' : i % 7 === 0 ? 'late' : i % 11 === 0 ? 'leave' : 'present';
        
        // 生成打卡时间
        let checkInTime;
        let checkOutTime;
        
        if (status === 'present') {
          checkInTime = '08:55';
          checkOutTime = '10:25';
        } else if (status === 'late') {
          checkInTime = '09:15';
          checkOutTime = '10:25';
        } else if (status === 'leave') {
          checkInTime = undefined;
          checkOutTime = undefined;
        } else {
          checkInTime = undefined;
          checkOutTime = undefined;
        }

        mockData.push({
          id: `A${10000 + i}`,
          studentId: `S${20000 + (i % 50)}`,
          studentName: `学员${(i % 50) + 1}`,
          courseId: courseOptions[courseIndex].value,
          courseName: courseOptions[courseIndex].label,
          coachId: `coach${(i % 5) + 1}`,
          coachName: `教练${(i % 5) + 1}`,
          campusId: campusOptions[campusIndex].value,
          campusName: campusOptions[campusIndex].label,
          scheduleId: `SCH${30000 + i}`,
          date: date.format('YYYY-MM-DD'),
          startTime: '09:00',
          endTime: '10:30',
          status,
          checkInTime,
          checkOutTime,
          remarks: status === 'leave' ? '家长请假' : status === 'absent' ? '未到课' : undefined,
        });
      }

      setAttendanceData(mockData);
      setTotal(mockData.length);
    } catch (error) {
      console.error('Failed to fetch attendance data', error);
    } finally {
      setLoading(false);
    }
  };

  // 过滤数据
  const filterData = () => {
    let filtered = [...attendanceData];
    
    if (searchText) {
      filtered = filtered.filter(
        record => 
          record.studentName.includes(searchText) || 
          record.studentId.includes(searchText) ||
          record.courseName.includes(searchText)
      );
    }
    
    if (selectedCourse) {
      filtered = filtered.filter(record => record.courseId === selectedCourse);
    }
    
    if (selectedCampus) {
      filtered = filtered.filter(record => record.campusId === selectedCampus);
    }
    
    if (selectedStatus) {
      filtered = filtered.filter(record => record.status === selectedStatus);
    }
    
    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].format('YYYY-MM-DD');
      const endDate = dateRange[1].format('YYYY-MM-DD');
      filtered = filtered.filter(record => 
        record.date >= startDate && record.date <= endDate
      );
    }
    
    // 分页
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const paginatedData = filtered.slice(start, end);
    
    setFilteredData(paginatedData);
    setTotal(filtered.length);
  };

  // 重置筛选条件
  const handleReset = () => {
    setSearchText('');
    setSelectedCourse('');
    setSelectedCampus('');
    setSelectedStatus('');
    setDateRange(null);
    setCurrentPage(1);
  };

  // 获取考勤统计信息
  const getStatistics = () => {
    const total = attendanceData.length;
    const present = attendanceData.filter(record => record.status === 'present').length;
    const absent = attendanceData.filter(record => record.status === 'absent').length;
    const late = attendanceData.filter(record => record.status === 'late').length;
    const leave = attendanceData.filter(record => record.status === 'leave').length;
    
    const presentRate = total > 0 ? Math.round((present / total) * 100) : 0;
    const absentRate = total > 0 ? Math.round((absent / total) * 100) : 0;
    const lateRate = total > 0 ? Math.round((late / total) * 100) : 0;
    const leaveRate = total > 0 ? Math.round((leave / total) * 100) : 0;
    
    return { total, present, absent, late, leave, presentRate, absentRate, lateRate, leaveRate };
  };

  // 表格列配置
  const columns: ColumnsType<AttendanceRecord> = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      render: text => dayjs(text).format('YYYY-MM-DD'),
    },
    {
      title: '时间',
      key: 'time',
      render: (_, record) => (
        <span>{record.startTime} - {record.endTime}</span>
      ),
    },
    {
      title: '学员',
      key: 'student',
      render: (_, record) => (
        <span>
          {record.studentName} ({record.studentId})
        </span>
      ),
    },
    {
      title: '课程',
      dataIndex: 'courseName',
      key: 'courseName',
    },
    {
      title: '校区',
      dataIndex: 'campusName',
      key: 'campusName',
    },
    {
      title: '教练',
      dataIndex: 'coachName',
      key: 'coachName',
    },
    {
      title: '出勤状态',
      key: 'status',
      render: (_, record) => (
        <Tag color={statusColorMap[record.status]}>
          {statusTextMap[record.status]}
        </Tag>
      ),
      filters: [
        { text: '已到', value: 'present' },
        { text: '缺席', value: 'absent' },
        { text: '迟到', value: 'late' },
        { text: '请假', value: 'leave' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '打卡记录',
      key: 'checkTime',
      render: (_, record) => {
        if (record.status === 'absent') {
          return <span>未打卡</span>;
        } else if (record.status === 'leave') {
          return <span>已请假</span>;
        } else {
          return (
            <>
              <div>
                <Badge status="success" text={`入场：${record.checkInTime || '--'}`} />
              </div>
              <div>
                <Badge status="warning" text={`离场：${record.checkOutTime || '--'}`} />
              </div>
            </>
          );
        }
      },
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
      render: text => text || '-',
    },
  ];

  const stats = getStatistics();

  return (
    <div className="attendance-management">
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4}>考勤管理</Title>
        </Col>
      </Row>

      <Tabs activeKey={activeTab} onChange={key => setActiveTab(key)}>
        <TabPane tab="考勤记录" key="records">
          <Card style={{ marginBottom: 16 }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6} lg={6}>
                <Input
                  placeholder="搜索学员姓名/ID/课程"
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  prefix={<SearchOutlined />}
                  allowClear
                />
              </Col>
              <Col xs={24} sm={12} md={6} lg={6}>
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
                <Select
                  placeholder="选择校区"
                  style={{ width: '100%' }}
                  value={selectedCampus}
                  onChange={value => setSelectedCampus(value)}
                  allowClear
                >
                  {campusOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={12} md={6} lg={6}>
                <Select
                  placeholder="选择出勤状态"
                  style={{ width: '100%' }}
                  value={selectedStatus}
                  onChange={value => setSelectedStatus(value)}
                  allowClear
                >
                  <Option value="present">已到</Option>
                  <Option value="absent">缺席</Option>
                  <Option value="late">迟到</Option>
                  <Option value="leave">请假</Option>
                </Select>
              </Col>
              <Col xs={24} md={12} lg={12}>
                <RangePicker
                  style={{ width: '100%' }}
                  value={dateRange}
                  onChange={dates => setDateRange(dates)}
                  placeholder={['开始日期', '结束日期']}
                />
              </Col>
              <Col xs={24} md={12} lg={12} style={{ textAlign: 'right' }}>
                <Button
                  icon={<SearchOutlined />}
                  onClick={handleReset}
                  style={{ marginRight: 8 }}
                >
                  重置
                </Button>
              </Col>
            </Row>
          </Card>

          <Card>
            <Table
              columns={columns}
              dataSource={filteredData}
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
        </TabPane>

        <TabPane tab="考勤统计" key="statistics">
          <Card>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6} lg={6}>
                <Card>
                  <Statistic
                    title="总考勤记录"
                    value={stats.total}
                    prefix={<TeamOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6} lg={6}>
                <Card>
                  <Statistic
                    title="出勤率"
                    value={stats.presentRate}
                    suffix="%"
                    prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6} lg={6}>
                <Card>
                  <Statistic
                    title="缺席率"
                    value={stats.absentRate}
                    suffix="%"
                    prefix={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
                    valueStyle={{ color: '#ff4d4f' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6} lg={6}>
                <Card>
                  <Statistic
                    title="迟到率"
                    value={stats.lateRate}
                    suffix="%"
                    prefix={<FieldTimeOutlined style={{ color: '#faad14' }} />}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
            </Row>

            <div style={{ marginTop: 24 }}>
              <Title level={5}>详细统计</Title>
              <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col span={6}>
                  <Statistic title="已到人次" value={stats.present} />
                </Col>
                <Col span={6}>
                  <Statistic title="缺席人次" value={stats.absent} />
                </Col>
                <Col span={6}>
                  <Statistic title="迟到人次" value={stats.late} />
                </Col>
                <Col span={6}>
                  <Statistic title="请假人次" value={stats.leave} />
                </Col>
              </Row>
            </div>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AttendanceManagement; 