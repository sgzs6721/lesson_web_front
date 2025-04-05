import React from 'react';
import { Radio, Space, Button } from 'antd';
import { TableOutlined, AppstoreOutlined, PlusOutlined } from '@ant-design/icons';
import { ViewMode } from '../types/coach';

interface CoachViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onAddCoach: () => void;
}

const CoachViewToggle: React.FC<CoachViewToggleProps> = ({
  viewMode,
  onViewModeChange,
  onAddCoach
}) => {
  return (
    <Space>
      <Radio.Group
        value={viewMode}
        onChange={(e) => onViewModeChange(e.target.value)}
        buttonStyle="solid"
      >
        <Radio.Button value="table"><TableOutlined /> 表格视图</Radio.Button>
        <Radio.Button value="card"><AppstoreOutlined /> 卡片视图</Radio.Button>
      </Radio.Group>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={onAddCoach}
      >
        添加教练
      </Button>
    </Space>
  );
};

export default CoachViewToggle; 