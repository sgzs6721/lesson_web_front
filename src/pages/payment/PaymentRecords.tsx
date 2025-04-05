import { useState, useEffect } from 'react';
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
  Badge,
  Tooltip
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
  ReloadOutlined,
  DollarOutlined,
  PrinterOutlined,
  EyeOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import './payment.css'; // 假设我们将创建这个CSS文件

dayjs.locale('zh-cn');

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
  status: '微信支付' | '现金支付' | '支付宝支付' | '银行卡转账';
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
    paymentType: '30次课',
    paymentMethod: '新增',
    status: '微信支付',
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
    paymentType: '50次课',
    paymentMethod: '续费',
    status: '支付宝支付',
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
    paymentType: '100次课',
    paymentMethod: '补费',
    status: '现金支付',
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
    paymentType: '30次课',
    paymentMethod: '退费',
    status: '银行卡转账',
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
    paymentType: '50次课',
    paymentMethod: '新增',
    status: '微信支付',
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
  const [searchPaymentMethod, setSearchPaymentMethod] = useState<string>('');
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

    if (searchPaymentMethod) {
      filteredData = filteredData.filter(item => item.paymentMethod === searchPaymentMethod);
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
    setSearchPaymentMethod('');
    setDateRange(null);
    setData(mockData);
  };

  const exportData = () => {
    try {
      const exportedData = data.map(item => ({
        日期: item.date,
        学员姓名: item.studentName,
        学员ID: item.studentId,
        课程: item.course,
        金额: item.amount,
        课时类型: item.paymentType,
        缴费类型: item.paymentMethod,
        支付方式: item.status,
        备注: item.remark,
        操作员: item.operator
      }));

      const headers = Object.keys(exportedData[0]).join(',') + '\n';
      const csv = exportedData.reduce((acc, row) => {
        return acc + Object.values(row).join(',') + '\n';
      }, headers);

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `付款记录_${dayjs().format('YYYY-MM-DD')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('导出错误:', error);
      message.error('导出失败，请重试');
    }
  };

  const totalIncome = data
    .filter(item => item.status === '微信支付' || item.status === '现金支付' || item.status === '支付宝支付' || item.status === '银行卡转账')
    .reduce((sum, item) => sum + item.amount, 0);

  const pendingIncome = 0; // 没有待确认收入的状态

  const refundedAmount = 0; // 没有退款的状态

  const columns: ColumnsType<Payment> = [
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
      title: '课时类型',
      dataIndex: 'paymentType',
      key: 'paymentType',
    },
    {
      title: '缴费类型',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
    {
      title: '支付类型',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = '';
        let text = '';
        switch (status) {
          case '微信支付':
            color = 'green';
            text = '微信支付';
            break;
          case '现金支付':
            color = 'gold';
            text = '现金支付';
            break;
          case '支付宝支付':
            color = 'blue';
            text = '支付宝支付';
            break;
          case '银行卡转账':
            color = 'purple';
            text = '银行卡转账';
            break;
          default:
            break;
        }
        return <Badge color={color} text={text} />;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="查看详情">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleReceipt(record)}
            />
          </Tooltip>
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

  // 添加useEffect钩子来确保Select组件样式在组件挂载后应用
  useEffect(() => {
    // 添加自定义样式以确保placeholder显示
    const style = document.createElement('style');
    style.innerHTML = `
      /* 强制显示所有选择器的placeholder */
      .ant-select .ant-select-selection-placeholder,
      .ant-select-selector .ant-select-selection-placeholder,
      .ant-select-selection-placeholder,
      .custom-select .ant-select-selection-placeholder,
      .payment-records-container .ant-select-selection-placeholder,
      #courseTypeSelect .ant-select-selection-placeholder,
      #paymentTypeSelect .ant-select-selection-placeholder {
        display: inline-block !important;
        visibility: visible !important;
        opacity: 1 !important;
        color: rgba(0, 0, 0, 0.4) !important;
        position: absolute !important;
        top: 50% !important;
        transform: translateY(-50%) !important;
        left: 11px !important;
        right: auto !important;
        transition: none !important;
        pointer-events: none !important;
        z-index: 100 !important;
      }
    `;
    document.head.appendChild(style);

    // 确保选择框的placeholder正确显示
    setTimeout(() => {
      // 强制重新渲染选择器
      const courseTypeSelect = document.getElementById('courseTypeSelect');
      const paymentTypeSelect = document.getElementById('paymentTypeSelect');

      if (courseTypeSelect) {
        const placeholders = courseTypeSelect.querySelectorAll('.ant-select-selection-placeholder');
        placeholders.forEach(placeholder => {
          (placeholder as HTMLElement).style.display = 'inline-block';
          (placeholder as HTMLElement).style.visibility = 'visible';
          (placeholder as HTMLElement).style.opacity = '1';
          (placeholder as HTMLElement).style.color = 'rgba(0, 0, 0, 0.4)';
        });
      }

      if (paymentTypeSelect) {
        const placeholders = paymentTypeSelect.querySelectorAll('.ant-select-selection-placeholder');
        placeholders.forEach(placeholder => {
          (placeholder as HTMLElement).style.display = 'inline-block';
          (placeholder as HTMLElement).style.visibility = 'visible';
          (placeholder as HTMLElement).style.opacity = '1';
          (placeholder as HTMLElement).style.color = 'rgba(0, 0, 0, 0.4)';
        });
      }
    }, 100);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="payment-records-container">
      <Title level={2}>缴费记录</Title>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="课时流水"
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
              title="其他收入"
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

      <Card>
        <div className="table-toolbar" style={{ marginBottom: '16px' }}>
          <Row gutter={16} align="middle" style={{ width: '100%' }}>
            <Col flex="1">
              <Input
                placeholder="搜索学员/学员ID/课程"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: '100%' }}
                prefix={<SearchOutlined />}
              />
            </Col>
            <Col flex="1">
              <Form.Item style={{ marginBottom: 0 }}>
                <div className="select-container" style={{ position: 'relative' }}>
                  <div className="select-placeholder" style={{
                    position: 'absolute',
                    left: '11px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'rgba(0, 0, 0, 0.4)',
                    pointerEvents: 'none',
                    display: searchPaymentType ? 'none' : 'block',
                    zIndex: 1
                  }}>
                    选择课时类型
                  </div>
                  <Select
                    style={{ width: '100%' }}
                    value={searchPaymentType}
                    onChange={(value) => setSearchPaymentType(value)}
                    allowClear
                    onClear={() => setSearchPaymentType('')}
                    className="custom-select"
                    popupClassName="custom-select-dropdown"
                    showSearch={false}
                    virtual={false}
                    popupMatchSelectWidth={false}
                    id="courseTypeSelect"
                    notFoundContent={null}
                  >
                    <Option value="30次课">30次课</Option>
                    <Option value="50次课">50次课</Option>
                    <Option value="100次课">100次课</Option>
                  </Select>
                </div>
              </Form.Item>
            </Col>
            <Col flex="1">
              <Form.Item style={{ marginBottom: 0 }}>
                <div className="select-container" style={{ position: 'relative' }}>
                  <div className="select-placeholder" style={{
                    position: 'absolute',
                    left: '11px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'rgba(0, 0, 0, 0.4)',
                    pointerEvents: 'none',
                    display: searchPaymentMethod ? 'none' : 'block',
                    zIndex: 1
                  }}>
                    选择缴费类型
                  </div>
                  <Select
                    style={{ width: '100%' }}
                    value={searchPaymentMethod}
                    onChange={(value) => setSearchPaymentMethod(value)}
                    allowClear
                    onClear={() => setSearchPaymentMethod('')}
                    className="custom-select"
                    popupClassName="custom-select-dropdown"
                    showSearch={false}
                    virtual={false}
                    popupMatchSelectWidth={false}
                    id="paymentTypeSelect"
                    notFoundContent={null}
                  >
                    <Option value="新增">新增</Option>
                    <Option value="退费">退费</Option>
                    <Option value="续费">续费</Option>
                    <Option value="补费">补费</Option>
                  </Select>
                </div>
              </Form.Item>
            </Col>
            <Col flex="1.5">
              <DatePicker.RangePicker
                value={dateRange}
                onChange={(dates) => setDateRange(dates)}
                placeholder={['开始日期', '结束日期']}
                style={{ width: '100%' }}
                locale={locale}
                format="YYYY-MM-DD"
              />
            </Col>
            <Col flex="0.7">
              <Button
                type="primary"
                icon={<SearchOutlined />}
                style={{ width: '100%' }}
                onClick={handleSearch}
              >
                查询
              </Button>
            </Col>
            <Col flex="0.7">
              <Button
                onClick={() => {
                  handleReset();
                  handleSearch();
                }}
                icon={<ReloadOutlined />}
                style={{ width: '100%' }}
              >
                重置
              </Button>
            </Col>
            <Col flex="0.7">
              <Button
                icon={<ExportOutlined />}
                onClick={exportData}
                style={{ width: '100%' }}
              >
                导出
              </Button>
            </Col>
          </Row>
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
            <DatePicker
              style={{ width: '100%' }}
              placeholder="选择日期"
              locale={locale}
              format="YYYY-MM-DD"
            />
          </Form.Item>

          <Form.Item
            label="学员姓名"
            name="studentName"
            rules={[{ required: true, message: '请输入学员姓名' }]}
          >
            <Input placeholder="请输入学员姓名" />
          </Form.Item>

          <Form.Item
            name="studentId"
            hidden
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="课程"
            name="course"
            rules={[{ required: true, message: '请选择课程' }]}
          >
            <Select
              placeholder="请选择课程"
              className="custom-select"
              popupClassName="custom-select-dropdown"
              showSearch={false}
              virtual={false}
            >
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
            label="课时类型"
            name="paymentType"
            rules={[{ required: true, message: '请选择课时类型' }]}
          >
            <Select
              placeholder="请选择课时类型"
              className="custom-select"
              popupClassName="custom-select-dropdown"
              showSearch={false}
              virtual={false}
            >
              <Option value="30次课">30次课</Option>
              <Option value="50次课">50次课</Option>
              <Option value="100次课">100次课</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="缴费类型"
            name="paymentMethod"
            rules={[{ required: true, message: '请选择缴费类型' }]}
          >
            <Select
              placeholder="请选择缴费类型"
              className="custom-select"
              popupClassName="custom-select-dropdown"
              showSearch={false}
              virtual={false}
            >
              <Option value="新增">新增</Option>
              <Option value="退费">退费</Option>
              <Option value="续费">续费</Option>
              <Option value="补费">补费</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="支付状态"
            name="status"
            rules={[{ required: true, message: '请选择支付状态' }]}
          >
            <Select
              placeholder="请选择支付状态"
              className="custom-select"
              popupClassName="custom-select-dropdown"
              showSearch={false}
              virtual={false}
            >
              <Option value="微信支付">微信支付</Option>
              <Option value="现金支付">现金支付</Option>
              <Option value="支付宝支付">支付宝支付</Option>
              <Option value="银行卡转账">银行卡转账</Option>
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
        title="付款详情"
        open={receiptVisible}
        onCancel={() => setReceiptVisible(false)}
        footer={[
          <Button key="close" onClick={() => setReceiptVisible(false)}>
            关闭
          </Button>
        ]}
        width={600}
      >
        {currentPayment && (
          <div className="payment-receipt" style={{ padding: '20px', border: '1px solid #d9d9d9' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h2>付款详情</h2>
            </div>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <p><strong>日期:</strong> {currentPayment.date}</p>
              </Col>
              <Col span={12}>
                <p><strong>状态:</strong> {currentPayment.status}</p>
              </Col>
              <Col span={12}>
                <p><strong>学员姓名:</strong> {currentPayment.studentName}</p>
              </Col>
              <Col span={12}>
                <p><strong>课程:</strong> {currentPayment.course}</p>
              </Col>
              <Col span={12}>
                <p><strong>课时类型:</strong> {currentPayment.paymentType}</p>
              </Col>
              <Col span={12}>
                <p><strong>缴费类型:</strong> {currentPayment.paymentMethod}</p>
              </Col>
              <Col span={24}>
                <p><strong>备注:</strong> {currentPayment.remark}</p>
              </Col>
              <Col span={24} style={{ borderTop: '1px solid #d9d9d9', paddingTop: '15px', textAlign: 'right' }}>
                <h3>金额: ¥{currentPayment.amount.toLocaleString('zh-CN')}</h3>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PaymentRecords;