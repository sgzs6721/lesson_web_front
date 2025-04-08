import React from 'react';
import { Form, Input, Select, DatePicker, Button, Row, Col } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { FilterParams } from '../types';
import { COURSE_OPTIONS, STATUS_TEXT_MAP } from '../constants';
import locale from 'antd/es/date-picker/locale/zh_CN';

const { RangePicker } = DatePicker;

interface FilterFormProps {
  onFilter: (values: FilterParams) => void;
  onReset: () => void;
}

const FilterForm: React.FC<FilterFormProps> = ({ onFilter, onReset }) => {
  const [form] = Form.useForm();

  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  const handleSearch = () => {
    const values = form.getFieldsValue();
    onFilter(values);
  };

  return (
    <Form
      form={form}
      onFinish={onFilter}
      layout="horizontal"
      className="mb-6"
    >
      <Row gutter={16} align="middle">
        <Col xs={24} sm={12} md={8} lg={6} xl={5}>
          <Form.Item name="searchText" className="mb-0">
            <Input
              placeholder="搜索学员姓名/ID/课程"
              prefix={<SearchOutlined />}
              allowClear
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={5}>
          <Form.Item name="selectedCourse" className="mb-0">
            <Select
              placeholder="选择课程"
              allowClear
              options={COURSE_OPTIONS}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={5}>
          <Form.Item name="selectedStatus" className="mb-0">
            <Select
              placeholder="出勤状态"
              allowClear
              options={Object.entries(STATUS_TEXT_MAP).map(([value, label]) => ({
                value,
                label,
              }))}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={5}>
          <Form.Item name="dateRange" className="mb-0">
            <RangePicker
              locale={locale}
              placeholder={['开始日期', '结束日期']}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Form.Item className="mb-0">
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />} style={{ marginRight: 8 }}>
              搜索
            </Button>
            <Button onClick={handleReset} icon={<ReloadOutlined />}>
              重置
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default FilterForm; 