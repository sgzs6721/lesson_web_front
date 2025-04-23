import React, { useState, useEffect } from 'react';
import { Row, Col, Input, Select, Button, Space } from 'antd';
import { SearchOutlined, ReloadOutlined, SortAscendingOutlined } from '@ant-design/icons';
import { CourseSearchParams, CourseType, CourseStatus } from '../types/course';
import { statusOptions, sortOptions } from '../constants/courseOptions';
import { Constant } from '@/api/constants/types';
import { CoachSimple } from '@/api/coach/types';

const { Option } = Select;

interface CourseSearchBarProps {
  params: CourseSearchParams;
  onSearch: () => void;
  onReset: () => void;
  onTextChange: (value: string) => void;
  onCategoryChange: (value: CourseType | undefined) => void;
  onStatusChange: (value: CourseStatus | undefined) => void;
  onCoachChange?: (value: number | undefined) => void;
  onSortOrderChange: (value: string | undefined) => void;
  cachedTypes?: Constant[];
  cachedCoaches?: CoachSimple[];
  typesLoading?: boolean;
  coachesLoading?: boolean;
}

const CourseSearchBar: React.FC<CourseSearchBarProps> = ({
  params,
  onSearch,
  onReset,
  onTextChange,
  onCategoryChange,
  onStatusChange,
  onCoachChange,
  onSortOrderChange,
  cachedTypes = [],
  cachedCoaches = [],
  typesLoading = false,
  coachesLoading = false
}) => {
  // 将选项转换为Select需要的格式
  const typeOptions = cachedTypes.map(type => ({
    value: type.id,
    label: type.constantValue
  }));

  return (
    <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 24 }}>
      <Col xs={24} sm={12} md={8} lg={4} xl={4}>
        <Input
          placeholder="搜索课程名称"
          value={params.searchText}
          onChange={e => onTextChange(e.target.value)}
          prefix={<SearchOutlined />}
          allowClear
          onPressEnter={onSearch}
        />
      </Col>
      <Col xs={24} sm={12} md={8} lg={4} xl={4}>
        <Select
          placeholder="选择课程分类"
          style={{ width: '100%' }}
          value={params.selectedType}
          onChange={value => onCategoryChange(value)}
          allowClear
          loading={typesLoading}
          popupMatchSelectWidth={true}
          getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
        >
          {typeOptions.map(option => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </Col>
      <Col xs={24} sm={12} md={8} lg={4} xl={4}>
        <Select
          placeholder="选择上课教练"
          style={{ width: '100%' }}
          value={params.selectedCoach}
          onChange={value => onCoachChange && onCoachChange(value)}
          allowClear
          loading={coachesLoading}
          popupMatchSelectWidth={true}
          getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
        >
          {cachedCoaches.map(coach => (
            <Option key={coach.id} value={coach.id}>
              {coach.name}
            </Option>
          ))}
        </Select>
      </Col>
      <Col xs={24} sm={12} md={8} lg={4} xl={4}>
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
      </Col>
      <Col xs={24} sm={12} md={8} lg={4} xl={4}>
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
      </Col>
      <Col xs={24} sm={12} md={8} lg={4} xl={4} style={{ display: 'flex', justifyContent: 'center' }}>
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