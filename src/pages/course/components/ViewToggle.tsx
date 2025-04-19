import React from 'react';
import { Button, Space } from 'antd';
import { UnorderedListOutlined, AppstoreOutlined } from '@ant-design/icons';

interface ViewToggleProps {
  viewMode: 'list' | 'card';
  onViewModeChange: (mode: 'list' | 'card') => void;
  style?: React.CSSProperties;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onViewModeChange, style }) => {
  return (
    <Space style={style}>
      <Button
        type={viewMode === 'list' ? 'primary' : 'default'}
        icon={<UnorderedListOutlined />}
        onClick={() => onViewModeChange('list')}
      >
        列表视图
      </Button>
      <Button
        type={viewMode === 'card' ? 'primary' : 'default'}
        icon={<AppstoreOutlined />}
        onClick={() => onViewModeChange('card')}
      >
        卡片视图
      </Button>
    </Space>
  );
};

export default ViewToggle;