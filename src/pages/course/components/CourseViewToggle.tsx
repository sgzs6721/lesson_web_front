import React from 'react';
import { Button, Space, Tooltip } from 'antd';
import { UnorderedListOutlined, AppstoreOutlined, PlusOutlined } from '@ant-design/icons';
import './CourseViewToggle.css';

interface CourseViewToggleProps {
  viewMode: 'list' | 'card';
  onViewModeChange: (mode: 'list' | 'card') => void;
  onAddCourse: () => void;
  style?: React.CSSProperties;
}

const CourseViewToggle: React.FC<CourseViewToggleProps> = ({
  viewMode,
  onViewModeChange,
  onAddCourse,
  style
}) => {
  return (
    <div className="view-toggle-wrapper" style={style}>
      <div className="view-toggle-container">
        <Tooltip title="列表视图">
          <button
            className={`view-toggle-button ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => onViewModeChange('list')}
          >
            <UnorderedListOutlined />
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
        className="add-course-button"
        onClick={onAddCourse}
        style={{
          background: 'linear-gradient(135deg, #52c41a, #1890ff)',
          border: 'none',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
          fontWeight: 500
        }}
      >
        添加课程
      </Button>
    </div>
  );
};

export default CourseViewToggle;
