import React from 'react';
import { Form, Input, Select, DatePicker, Button, Row, Col } from 'antd';
import { SearchOutlined, ReloadOutlined, ExportOutlined } from '@ant-design/icons';
import { PaymentSearchParams } from '../types/payment';
import locale from 'antd/es/date-picker/locale/zh_CN';
import dayjs from 'dayjs';

const { Option } = Select;

interface PaymentSearchBarProps {
  params: PaymentSearchParams;
  onSearch: () => void;
  onReset: () => void;
  onExport: () => void;
  onTextChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onPaymentTypeChange: (value: string) => void;
  onPaymentMethodChange: (value: string) => void;
  onDateRangeChange: (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => void;
}

const PaymentSearchBar: React.FC<PaymentSearchBarProps> = ({
  params,
  onSearch,
  onReset,
  onExport,
  onTextChange,
  onPaymentTypeChange,
  onPaymentMethodChange,
  onDateRangeChange
}) => {
  return (
    <div className="table-toolbar" style={{ marginBottom: '16px', width: '100%' }}>
      <Form onFinish={onSearch}>
        <Row gutter={16} align="middle">
          {/* 搜索框 */}
          <Col xs={24} sm={12} md={8} lg={5} xl={5}>
            <Form.Item name="searchText" className="mb-0">
              <Input
                placeholder="搜索学员/学员ID/课程"
                value={params.searchText || ''}
                onChange={(e) => onTextChange(e.target.value)}
                allowClear
              />
            </Form.Item>
          </Col>
          
          {/* 课程类型选择 */}
          <Col xs={24} sm={12} md={8} lg={4} xl={4}>
            <Form.Item name="paymentType" className="mb-0">
              <Select
                placeholder="选择课程类型"
                value={params.searchPaymentType || undefined}
                onChange={(value) => onPaymentTypeChange(value || '')}
                allowClear
                style={{ width: '100%' }}
                getPopupContainer={triggerNode => triggerNode.parentNode as HTMLElement}
              >
                <Option value="30次课">30次课</Option>
                <Option value="50次课">50次课</Option>
                <Option value="100次课">100次课</Option>
              </Select>
            </Form.Item>
          </Col>
          
          {/* 缴费类型选择 */}
          <Col xs={24} sm={12} md={8} lg={4} xl={4}>
            <Form.Item name="paymentMethod" className="mb-0">
              <Select
                placeholder="选择缴费类型"
                value={params.searchPaymentMethod || undefined}
                onChange={(value) => onPaymentMethodChange(value || '')}
                allowClear
                style={{ width: '100%' }}
                getPopupContainer={triggerNode => triggerNode.parentNode as HTMLElement}
              >
                <Option value="新增">新增</Option>
                <Option value="退费">退费</Option>
                <Option value="续费">续费</Option>
                <Option value="补费">补费</Option>
              </Select>
            </Form.Item>
          </Col>
          
          {/* 日期范围选择器 */}
          <Col xs={24} sm={12} md={12} lg={5} xl={5}>
            <Form.Item name="dateRange" className="mb-0">
              <DatePicker.RangePicker
                value={params.dateRange}
                onChange={(dates) => onDateRangeChange(dates)}
                placeholder={['开始日期', '结束日期']}
                locale={locale}
                format="YYYY-MM-DD"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          
          {/* 操作按钮 */}
          <Col xs={24} sm={24} md={24} lg={6} xl={6}>
            <Form.Item className="mb-0" style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />} style={{ marginRight: 8 }}>
                查询
              </Button>
              <Button onClick={onReset} icon={<ReloadOutlined />} style={{ marginRight: 8 }}>
                重置
              </Button>
              <Button icon={<ExportOutlined />} onClick={onExport}>
                导出
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default PaymentSearchBar; 