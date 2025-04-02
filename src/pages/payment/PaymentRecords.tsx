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
  Statistic,
  Tag,
  Popconfirm,
  Badge
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
  ReloadOutlined,
  DollarOutlined,
  PrinterOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface Payment {
  id: string;
  date: string;
  studentName: string;
  studentId: string;
  course: string;
  amount: number;
  paymentType: string;
  paymentMethod: string;
  status: 'paid' | 'pending' | 'refunded';
  remark: string;
  operator: string;
}

const mockData: Payment[] = [
  {
    id: 'PAY202306001',
    date: '2023-06-01',
    studentName: '张小明',
    studentId: 'STU001',
    course: '游泳初级班',
    amount: 2000,
    paymentType: '学费',
    paymentMethod: '微信支付',
    status: 'paid',
    remark: '预付2个月课程',
    operator: '王老师'
  },
  {
    id: 'PAY202306002',
    date: '2023-06-03',
    studentName: '李小红',
    studentId: 'STU002',
    course: '游泳中级班',
    amount: 2400,
    paymentType: '学费',
    paymentMethod: '支付宝',
    status: 'paid',
    remark: '预付3个月课程',
    operator: '王老师'
  },
  {
    id: 'PAY202306003',
    date: '2023-06-05',
    studentName: '王小刚',
    studentId: 'STU003',
    course: '游泳高级班',
    amount: 3000,
    paymentType: '学费',
    paymentMethod: '现金',
    status: 'paid',
    remark: '预付3个月课程',
    operator: '李老师'
  },
  {
    id: 'PAY202306004',
    date: '2023-06-10',
    studentName: '赵小丽',
    studentId: 'STU004',
    course: '游泳初级班',
    amount: 800,
    paymentType: '教材费',
    paymentMethod: '银行转账',
    status: 'pending',
    remark: '待确认到账',
    operator: '李老师'
  },
  {
    id: 'PAY202306005',
    date: '2023-06-15',
    studentName: '孙小亮',
    studentId: 'STU005',
    course: '游泳初级班',
    amount: 1000,
    paymentType: '学费',
    paymentMethod: '微信支付',
    status: 'refunded',
    remark: '退课退款',
    operator: '张老师'
  }
];

const PaymentRecords: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<Payment[]>(mockData);
  const [visible, setVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchStatus, setSearchStatus] = useState<string>('');
  const [searchPaymentType, setSearchPaymentType] = useState<string>('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [receiptVisible, setReceiptVisible] = useState(false);
  const [currentPayment, setCurrentPayment] = useState<Payment | null>(null);

  const handleAdd = () => {
    form.resetFields();
    setEditingId(null);
    setVisible(true);
  };

  const handleEdit = (record: Payment) => {
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

  const handleReceipt = (record: Payment) => {
    setCurrentPayment(record);
    setReceiptVisible(true);
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
        message.success('付款记录更新成功');
      } else {
        const newPayment: Payment = {
          id: `PAY${dayjs().format('YYYYMM')}${String(data.length + 1).padStart(3, '0')}`,
          ...values,
          date: values.date.format('YYYY-MM-DD'),
          operator: '当前用户'
        };
        setData([...data, newPayment]);
        message.success('付款记录添加成功');
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
        item => item.studentName.includes(searchText) || 
               item.studentId.includes(searchText) ||
               item.course.includes(searchText) ||
               item.id.includes(searchText)
      );
    }
    
    if (searchStatus) {
      filteredData = filteredData.filter(item => item.status === searchStatus);
    }
    
    if (searchPaymentType) {
      filteredData = filteredData.filter(item => item.paymentType === searchPaymentType);
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
    setSearchStatus('');
    setSearchPaymentType('');
    setDateRange(null);
    setData(mockData);
  };

  const exportData = () => {
    message.success('导出成功');
  };

  const totalIncome = data
    .filter(item => item.status === 'paid')
    .reduce((sum, item) => sum + item.amount, 0);
  
  const pendingIncome = data
    .filter(item => item.status === 'pending')
    .reduce((sum, item) => sum + item.amount, 0);
  
  const refundedAmount = data
    .filter(item => item.status === 'refunded')
    .reduce((sum, item) => sum + item.amount, 0);

  const columns: ColumnsType<Payment> = [
    {
      title: '收据编号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => a.date.localeCompare(b.date),
    },
    {
      title: '学员',
      dataIndex: 'studentName',
      key: 'studentName',
      render: (text, record) => `${text} (${record.studentId})`,
    },
    {
      title: '课程',
      dataIndex: 'course',
      key: 'course',
    },
    {
      title: '金额 (¥)',
      dataIndex: 'amount',
      key: 'amount',
      sorter: (a, b) => a.amount - b.amount,
      render: (amount) => `¥${amount.toLocaleString('zh-CN')}`,
    },
    {
      title: '付款类型',
      dataIndex: 'paymentType',
      key: 'paymentType',
    },
    {
      title: '付款方式',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = '';
        let text = '';
        switch (status) {
          case 'paid':
            color = 'green';
            text = '已支付';
            break;
          case 'pending':
            color = 'gold';
            text = '待审批';
            break;
          case 'refunded':
            color = 'red';
            text = '已退款';
            break;
          default:
            break;
        }
        return <Badge status={status === 'paid' ? 'success' : status === 'pending' ? 'warning' : 'error'} text={text} />;
      },
    },
    {
      title: '经手人',
      dataIndex: 'operator',
      key: 'operator',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<PrinterOutlined />} 
            onClick={() => handleReceipt(record)}
          />
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
    <div className="payment-records-container">
      <Title level={2}>付款记录</Title>
      
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="总收入"
              value={totalIncome}
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
              title="待确认收入"
              value={pendingIncome}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="元"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="退款金额"
              value={refundedAmount}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="元"
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>
      
      <Card bordered={false}>
        <div className="table-toolbar" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <Space wrap>
            <Input
              placeholder="搜索学员/ID/课程/收据编号"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 230 }}
              prefix={<SearchOutlined />}
            />
            <Select
              placeholder="付款类型"
              style={{ width: 150 }}
              value={searchPaymentType}
              onChange={(value) => setSearchPaymentType(value)}
              allowClear
            >
              <Option value="学费">学费</Option>
              <Option value="教材费">教材费</Option>
              <Option value="其他费用">其他费用</Option>
            </Select>
            <Select
              placeholder="支付状态"
              style={{ width: 150 }}
              value={searchStatus}
              onChange={(value) => setSearchStatus(value)}
              allowClear
            >
              <Option value="paid">已支付</Option>
              <Option value="pending">待确认</Option>
              <Option value="refunded">已退款</Option>
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
              添加付款记录
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
      </Card>
      
      <Modal
        title={editingId ? "编辑付款记录" : "添加付款记录"}
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
            label="学员信息"
            required
          >
            <Input.Group compact>
              <Form.Item
                name="studentId"
                noStyle
                rules={[{ required: true, message: '请输入学员ID' }]}
              >
                <Input style={{ width: '30%' }} placeholder="学员ID" />
              </Form.Item>
              <Form.Item
                name="studentName"
                noStyle
                rules={[{ required: true, message: '请输入学员姓名' }]}
              >
                <Input style={{ width: '70%' }} placeholder="学员姓名" />
              </Form.Item>
            </Input.Group>
          </Form.Item>
          
          <Form.Item
            label="课程"
            name="course"
            rules={[{ required: true, message: '请选择课程' }]}
          >
            <Select>
              <Option value="游泳初级班">游泳初级班</Option>
              <Option value="游泳中级班">游泳中级班</Option>
              <Option value="游泳高级班">游泳高级班</Option>
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
            label="付款类型"
            name="paymentType"
            rules={[{ required: true, message: '请选择付款类型' }]}
          >
            <Select>
              <Option value="学费">学费</Option>
              <Option value="教材费">教材费</Option>
              <Option value="其他费用">其他费用</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            label="付款方式"
            name="paymentMethod"
            rules={[{ required: true, message: '请选择付款方式' }]}
          >
            <Select>
              <Option value="现金">现金</Option>
              <Option value="银行转账">银行转账</Option>
              <Option value="微信支付">微信支付</Option>
              <Option value="支付宝">支付宝</Option>
              <Option value="其他">其他</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            label="支付状态"
            name="status"
            rules={[{ required: true, message: '请选择支付状态' }]}
          >
            <Select>
              <Option value="paid">已支付</Option>
              <Option value="pending">待确认</Option>
              <Option value="refunded">已退款</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            label="备注"
            name="remark"
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
      
      <Modal
        title="付款收据"
        open={receiptVisible}
        onCancel={() => setReceiptVisible(false)}
        footer={[
          <Button 
            key="print" 
            type="primary" 
            icon={<PrinterOutlined />}
            onClick={() => {
              message.success('收据打印成功');
              setReceiptVisible(false);
            }}
          >
            打印收据
          </Button>,
          <Button key="close" onClick={() => setReceiptVisible(false)}>
            关闭
          </Button>
        ]}
        width={600}
      >
        {currentPayment && (
          <div className="payment-receipt" style={{ padding: '20px', border: '1px solid #d9d9d9' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h2>付款收据</h2>
              <p>收据编号: {currentPayment.id}</p>
            </div>
            
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <p><strong>日期:</strong> {currentPayment.date}</p>
              </Col>
              <Col span={12}>
                <p><strong>状态:</strong> {
                  currentPayment.status === 'paid' ? '已支付' : 
                  currentPayment.status === 'pending' ? '待确认' : '已退款'
                }</p>
              </Col>
              <Col span={12}>
                <p><strong>学员姓名:</strong> {currentPayment.studentName}</p>
              </Col>
              <Col span={12}>
                <p><strong>学员ID:</strong> {currentPayment.studentId}</p>
              </Col>
              <Col span={12}>
                <p><strong>课程:</strong> {currentPayment.course}</p>
              </Col>
              <Col span={12}>
                <p><strong>付款类型:</strong> {currentPayment.paymentType}</p>
              </Col>
              <Col span={12}>
                <p><strong>付款方式:</strong> {currentPayment.paymentMethod}</p>
              </Col>
              <Col span={12}>
                <p><strong>经手人:</strong> {currentPayment.operator}</p>
              </Col>
              <Col span={24}>
                <p><strong>备注:</strong> {currentPayment.remark}</p>
              </Col>
              <Col span={24} style={{ borderTop: '1px solid #d9d9d9', paddingTop: '15px', textAlign: 'right' }}>
                <h3>金额: ¥{currentPayment.amount.toLocaleString('zh-CN')}</h3>
              </Col>
            </Row>
            
            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <p>付款人签名: _________________</p>
              </div>
              <div>
                <p>收款人签名: _________________</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PaymentRecords; 