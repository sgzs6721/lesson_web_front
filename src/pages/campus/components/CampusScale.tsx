import React from 'react';
import './CampusScale.css';

interface CampusScaleProps {
  studentCount: number;
  coachCount: number;
  pendingLessonCount: number;
}

const CampusScale: React.FC<CampusScaleProps> = ({
  studentCount = 0,
  coachCount = 0,
  pendingLessonCount = 0
}) => {
  return (
    <div className="campus-scale-combined-container">
      <div className="campus-scale-combined-content">
        {/* Student count item */}
        <div className="scale-combined-item">
          <div className="scale-icon-wrapper scale-icon-student">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="#3498db">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <div className="scale-label">学员数</div>
          <div className="scale-value scale-value-student">{studentCount}</div>
        </div>

        {/* Coach count item */}
        <div className="scale-combined-item">
          <div className="scale-icon-wrapper scale-icon-coach">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="#2ecc71">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z" />
            </svg>
          </div>
          <div className="scale-label">教练数</div>
          <div className="scale-value scale-value-coach">{coachCount}</div>
        </div>

        {/* Pending lesson count item */}
        <div className="scale-combined-item">
          <div className="scale-icon-wrapper scale-icon-lesson">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="#f39c12">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
            </svg>
          </div>
          <div className="scale-label">待销课时</div>
          <div className="scale-value scale-value-lesson">{pendingLessonCount}</div>
        </div>
      </div>
    </div>
  );
};

export default CampusScale;
