import React, { useState, useEffect } from 'react';
import { Form, Input, Select, DatePicker, Button, Row, Col, message } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { FilterParams } from '../types';
import { STATUS_TEXT_MAP } from '../constants';
import { getCourseSimpleList } from '@/api/course';
import type { SimpleCourse } from '@/api/course/types';
import locale from 'antd/es/date-picker/locale/zh_CN';

const { RangePicker } = DatePicker;

interface FilterFormProps {
  onFilter: (values: FilterParams) => void;
  onReset: () => void;
}

const FilterForm: React.FC<FilterFormProps> = ({ onFilter, onReset }) => {
  const [form] = Form.useForm();
  const [courseOptions, setCourseOptions] = useState<SimpleCourse[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setCoursesLoading(true);
      try {
        // 获取全部课程，不过滤已发布状态
        const courses = await getCourseSimpleList(undefined, false);
        setCourseOptions(courses.map(course => ({ ...course, id: String(course.id) })));
      } catch (error) {
        message.error('获取课程列表失败');
        console.error('获取课程列表失败:', error);
      } finally {
        setCoursesLoading(false);
      }
    };
    fetchCourses();
  }, []);

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
              loading={coursesLoading}
              options={courseOptions.map(course => ({
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
              }))}
              style={{ width: '100%' }}
              getPopupContainer={triggerNode => triggerNode.parentNode as HTMLElement}
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
              style={{ width: '100%' }}
              getPopupContainer={triggerNode => triggerNode.parentNode as HTMLElement}
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