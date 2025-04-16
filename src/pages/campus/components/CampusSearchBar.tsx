import React from 'react';
import { Row, Col, Input, Select, Button, Space } from 'antd';
import { SearchOutlined, RedoOutlined } from '@ant-design/icons';
import { CampusSearchParams } from '../types/campus';

const { Option } = Select;

interface CampusSearchBarProps {
  params: CampusSearchParams;
  onTextChange: (value: string) => void;
  onStatusChange: (value: string | undefined) => void;
  onSearch: () => void;
  onReset: () => void;
}

const CampusSearchBar: React.FC<CampusSearchBarProps> = ({
  params,
  onTextChange,
  onStatusChange,
  onSearch,
  onReset
}) => {
  return (
    <Row gutter={[16, 16]} style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 16 }}>
      {/* 调整 flex 比例，让 Input 更长 */}
      <Col style={{ flex: '2 1 200px', minWidth: '200px' }}> {/* 搜索框 - flex-grow: 2 */}
        <Input
          placeholder="搜索校区名称/地址/电话"
          value={params.searchText}
          onChange={e => onTextChange(e.target.value)}
          prefix={<SearchOutlined />}
          allowClear
        />
      </Col>
      <Col style={{ flex: '1 1 150px', minWidth: '150px' }}> {/* 状态选择 - flex-grow: 1 */}
        <div className="select-wrapper">
          <Select
            placeholder="选择状态"
            style={{ width: '100%' }}
            value={params.selectedStatus}
            onChange={value => onStatusChange(value)}
            allowClear
            popupMatchSelectWidth={true}
            getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
          >
            <Option value="OPERATING">营业中</Option>
            <Option value="CLOSED">已关闭</Option>
          </Select>
        </div>
      </Col>
      {/* 按钮组 */}
      <Col style={{ flex: 'none' }}> {/* 让按钮组根据内容自适应宽度 */}
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

export default CampusSearchBar;