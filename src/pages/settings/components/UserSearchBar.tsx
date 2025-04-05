import React from 'react';
import { Row, Col, Input, Select, Button, Space } from 'antd';
import { SearchOutlined, RedoOutlined } from '@ant-design/icons';
import { UserSearchParams } from '../types/user';
import { roleOptions, campusOptions, statusOptions } from '../constants/userOptions';

const { Option } = Select;

interface UserSearchBarProps {
  params: UserSearchParams;
  onSearch: () => void;
  onReset: () => void;
  onTextChange: (value: string) => void;
  onRoleChange: (value: string[]) => void;
  onCampusChange: (value: string[]) => void;
  onStatusChange: (value: ('active' | 'inactive')[]) => void;
}

const UserSearchBar: React.FC<UserSearchBarProps> = ({
  params,
  onSearch,
  onReset,
  onTextChange,
  onRoleChange,
  onCampusChange,
  onStatusChange
}) => {
  return (
    <Row gutter={[16, 16]} style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 16 }}>
      <Col style={{ flex: 1, minWidth: '180px' }}>
        <Input
          placeholder="搜索电话/姓名/ID"
          value={params.searchText}
          onChange={e => onTextChange(e.target.value)}
          prefix={<SearchOutlined />}
          allowClear
        />
      </Col>
      
      <Col style={{ flex: 1, minWidth: '150px' }}>
        <Select
          mode="multiple"
          placeholder="选择角色 (可多选)"
          style={{ width: '100%' }}
          value={params.selectedRole}
          onChange={onRoleChange}
          allowClear
          maxTagCount="responsive"
        >
          {roleOptions.map(option => (
            <Option key={option.value} value={option.value}>{option.label}</Option>
          ))}
        </Select>
      </Col>
      
      <Col style={{ flex: 1, minWidth: '150px' }}>
        <Select
          mode="multiple"
          placeholder="选择校区 (可多选)"
          style={{ width: '100%' }}
          value={params.selectedCampus}
          onChange={onCampusChange}
          allowClear
          maxTagCount="responsive"
        >
          {campusOptions.map(option => (
            <Option key={option.value} value={option.value}>{option.label}</Option>
          ))}
        </Select>
      </Col>
      
      <Col style={{ flex: 1, minWidth: '150px' }}>
        <Select
          mode="multiple"
          placeholder="选择状态 (可多选)"
          style={{ width: '100%' }}
          value={params.selectedStatus}
          onChange={onStatusChange}
          allowClear
          maxTagCount="responsive"
        >
          {statusOptions.map(option => (
            <Option key={option.value} value={option.value}>{option.label}</Option>
          ))}
        </Select>
      </Col>
      
      <Col style={{ flex: 'none' }}>
        <Space size="middle">
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={onSearch}
          >
            查询
          </Button>
          <Button
            icon={<RedoOutlined />}
            onClick={onReset}
          >
            重置
          </Button>
        </Space>
      </Col>
    </Row>
  );
};

export default UserSearchBar; 