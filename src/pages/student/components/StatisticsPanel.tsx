import React from 'react';
import { Spin } from 'antd';
import { UserOutlined, ReadOutlined } from '@ant-design/icons';

interface StatisticsPanelProps {
  totalStudents: number;
  studyingStudents: number;
  graduatedStudents: number;
  expiredStudents: number;
  refundedStudents: number;
  courseCount: number;
  loadingStats: boolean;
  loadingCourses: boolean;
}

/**
 * 学员和课程统计面板组件
 */
const StatisticsPanel: React.FC<StatisticsPanelProps> = ({
  totalStudents,
  studyingStudents,
  graduatedStudents,
  expiredStudents,
  refundedStudents,
  courseCount,
  loadingStats,
  loadingCourses
}) => {
  return (
    <div style={{ display: 'flex', gap: '16px' }}>
      {/* 学员统计长标签 */}
      <div style={{
        display: 'flex',
        alignItems: 'stretch',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
        border: '1px solid #e8e8e8',
        height: '36px',
      }}>
        {/* 学员标签 */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#2474d9',
          color: 'white',
          width: '56px',
          fontSize: '13px',
          fontWeight: 'bold',
        }}>
          学员
        </div>
      
        {/* 学员总数 */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: '0 16px',
          borderRight: '1px solid #f0f0f0',
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
          }}>
            <UserOutlined style={{ color: '#2474d9', marginRight: '8px' }} />
            <span style={{ fontSize: '13px', color: 'rgba(0, 0, 0, 0.65)', marginRight: '6px' }}>
              学员总数
            </span>
            <span style={{ fontSize: '17px', fontWeight: 'bold', color: '#2474d9' }}>
              {loadingStats ? <Spin size="small" /> : totalStudents}
            </span>
          </div>
        </div>
        
        {/* 在学学员 */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: '0 16px',
          borderRight: '1px solid #f0f0f0',
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
          }}>
            <UserOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
            <span style={{ fontSize: '13px', color: 'rgba(0, 0, 0, 0.65)', marginRight: '6px' }}>
              在学学员
            </span>
            <span style={{ fontSize: '17px', fontWeight: 'bold', color: '#52c41a' }}>
              {loadingStats ? <Spin size="small" /> : studyingStudents}
            </span>
          </div>
        </div>
        
        {/* 结业学员 */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: '0 16px',
          borderRight: '1px solid #f0f0f0',
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
          }}>
            <UserOutlined style={{ color: '#f56c6c', marginRight: '8px' }} />
            <span style={{ fontSize: '13px', color: 'rgba(0, 0, 0, 0.65)', marginRight: '6px' }}>
              结业学员
            </span>
            <span style={{ fontSize: '17px', fontWeight: 'bold', color: '#f56c6c' }}>
              {loadingStats ? <Spin size="small" /> : graduatedStudents}
            </span>
          </div>
        </div>
        
        {/* 过期学员 */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: '0 16px',
          borderRight: '1px solid #f0f0f0',
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
          }}>
            <UserOutlined style={{ color: '#faad14', marginRight: '8px' }} />
            <span style={{ fontSize: '13px', color: 'rgba(0, 0, 0, 0.65)', marginRight: '6px' }}>
              过期学员
            </span>
            <span style={{ fontSize: '17px', fontWeight: 'bold', color: '#faad14' }}>
              {loadingStats ? <Spin size="small" /> : expiredStudents}
            </span>
          </div>
        </div>
        
        {/* 退费学员 */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: '0 16px',
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
          }}>
            <UserOutlined style={{ color: '#9254de', marginRight: '8px' }} />
            <span style={{ fontSize: '13px', color: 'rgba(0, 0, 0, 0.65)', marginRight: '6px' }}>
              退费学员
            </span>
            <span style={{ fontSize: '17px', fontWeight: 'bold', color: '#9254de' }}>
              {loadingStats ? <Spin size="small" /> : refundedStudents}
            </span>
          </div>
        </div>
      </div>
      
      {/* 课程总数 */}
      <div style={{
        display: 'flex',
        alignItems: 'stretch',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
        border: '1px solid #e8e8e8',
        height: '36px',
      }}>
        {/* 课程标签 */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#52c41a',
          color: 'white',
          width: '56px',
          fontSize: '13px',
          fontWeight: 'bold',
        }}>
          课程
        </div>
      
        {/* 课程总数 */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: '0 16px',
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
          }}>
            <ReadOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
            <span style={{ fontSize: '13px', color: 'rgba(0, 0, 0, 0.65)', marginRight: '6px' }}>
              课程总数
            </span>
            <span style={{ fontSize: '17px', fontWeight: 'bold', color: '#52c41a' }}>
              {loadingCourses ? <Spin size="small" /> : courseCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPanel; 