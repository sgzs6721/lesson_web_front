import React from 'react';
import { Row, Col, Input, Form, Select, DatePicker, Button } from 'antd';
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
  onStatusChange,
  onPaymentTypeChange,
  onPaymentMethodChange,
  onDateRangeChange
}) => {
  return (
    <div className="table-toolbar" style={{ marginBottom: '16px' }}>
      <Row gutter={16} align="middle" style={{ width: '100%' }}>
        <Col flex="1">
          <Input
            placeholder="搜索学员/学员ID/课程"
            value={params.searchText}
            onChange={(e) => onTextChange(e.target.value)}
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
                display: params.searchPaymentType ? 'none' : 'block',
                zIndex: 1
              }}>
                选择课时类型
              </div>
              <Select
                style={{ width: '100%' }}
                value={params.searchPaymentType}
                onChange={(value) => onPaymentTypeChange(value)}
                allowClear
                onClear={() => onPaymentTypeChange('')}
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
                display: params.searchPaymentMethod ? 'none' : 'block',
                zIndex: 1
              }}>
                选择缴费类型
              </div>
              <Select
                style={{ width: '100%' }}
                value={params.searchPaymentMethod}
                onChange={(value) => onPaymentMethodChange(value)}
                allowClear
                onClear={() => onPaymentMethodChange('')}
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
            value={params.dateRange}
            onChange={(dates) => onDateRangeChange(dates)}
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
            onClick={onSearch}
          >
            查询
          </Button>
        </Col>
        <Col flex="0.7">
          <Button
            onClick={onReset}
            icon={<ReloadOutlined />}
            style={{ width: '100%' }}
          >
            重置
          </Button>
        </Col>
        <Col flex="0.7">
          <Button
            icon={<ExportOutlined />}
            onClick={onExport}
            style={{ width: '100%' }}
          >
            导出
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default PaymentSearchBar; 