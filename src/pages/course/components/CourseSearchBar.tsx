import React from 'react';
import { Row, Col, Input, Select, Button, Space } from 'antd';
import { SearchOutlined, ReloadOutlined, SortAscendingOutlined } from '@ant-design/icons';
import { CourseSearchParams, CourseType, CourseStatus } from '../types/course';
import { categoryOptions, statusOptions, sortOptions } from '../constants/courseOptions';

const { Option } = Select;

interface CourseSearchBarProps {
  params: CourseSearchParams;
  onSearch: () => void;
  onReset: () => void;
  onTextChange: (value: string) => void;
  onCategoryChange: (value: CourseType | undefined) => void;
  onStatusChange: (value: CourseStatus | undefined) => void;
  onSortOrderChange: (value: string | undefined) => void;
}

const CourseSearchBar: React.FC<CourseSearchBarProps> = ({
  params,
  onSearch,
  onReset,
  onTextChange,
  onCategoryChange,
  onStatusChange,
  onSortOrderChange
}) => {
  return (
    <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 24 }}>
      <Col xs={24} sm={12} md={6} lg={5}>
        <Input
          placeholder="搜索课程名称"
          value={params.searchText}
          onChange={e => onTextChange(e.target.value)}
          prefix={<SearchOutlined />}
          allowClear
          onPressEnter={onSearch}
        />
      </Col>
      <Col xs={24} sm={12} md={6} lg={5}>
        <div className="select-wrapper">
          <Select
            placeholder="选择课程分类"
            style={{ width: '100%' }}
            value={params.selectedType}
            onChange={value => onCategoryChange(value)}
            allowClear
            popupMatchSelectWidth={true}
            getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
          >
            {categoryOptions.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </div>
      </Col>
      <Col xs={24} sm={12} md={6} lg={5}>
        <div className="select-wrapper">
          <Select
            placeholder="选择课程状态"
            style={{ width: '100%' }}
            value={params.selectedStatus}
            onChange={value => onStatusChange(value)}
            allowClear
            popupMatchSelectWidth={true}
            getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
          >
            {statusOptions.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </div>
      </Col>
      <Col xs={24} sm={12} md={6} lg={5}>
        <div className="select-wrapper">
          <Select
            placeholder="排序方式"
            style={{ width: '100%' }}
            value={params.sortOrder}
            onChange={value => onSortOrderChange(value)}
            allowClear
            suffixIcon={<SortAscendingOutlined />}
            popupMatchSelectWidth={true}
            getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
          >
            {sortOptions.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </div>
      </Col>
      <Col xs={24} lg={4} style={{ display: 'flex', justifyContent: 'center' }}>
        <Space size="middle">
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={onSearch}
          >
            查询
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={onReset}
          >
            重置
          </Button>
        </Space>
      </Col>
    </Row>
  );
};

export default CourseSearchBar;