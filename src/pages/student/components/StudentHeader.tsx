import React from 'react';
import { Button, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import StatisticsPanel from './StatisticsPanel';

const { Title } = Typography;

interface StudentHeaderProps {
  totalStudents: number;
  studyingStudents: number;
  graduatedStudents: number;
  expiredStudents: number;
  refundedStudents: number;
  pendingRenewalStudents: number;
  courseCount: number;
  loadingStats: boolean;
  loadingCourses: boolean;
  onAddStudent: () => void;
}

/**
 * 学员管理页面标题和统计信息组件
 */
const StudentHeader: React.FC<StudentHeaderProps> = ({
  totalStudents,
  studyingStudents,
  graduatedStudents,
  expiredStudents,
  refundedStudents,
  pendingRenewalStudents,
  courseCount,
  loadingStats,
  loadingCourses,
  onAddStudent
}) => {
  return (
    <div className="student-header">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Title level={4} className="student-title" style={{ marginRight: '24px', marginBottom: 0 }}>学员管理</Title>
        
        <StatisticsPanel
          totalStudents={totalStudents}
          studyingStudents={studyingStudents}
          graduatedStudents={graduatedStudents}
          expiredStudents={expiredStudents}
          refundedStudents={refundedStudents}
          pendingRenewalStudents={pendingRenewalStudents}
          courseCount={courseCount}
          loadingStats={loadingStats}
          loadingCourses={loadingCourses}
        />
      </div>
      
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={onAddStudent}
        className="add-student-button"
        style={{
          background: 'linear-gradient(135deg, #52c41a, #1890ff)',
          border: 'none',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
          fontWeight: 500,
          borderRadius: '8px',
          transition: 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)'
        }}
      >
        添加学员
      </Button>
    </div>
  );
};

export default StudentHeader; 