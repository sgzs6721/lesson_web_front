import React from 'react';
import { Input, Select, Button, Row, Col, Space } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { CoachSearchParams } from '../types/coach';

const { Option } = Select;

interface CoachSearchBarProps {
  params: CoachSearchParams;
  onSearch: () => void;
  onReset: () => void;
  onTextChange: (value: string) => void;
  onStatusChange: (value: string | undefined) => void;
  onJobTitleChange: (value: string | undefined) => void;
  onSortFieldChange: (value: 'experience' | 'hireDate' | 'status' | 'age' | 'jobTitle' | 'gender' | undefined) => void;
}

const CoachSearchBar: React.FC<CoachSearchBarProps> = ({
  params,
  onSearch,
  onReset,
  onTextChange,
  onStatusChange,
  onJobTitleChange,
  onSortFieldChange
}) => {
  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap' }}>
      <Col style={{ flex: 1, minWidth: '150px' }}>
        <Input
          placeholder="搜索教练姓名/ID/电话"
          value={params.searchText}
          onChange={e => onTextChange(e.target.value)}
          prefix={<SearchOutlined />}
          allowClear
        />
      </Col>
      <Col style={{ flex: 1, minWidth: '120px' }}>
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
            <Option value="active">在职</Option>
            <Option value="vacation">休假中</Option>
            <Option value="resigned">已离职</Option>
          </Select>
        </div>
      </Col>
      <Col style={{ flex: 1, minWidth: '120px' }}>
        <div className="select-wrapper">
          <Select
            placeholder="选择职位"
            style={{ width: '100%' }}
            value={params.selectedJobTitle}
            onChange={onJobTitleChange}
            allowClear
            popupMatchSelectWidth={true}
            getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
          >
            <Option value="高级教练">高级教练</Option>
            <Option value="中级教练">中级教练</Option>
            <Option value="初级教练">初级教练</Option>
          </Select>
        </div>
      </Col>
      <Col style={{ flex: 1, minWidth: '150px' }}>
        <div className="select-wrapper">
          <Select
            placeholder="默认排序"
            style={{ width: '100%' }}
            value={params.sortField}
            onChange={onSortFieldChange}
            allowClear
            popupMatchSelectWidth={true}
            getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
          >
            <Option value="experience">按教龄排序</Option>
            <Option value="hireDate">按入职日期排序</Option>
            <Option value="status">按状态排序</Option>
            <Option value="age">按年龄排序</Option>
            <Option value="jobTitle">按职位排序</Option>
            <Option value="gender">按性别排序</Option>
          </Select>
        </div>
      </Col>
      <Col style={{ flex: 'none' }}>
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
        </Space>
      </Col>
    </Row>
  );
};

export default CoachSearchBar;