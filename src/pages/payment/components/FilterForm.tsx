import React from 'react';
import { Form, Input, Select, DatePicker, Button, Row, Col, Space } from 'antd';
import { SearchOutlined, ReloadOutlined, ExportOutlined } from '@ant-design/icons';
import { CourseStatus, type SimpleCourse } from '@/api/course/types';
import locale from 'antd/es/date-picker/locale/zh_CN';
import './FilterForm.css';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';

const { RangePicker } = DatePicker;
const { Option } = Select;

export interface PaymentFilterParams {
  searchText?: string;
  courseIds?: string[];
  paymentTypes?: string[];
  dateRange?: [string, string] | null;
}

interface FilterFormProps {
  onFilter: (values: PaymentFilterParams) => void;
  onReset: () => void;
  onExport: () => void;
  courses: SimpleCourse[];
}

// 获取课程状态的中文文本
const getCourseStatusText = (status: string): string => {
  const normalizedStatus = status?.toString().toUpperCase() || '';
  if (normalizedStatus === CourseStatus.PUBLISHED || normalizedStatus === 'PUBLISHED') return '已发布';
  if (normalizedStatus === CourseStatus.SUSPENDED) return '已暂停';
  if (normalizedStatus === CourseStatus.TERMINATED) return '已终止';
  if (normalizedStatus === CourseStatus.DRAFT || normalizedStatus === 'DRAFT') return '草稿';
  return '未知状态';
};

// 获取课程状态的颜色
const getCourseStatusColor = (status: string): string => {
  const normalizedStatus = status?.toString().toUpperCase() || '';
  if (normalizedStatus === CourseStatus.PUBLISHED || normalizedStatus === 'PUBLISHED') return '#52c41a';
  if (normalizedStatus === CourseStatus.SUSPENDED) return '#fa8c16';
  if (normalizedStatus === CourseStatus.TERMINATED) return '#ff4d4f';
  if (normalizedStatus === CourseStatus.DRAFT || normalizedStatus === 'DRAFT') return '#d9d9d9';
  return '#d9d9d9';
};

// 为缴费类型选择框创建专门的标签渲染函数
const renderPaymentTypeTag = (props: CustomTagProps) => {
  const { label, closable, onClose, value } = props;

  let tagTitle = '';
  if (React.isValidElement(label) && (label.props as any)?.children) {
    const children = (label.props as any).children;
    if (Array.isArray(children) && children[0]?.props?.children) {
      tagTitle = children[0].props.children;
    } else {
      tagTitle = '标签'; // 回退值
    }
  } else {
    tagTitle = String(label);
  }

  return (
    <span
      className="payment-type-tag"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        border: '1px solid #d9d9d9',
        borderRadius: '4px',
        padding: '0 6px',
        margin: '0 2px',
        fontSize: '12px',
        maxWidth: '90%',
        whiteSpace: 'nowrap'
      }}
      title={tagTitle}
    >
      <span style={{ whiteSpace: 'nowrap', marginRight: '4px' }}>
        {label}
      </span>
      {closable && (
        <span onClick={onClose} style={{ cursor: 'pointer', fontSize: '10px', color: '#999', lineHeight: 1 }}>
          ×
        </span>
      )}
    </span>
  );
};

const FilterForm: React.FC<FilterFormProps> = ({ onFilter, onReset, onExport, courses }) => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    const filterParams: PaymentFilterParams = {
      searchText: values.searchText || '',
      courseIds: values.courseIds || [],
      paymentTypes: values.paymentTypes || [],
      dateRange: values.dateRange ? [
        values.dateRange[0].format('YYYY-MM-DD'),
        values.dateRange[1].format('YYYY-MM-DD')
      ] : null,
    };
    onFilter(filterParams);
  };

  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  const courseOptions = courses.map(course => ({
    value: course.id.toString(),
    label: course.name, // 简化为只显示课程名称
  }));

  return (
    <div className="filter-toolbar">
      <Form form={form} onFinish={handleFinish} onReset={handleReset}>
        <Row gutter={[16, 8]} align="middle">
          <Col span={5}>
            <Form.Item name="searchText" className="mb-0">
              <Input placeholder="学员姓名/ID/课程" allowClear />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="courseIds" className="mb-0">
              <Select
                mode="multiple"
                placeholder="选择课程"
                options={courseOptions}
                allowClear
                style={{ width: '100%' }}
                maxTagCount="responsive"
                maxTagPlaceholder={(omittedValues) => `+${omittedValues.length}`}
                getPopupContainer={triggerNode => triggerNode.parentNode as HTMLElement}
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="paymentTypes" className="mb-0">
              <Select
                mode="multiple"
                placeholder="选择缴费类型"
                allowClear
                style={{ 
                  width: '100%',
                  minHeight: '32px'
                }}
                maxTagCount="responsive"
                maxTagPlaceholder={(omittedValues) => `+${omittedValues.length}`}
                tagRender={renderPaymentTypeTag}
                getPopupContainer={triggerNode => triggerNode.parentNode as HTMLElement}
              >
                <Option value="NEW">新增</Option>
                <Option value="REFUND">退费</Option>
                <Option value="RENEWAL">续费</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="dateRange" className="mb-0">
              <RangePicker
                style={{ width: '100%', textAlign: 'center' }}
                placeholder={['开始日期', '结束日期']}
                locale={locale}
                format="YYYY-MM-DD"
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item className="mb-0">
              <Space size="middle" style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                  查询
                </Button>
                <Button htmlType="reset" onClick={handleReset} icon={<ReloadOutlined />}>
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

export default FilterForm; 