import React, { useState, useRef, useEffect } from 'react';
import { Spin, Popover } from 'antd';
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
  const totalPanelRef = useRef<HTMLDivElement>(null);
  const [totalPanelWidth, setTotalPanelWidth] = useState<number>(0);

  // 监听总数面板的宽度变化
  useEffect(() => {
    if (totalPanelRef.current) {
      setTotalPanelWidth(totalPanelRef.current.offsetWidth);
      
      // 添加窗口大小变化监听
      const handleResize = () => {
        if (totalPanelRef.current) {
          setTotalPanelWidth(totalPanelRef.current.offsetWidth);
        }
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);
  
  // 定义悬浮详情组件内容
  const studentDetailContent = (
    <div style={{ 
      width: totalPanelWidth > 0 ? `${totalPanelWidth}px` : '280px',
      padding: '0',
    }}>
      {/* 在学学员 */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: '8px 16px',
        borderBottom: '1px solid #f0f0f0',
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          width: '100%',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <UserOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
            <span style={{ fontSize: '13px', color: 'rgba(0, 0, 0, 0.65)' }}>
              在学学员
            </span>
          </div>
          <span style={{ fontSize: '17px', fontWeight: 'bold', color: '#52c41a' }}>
            {loadingStats ? <Spin size="small" /> : studyingStudents}
          </span>
        </div>
      </div>
      
      {/* 结业学员 */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: '8px 16px',
        borderBottom: '1px solid #f0f0f0',
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          width: '100%',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <UserOutlined style={{ color: '#f56c6c', marginRight: '8px' }} />
            <span style={{ fontSize: '13px', color: 'rgba(0, 0, 0, 0.65)' }}>
              结业学员
            </span>
          </div>
          <span style={{ fontSize: '17px', fontWeight: 'bold', color: '#f56c6c' }}>
            {loadingStats ? <Spin size="small" /> : graduatedStudents}
          </span>
        </div>
      </div>
      
      {/* 过期学员 */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: '8px 16px',
        borderBottom: '1px solid #f0f0f0',
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          width: '100%',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <UserOutlined style={{ color: '#faad14', marginRight: '8px' }} />
            <span style={{ fontSize: '13px', color: 'rgba(0, 0, 0, 0.65)' }}>
              过期学员
            </span>
          </div>
          <span style={{ fontSize: '17px', fontWeight: 'bold', color: '#faad14' }}>
            {loadingStats ? <Spin size="small" /> : expiredStudents}
          </span>
        </div>
      </div>
      
      {/* 退费学员 */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: '8px 16px',
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          width: '100%',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <UserOutlined style={{ color: '#9254de', marginRight: '8px' }} />
            <span style={{ fontSize: '13px', color: 'rgba(0, 0, 0, 0.65)' }}>
              退费学员
            </span>
          </div>
          <span style={{ fontSize: '17px', fontWeight: 'bold', color: '#9254de' }}>
            {loadingStats ? <Spin size="small" /> : refundedStudents}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', gap: '16px' }}>
      {/* 学员统计长标签 */}
      <Popover 
        content={studentDetailContent} 
        title={null}
        placement="bottom" 
        trigger="hover"
        overlayStyle={{ minWidth: totalPanelWidth > 0 ? `${totalPanelWidth}px` : '280px' }}
        overlayInnerStyle={{ padding: 0 }}
      >
        <div 
          ref={totalPanelRef}
          style={{
            display: 'flex',
            alignItems: 'stretch',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            overflow: 'hidden',
            border: '1px solid #e8e8e8',
            height: '36px',
            cursor: 'pointer',
          }}
        >
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
        </div>
      </Popover>
      
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