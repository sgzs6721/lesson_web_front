import React, { useState, useEffect, useMemo } from 'react';
import { Form, Input, Select, Button, Space, Row, Col, DatePicker } from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  ExportOutlined
} from '@ant-design/icons';
import { StudentSearchParams } from '@/pages/student/types/student';
import { studentStatusOptions } from '@/pages/student/constants/options';
import { SimpleCourse } from '@/api/course/types';
import { CourseStatus } from '@/api/course/types';
import locale from 'antd/es/date-picker/locale/zh_CN';
import dayjs from 'dayjs';

const { Option } = Select;
const { MonthPicker } = DatePicker;

// 课程状态转换为中文文本
const getCourseStatusText = (status: string): string => {
  switch (status) {
    case CourseStatus.PUBLISHED:
    case '1':
    case 'PUBLISHED':
      return '已发布';
    case CourseStatus.DRAFT:
    case '0':
    case 'DRAFT':
      return '草稿';
    case CourseStatus.SUSPENDED:
      return '已暂停';
    case CourseStatus.TERMINATED:
      return '已终止';
    default:
      return '未知状态';
  }
};

interface StudentSearchBarProps {
  params: StudentSearchParams;
  onSearch: () => void;
  onReset: () => void;
  onExport: () => void;
  onTextChange: (value: string) => void;
  onStatusChange: (value: string | undefined) => void;
  onCourseChange: (value: string | undefined) => void;
  onMonthChange: (value: any) => void;
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
  courseList,
  loadingCourses
}) => {
  const sortedCourseList = useMemo(() => {
    const courses = [...courseList];
    return courses.sort((a, b) => {
      const aNum = Number(a.id);
      const bNum = Number(b.id);
      const aIsNum = !Number.isNaN(aNum);
      const bIsNum = !Number.isNaN(bNum);
      if (aIsNum && bIsNum) return aNum - bNum;
      const aStr = String(a.id);
      const bStr = String(b.id);
      return aStr.localeCompare(bStr, 'zh-Hans-CN');
    });
  }, [courseList]);

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
                {sortedCourseList.map(course => (
                  <Option key={course.id} value={course.id as any}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{course.name}</span>
                      <span style={{ fontSize: '12px', color: '#888' }}>
                        {getCourseStatusText(course.status)}
                      </span>
                    </div>
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