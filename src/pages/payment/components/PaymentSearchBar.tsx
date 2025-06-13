import React from 'react';
import { Form, Input, Select, DatePicker, Button, Row, Col, Space } from 'antd';
import { SearchOutlined, ReloadOutlined, ExportOutlined } from '@ant-design/icons';
import { PaymentSearchParams } from '../types/payment';
import type { SimpleCourse } from '@/api/course/types';
import locale from 'antd/es/date-picker/locale/zh_CN';
import dayjs from 'dayjs';

const { Option } = Select;

interface PaymentSearchBarProps {
  params: PaymentSearchParams;
  courses: SimpleCourse[];
  onSearch: () => void;
  onReset: () => void;
  onExport: () => void;
  onTextChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onPaymentMethodChange: (value: string) => void;
  onCourseChange: (value: string) => void;
  onDateRangeChange: (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => void;
}

// 获取课程状态的中文文本
const getCourseStatusText = (status: string): string => {
  const normalizedStatus = status?.toString().toUpperCase() || '';
  if (normalizedStatus === '1' || normalizedStatus === 'PUBLISHED') {
    return '已发布';
  } else if (normalizedStatus === 'SUSPENDED') {
    return '已暂停';
  } else if (normalizedStatus === 'TERMINATED') {
    return '已终止';
  } else if (normalizedStatus === '0' || normalizedStatus === 'DRAFT') {
    return '草稿';
  } else {
    return '未知状态';
  }
};

// 获取课程状态的颜色
const getCourseStatusColor = (status: string): string => {
  const normalizedStatus = status?.toString().toUpperCase() || '';
  if (normalizedStatus === '1' || normalizedStatus === 'PUBLISHED') {
    return '#52c41a'; // 绿色
  } else if (normalizedStatus === 'SUSPENDED') {
    return '#fa8c16'; // 橙色
  } else if (normalizedStatus === 'TERMINATED') {
    return '#ff4d4f'; // 红色
  } else if (normalizedStatus === '0' || normalizedStatus === 'DRAFT') {
    return '#d9d9d9'; // 灰色
  } else {
    return '#d9d9d9'; // 默认灰色
  }
};

const PaymentSearchBar: React.FC<PaymentSearchBarProps> = ({
  params,
  courses,
  onSearch,
  onReset,
  onExport,
  onTextChange,
  onPaymentMethodChange,
  onCourseChange,
  onDateRangeChange
}) => {
  // 构建课程选项
  const courseOptions = courses.map(course => ({
    value: course.id.toString(),
    label: (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{course.name}</span>
        <span
          style={{
            color: getCourseStatusColor(course.status),
            fontSize: '12px',
            marginLeft: '8px'
          }}
        >
          {getCourseStatusText(course.status)}
        </span>
      </div>
    ),
  }));

  return (
    <div className="table-toolbar" style={{ marginBottom: '16px', width: '100%' }}>
      <Form onFinish={onSearch}>
        <Row gutter={[12, 8]} align="middle" style={{ width: '100%' }}>
          {/* 搜索框 */}
          <Col flex="2" style={{ minWidth: '180px' }}>
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
          <Col flex="2" style={{ minWidth: '160px' }}>
            <Form.Item name="selectedCourse" className="mb-0">
              <Select
                placeholder="选择课程类型"
                value={params.selectedCourse || undefined}
                onChange={(value) => onCourseChange(value || '')}
                options={courseOptions}
                allowClear
                style={{ width: '100%' }}
                getPopupContainer={triggerNode => triggerNode.parentNode as HTMLElement}
              />
            </Form.Item>
          </Col>
          
          {/* 缴费类型选择 */}
          <Col flex="1" style={{ minWidth: '130px' }}>
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
          <Col flex="2" style={{ minWidth: '240px' }}>
            <Form.Item name="dateRange" className="mb-0">
              <DatePicker.RangePicker
                value={params.dateRange}
                onChange={(dates) => onDateRangeChange(dates)}
                placeholder={['开始日期', '结束日期']}
                locale={locale}
                format="YYYY-MM-DD"
                style={{ width: '100%', textAlign: 'center' }}
              />
            </Form.Item>
          </Col>
          
          {/* 操作按钮 */}
          <Col flex="2" style={{ minWidth: '200px' }}>
            <Form.Item className="mb-0">
              <Space size={12} style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                  查询
                </Button>
                <Button onClick={onReset} icon={<ReloadOutlined />}>
                  重置
                </Button>
                <Button icon={<ExportOutlined />} onClick={onExport}>
                  导出
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default PaymentSearchBar; 