import React, { useState, useEffect } from 'react';
import { Form, Input, Select, DatePicker, Button, Row, Col, message, Space } from 'antd';
import { SearchOutlined, SyncOutlined } from '@ant-design/icons';
import type { FilterParams } from '../types';
import { STATUS_TEXT_MAP } from '../constants';
import { getCourseSimpleList } from '@/api/course';
import type { SimpleCourse } from '@/api/course/types';
import locale from 'antd/es/date-picker/locale/zh_CN';

const { RangePicker } = DatePicker;

interface FilterFormProps {
  onFilter: (values: FilterParams) => void;
  onReset: () => void;
  courses: SimpleCourse[];
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

const FilterForm: React.FC<FilterFormProps> = ({ onFilter, onReset, courses }) => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    console.log('FilterForm handleFinish 接收到的值:', values);
    
    // 转换表单字段名称到FilterParams格式
    const filterParams: FilterParams = {
      searchText: values.search || '',
      selectedCourse: values.courseId || '',
      selectedStatus: values.status || '',
      dateRange: values.dateRange ? [
        values.dateRange[0].format('YYYY-MM-DD'),
        values.dateRange[1].format('YYYY-MM-DD')
      ] : null,
      selectedCampus: '', // 暂不使用
      currentPage: 1,
      pageSize: 10
    };
    
    console.log('转换后的过滤参数:', filterParams);
    onFilter(filterParams);
  };

  const handleReset = () => {
    console.log('FilterForm handleReset 被调用');
    form.resetFields();
    onReset();
  };

  const statusOptions = Object.entries(STATUS_TEXT_MAP).map(([value, label]) => ({
    value,
    label,
  }));

  const courseOptions = courses.map(course => ({
    value: course.id,
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
    <div className="attendance-table-toolbar">
      <Form form={form} onFinish={handleFinish} onReset={handleReset}>
      <Row gutter={[12, 8]} align="middle" style={{ width: '100%', display: 'flex' }}>
        <Col span={5}>
          <Form.Item name="search" className="mb-0">
            <Input placeholder="学员姓名/ID/课程" allowClear />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item name="courseId" className="mb-0">
            <Select
              placeholder="选择课程"
              options={courseOptions}
              allowClear
              style={{ width: '100%' }}
              getPopupContainer={triggerNode => triggerNode.parentNode as HTMLElement}
            />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item name="status" className="mb-0">
            <Select
              placeholder="出勤状态"
              options={statusOptions}
              allowClear
              style={{ width: '100%' }}
              getPopupContainer={triggerNode => triggerNode.parentNode as HTMLElement}
            />
          </Form.Item>
        </Col>
        <Col span={7}>
          <Form.Item name="dateRange" className="mb-0">
            <DatePicker.RangePicker 
              style={{ width: '100%', textAlign: 'center' }} 
              placeholder={['开始日期', '结束日期']}
              locale={locale}
              format="YYYY-MM-DD"
            />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item className="mb-0">
            <Space size="middle" style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                搜索
              </Button>
              <Button htmlType="reset" onClick={handleReset} icon={<SyncOutlined />}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  </div>
  );
};

export default FilterForm; 