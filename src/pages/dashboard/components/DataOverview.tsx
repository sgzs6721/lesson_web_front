import React from 'react';
import { PeriodType } from '../types/dashboard';

interface DataOverviewProps {
  activePeriod: PeriodType;
  onTogglePeriod: (period: PeriodType) => void;
}

const DataOverview: React.FC<DataOverviewProps> = ({
  activePeriod,
  onTogglePeriod
}) => {
  return (
    <div className="dashboard-card" style={{ marginBottom: '20px' }}>
      <div className="card-header">
        <div className="card-title" style={{ fontSize: '18px' }}>数据总览</div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="period-tabs" style={{ marginRight: '10px' }}>
            <button 
              className={`period-tab ${activePeriod === 'week' ? 'active' : ''}`}
              onClick={() => onTogglePeriod('week')}
            >本周</button>
            <button 
              className={`period-tab ${activePeriod === 'month' ? 'active' : ''}`}
              onClick={() => onTogglePeriod('month')}
            >本月</button>
          </div>
        </div>
      </div>
      <div className="card-body">
        <div className="stats-grid">
          {/* 总流水 */}
          <div className="stat-box">
            <div className="stat-box-title">总流水</div>
            <div className="stat-box-value">¥358,645</div>
            <div className="stat-box-subtitle">
              较上月 <span className="stat-highlight">+8.5%</span>
            </div>
          </div>
          
          {/* 总利润 */}
          <div className="stat-box">
            <div className="stat-box-title">总利润</div>
            <div className="stat-box-value">¥176,290</div>
            <div className="stat-box-subtitle">
              较上月 <span className="stat-highlight">+6.2%</span>
            </div>
          </div>
          
          {/* 总学员数 */}
          <div className="stat-box">
            <div className="stat-box-title">总学员数</div>
            <div className="stat-box-value">147</div>
            <div className="stat-box-subtitle">
              较上月 <span className="stat-highlight">+12%</span>
            </div>
          </div>
          
          {/* 教练数量 */}
          <div className="stat-box">
            <div className="stat-box-title">教练数量</div>
            <div className="stat-box-value">8</div>
            <div className="stat-box-subtitle">
              兼职 <span className="stat-highlight-alt">3</span> | 全职 <span className="stat-highlight-primary">5</span>
            </div>
          </div>
          
          {/* 本周课时 */}
          <div className="stat-box">
            <div className="stat-box-title">本周课时</div>
            <div className="stat-box-value">18/35</div>
            <div className="stat-box-subtitle">
              销课金额 <span className="stat-highlight">¥12,800</span>
            </div>
          </div>
          
          {/* 本周缴费学员 */}
          <div className="stat-box">
            <div className="stat-box-title">本周缴费学员</div>
            <div className="stat-box-value">7</div>
            <div className="stat-box-subtitle">
              新学员 <span className="stat-highlight-alt">3</span> | 续费 <span className="stat-highlight-primary">4</span>
            </div>
          </div>
          
          {/* 本周缴费金额 */}
          <div className="stat-box">
            <div className="stat-box-title">本周缴费金额</div>
            <div className="stat-box-value">¥28,760</div>
            <div className="stat-box-subtitle">
              新学员 <span className="stat-highlight">¥15,200</span> | 续费 <span className="stat-highlight-alt">¥13,560</span>
            </div>
          </div>
          
          {/* 本周出勤率 */}
          <div className="stat-box">
            <div className="stat-box-title">本周出勤率</div>
            <div className="stat-box-value">94.2%</div>
            <div className="stat-box-subtitle">
              较上周 <span className="stat-highlight">+1.7%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataOverview; 