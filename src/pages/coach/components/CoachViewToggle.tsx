import React from 'react';
import { Space, Button, Tooltip } from 'antd';
import { TableOutlined, AppstoreOutlined, PlusOutlined } from '@ant-design/icons';
import { ViewMode } from '../types/coach';
import './CoachViewToggle.css';

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
    <div className="view-toggle-wrapper">
      <div className="view-toggle-container">
        <Tooltip title="表格视图">
          <button 
            className={`view-toggle-button ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => onViewModeChange('table')}
          >
            <TableOutlined />
          </button>
        </Tooltip>
        <Tooltip title="卡片视图">
          <button 
            className={`view-toggle-button ${viewMode === 'card' ? 'active' : ''}`}
            onClick={() => onViewModeChange('card')}
          >
            <AppstoreOutlined />
          </button>
        </Tooltip>
      </div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        className="add-coach-button"
        onClick={onAddCoach}
      >
        添加教练
      </Button>
    </div>
  );
};

export default CoachViewToggle; 