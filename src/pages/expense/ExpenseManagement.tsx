import { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  DatePicker,
  Space,
  Modal,
  Form,
  message,
  Typography,
  Row,
  Col,
  Divider,
  Statistic,
  Tag,
  Popconfirm
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
  ImportOutlined,
  ReloadOutlined,
  DollarOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  description: string;
  paymentMethod: string;
  approvalStatus: 'approved' | 'pending' | 'rejected';
  submitter: string;
}

const mockData: Expense[] = [
  {
    id: '1',
    date: '2023-06-01',
    category: '教材费用',
    amount: 2500,
    description: '购买游泳教材30本',
    paymentMethod: '银行转账',
    approvalStatus: 'approved',
    submitter: '张三'
  },
  {
    id: '2',
    date: '2023-06-05',
    category: '设备维护',
    amount: 1800,
    description: '泳池设备季度维护费用',
    paymentMethod: '现金',
    approvalStatus: 'approved',
    submitter: '李四'
  },
  {
    id: '3',
    date: '2023-06-10',
    category: '员工工资',
    amount: 15000,
    description: '教练工资',
    paymentMethod: '银行转账',
    approvalStatus: 'approved',
    submitter: '王五'
  },
  {
    id: '4',
    date: '2023-06-15',
    category: '营销费用',
    amount: 3000,
    description: '宣传单印刷和发放',
    paymentMethod: '支付宝',
    approvalStatus: 'pending',
    submitter: '赵六'
  },
  {
    id: '5',
    date: '2023-06-20',
    category: '水电费',
    amount: 4500,
    description: '6月份水电费',
    paymentMethod: '银行转账',
    approvalStatus: 'pending',
    submitter: '孙七'
  }
];

const ExpenseManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<Expense[]>(mockData);
  const [visible, setVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchCategory, setSearchCategory] = useState<string>('');
  const [searchStatus, setSearchStatus] = useState<string>('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  const handleAdd = () => {
    form.resetFields();
    setEditingId(null);
    setVisible(true);
  };

  const handleEdit = (record: Expense) => {
    form.setFieldsValue({
      ...record,
      date: dayjs(record.date)
    });
    setEditingId(record.id);
    setVisible(true);
  };

  const handleDelete = (id: string) => {
    setData(data.filter(item => item.id !== id));
    message.success('删除成功');
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingId) {
        setData(data.map(item => 
          item.id === editingId ? 
          { ...item, ...values, date: values.date.format('YYYY-MM-DD') } : 
          item
        ));
        message.success('支出记录更新成功');
      } else {
        const newExpense: Expense = {
          id: `${data.length + 1}`,
          ...values,
          date: values.date.format('YYYY-MM-DD'),
          approvalStatus: 'pending',
          submitter: '当前用户'
        };
        setData([...data, newExpense]);
        message.success('支出记录添加成功');
      }
      
      setVisible(false);
    } catch (error) {
      console.error('提交错误:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    let filteredData = mockData;
    
    if (searchText) {
      filteredData = filteredData.filter(
        item => item.description.includes(searchText) || 
               item.submitter.includes(searchText)
      );
    }
    
    if (searchCategory) {
      filteredData = filteredData.filter(item => item.category === searchCategory);
    }
    
    if (searchStatus) {
      filteredData = filteredData.filter(item => item.approvalStatus === searchStatus);
    }
    
    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].format('YYYY-MM-DD');
      const endDate = dateRange[1].format('YYYY-MM-DD');
      filteredData = filteredData.filter(
        item => item.date >= startDate && item.date <= endDate
      );
    }
    
    setData(filteredData);
  };

  const handleReset = () => {
    setSearchText('');
    setSearchCategory('');
    setSearchStatus('');
    setDateRange(null);
    setData(mockData);
  };

  const exportData = () => {
    message.success('导出成功');
  };

  const totalExpense = data.reduce((sum, item) => sum + item.amount, 0);
  const approvedExpense = data
    .filter(item => item.approvalStatus === 'approved')
    .reduce((sum, item) => sum + item.amount, 0);
  const pendingExpense = data
    .filter(item => item.approvalStatus === 'pending')
    .reduce((sum, item) => sum + item.amount, 0);

  const columns: ColumnsType<Expense> = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => a.date.localeCompare(b.date),
    },
    {
      title: '类别',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: '金额 (¥)',
      dataIndex: 'amount',
      key: 'amount',
      sorter: (a, b) => a.amount - b.amount,
      render: (amount) => `¥${amount.toLocaleString('zh-CN')}`,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '支付方式',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
    {
      title: '审批状态',
      dataIndex: 'approvalStatus',
      key: 'approvalStatus',
      render: (status) => {
        let color = '';
        let text = '';
        switch (status) {
          case 'approved':
            color = 'green';
            text = '已批准';
            break;
          case 'pending':
            color = 'gold';
            text = '待审批';
            break;
          case 'rejected':
            color = 'red';
            text = '已拒绝';
            break;
          default:
            break;
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '提交人',
      dataIndex: 'submitter',
      key: 'submitter',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="确定删除此记录吗?"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="expense-management-container">
      <Title level={2}>支出管理</Title>
      
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="总支出"
              value={totalExpense}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="元"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="已批准支出"
              value={approvedExpense}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="元"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="待审批支出"
              value={pendingExpense}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="元"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>
      
      <Card bordered={false}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div className="table-toolbar">
            <Space wrap>
              <Input
                placeholder="搜索描述或提交人"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 200 }}
                prefix={<SearchOutlined />}
              />
              <Select
                placeholder="支出类别"
                style={{ width: 150 }}
                value={searchCategory}
                onChange={(value) => setSearchCategory(value)}
                allowClear
              >
                <Option value="教材费用">教材费用</Option>
                <Option value="设备维护">设备维护</Option>
                <Option value="员工工资">员工工资</Option>
                <Option value="营销费用">营销费用</Option>
                <Option value="水电费">水电费</Option>
              </Select>
              <Select
                placeholder="审批状态"
                style={{ width: 150 }}
                value={searchStatus}
                onChange={(value) => setSearchStatus(value)}
                allowClear
              >
                <Option value="approved">已批准</Option>
                <Option value="pending">待审批</Option>
                <Option value="rejected">已拒绝</Option>
              </Select>
              <RangePicker 
                value={dateRange}
                onChange={(dates) => setDateRange(dates)}
              />
              <Button type="primary" onClick={handleSearch} icon={<SearchOutlined />}>
                搜索
              </Button>
              <Button onClick={handleReset} icon={<ReloadOutlined />}>
                重置
              </Button>
            </Space>
            <Space>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                添加支出
              </Button>
              <Button icon={<ExportOutlined />} onClick={exportData}>
                导出
              </Button>
            </Space>
          </div>
          <Table 
            columns={columns} 
            dataSource={data} 
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </Space>
      </Card>
      
      <Modal
        title={editingId ? "编辑支出记录" : "添加支出记录"}
        open={visible}
        onCancel={() => setVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
            保存
          </Button>,
        ]}
        maskClosable={false}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            label="日期"
            name="date"
            rules={[{ required: true, message: '请选择日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            label="类别"
            name="category"
            rules={[{ required: true, message: '请选择支出类别' }]}
          >
            <Select>
              <Option value="教材费用">教材费用</Option>
              <Option value="设备维护">设备维护</Option>
              <Option value="员工工资">员工工资</Option>
              <Option value="营销费用">营销费用</Option>
              <Option value="水电费">水电费</Option>
              <Option value="其他">其他</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            label="金额"
            name="amount"
            rules={[
              { required: true, message: '请输入金额' },
              { type: 'number', min: 0, message: '金额必须大于等于0' }
            ]}
          >
            <Input type="number" prefix="¥" suffix="CNY" />
          </Form.Item>
          
          <Form.Item
            label="描述"
            name="description"
            rules={[{ required: true, message: '请输入描述' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          
          <Form.Item
            label="支付方式"
            name="paymentMethod"
            rules={[{ required: true, message: '请选择支付方式' }]}
          >
            <Select>
              <Option value="现金">现金</Option>
              <Option value="银行转账">银行转账</Option>
              <Option value="支付宝">支付宝</Option>
              <Option value="微信支付">微信支付</Option>
              <Option value="其他">其他</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ExpenseManagement; 