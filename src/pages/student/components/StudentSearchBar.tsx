import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Space, Row, Col, DatePicker } from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  ExportOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined
} from '@ant-design/icons';
import { StudentSearchParams } from '@/pages/student/types/student';
import { studentStatusOptions } from '@/pages/student/constants/options';
import { SimpleCourse } from '@/api/course/types';
import locale from 'antd/es/date-picker/locale/zh_CN';
import dayjs from 'dayjs';

const { Option } = Select;
const { MonthPicker } = DatePicker;

interface StudentSearchBarProps {
  params: StudentSearchParams;
  onSearch: () => void;
  onReset: () => void;
  onExport: () => void;
  onTextChange: (value: string) => void;
  onStatusChange: (value: string | undefined) => void;
  onCourseChange: (value: string | undefined) => void;
  onMonthChange: (value: any) => void;
  onSortOrderChange: (value: StudentSearchParams['sortOrder']) => void;
  courseList: SimpleCourse[];
  loadingCourses: boolean;
}

const StudentSearchBar: React.FC<StudentSearchBarProps> = ({
  params,
  onSearch,
  onReset,
  onExport,
  onTextChange,
  onStatusChange,
  onCourseChange,
  onMonthChange,
  onSortOrderChange,
  courseList,
  loadingCourses
}) => {
  return (
    <Form layout="inline" className="student-search-bar">
      <Row gutter={[16, 16]} style={{ width: '100%' }}>
        <Col flex={1}>
          <Form.Item style={{ margin: 0, width: '100%' }}>
            <Input
              placeholder="搜索学员名称/ID/电话"
              value={params.searchText}
              onChange={e => onTextChange(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Form.Item>
        </Col>
        <Col flex={1}>
          <Form.Item style={{ margin: 0, width: '100%' }}>
            <div className="select-wrapper">
              <Select
                placeholder="选择状态"
                style={{ width: '100%' }}
                value={params.selectedStatus}
                onChange={onStatusChange}
                allowClear
                popupMatchSelectWidth={true}
                getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
              >
                {studentStatusOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </div>
          </Form.Item>
        </Col>
        <Col flex={1}>
          <Form.Item style={{ margin: 0, width: '100%' }}>
            <div className="select-wrapper">
              <Select
                placeholder="选择课程"
                style={{ width: '100%' }}
                value={params.selectedCourse}
                onChange={onCourseChange}
                allowClear
                popupMatchSelectWidth={true}
                getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
                loading={loadingCourses}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                }
              >
                {courseList.map(course => (
                  <Option key={course.id} value={course.id}>
                    {course.name}
                  </Option>
                ))}
              </Select>
            </div>
          </Form.Item>
        </Col>
        <Col flex={1}>
          <Form.Item style={{ margin: 0, width: '100%' }}>
            <MonthPicker
              style={{ width: '100%' }}
              placeholder="选择报名年月"
              value={params.enrollMonth}
              onChange={onMonthChange}
              allowClear
              locale={locale}
              format="YYYY年MM月"
            />
          </Form.Item>
        </Col>
        <Col flex={1}>
          <Form.Item style={{ margin: 0, width: '100%' }}>
            <div className="select-wrapper">
              <Select
                placeholder="排序方式"
                style={{ width: '100%' }}
                value={params.sortOrder}
                onChange={onSortOrderChange}
                allowClear
                popupMatchSelectWidth={true}
                getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
              >
                <Option value="enrollDateAsc">
                  <Space>
                    <SortAscendingOutlined />
                    报名日期升序
                  </Space>
                </Option>
                <Option value="enrollDateDesc">
                  <Space>
                    <SortDescendingOutlined />
                    报名日期降序
                  </Space>
                </Option>
                <Option value="ageAsc">
                  <Space>
                    <SortAscendingOutlined />
                    年龄升序
                  </Space>
                </Option>
                <Option value="ageDesc">
                  <Space>
                    <SortDescendingOutlined />
                    年龄降序
                  </Space>
                </Option>
                <Option value="remainingClassesAsc">
                  <Space>
                    <SortAscendingOutlined />
                    剩余课时升序
                  </Space>
                </Option>
                <Option value="remainingClassesDesc">
                  <Space>
                    <SortDescendingOutlined />
                    剩余课时降序
                  </Space>
                </Option>
                <Option value="lastClassDateAsc">
                  <Space>
                    <SortAscendingOutlined />
                    上课时间升序
                  </Space>
                </Option>
                <Option value="lastClassDateDesc">
                  <Space>
                    <SortDescendingOutlined />
                    上课时间降序
                  </Space>
                </Option>
              </Select>
            </div>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item style={{ margin: 0 }}>
            <Space>
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
              <Button 
                icon={<ExportOutlined />} 
                onClick={onExport}
              >
                导出
              </Button>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default StudentSearchBar;