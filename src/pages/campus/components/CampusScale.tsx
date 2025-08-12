import React from 'react';
import { UserOutlined, TeamOutlined } from '@ant-design/icons';
import './CampusScale.css';

interface CampusScaleProps {
  studentCount: number;
  coachCount: number;
}

const CampusScale: React.FC<CampusScaleProps> = ({
  studentCount = 0,
  coachCount = 0
}) => {
  return (
    <div className="campus-scale-combined-container">
      <div className="campus-scale-combined-content">
        {/* Student count item */}
        <div className="scale-combined-item">
          <div className="scale-icon-wrapper scale-icon-student">
            <UserOutlined style={{ color: '#3498db', fontSize: 16 }} />
          </div>
          <div className="scale-label">学员数</div>
          <div className="scale-value scale-value-student">{studentCount}</div>
        </div>

        {/* Coach count item */}
        <div className="scale-combined-item">
          <div className="scale-icon-wrapper scale-icon-coach">
            <TeamOutlined style={{ color: '#2ecc71', fontSize: 16 }} />
          </div>
          <div className="scale-label">教练数</div>
          <div className="scale-value scale-value-coach">{coachCount}</div>
        </div>
      </div>
    </div>
  );
};

export default CampusScale;
