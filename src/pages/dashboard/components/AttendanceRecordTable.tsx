import React from 'react';
import { AttendanceRecord } from '../types/dashboard';

interface AttendanceRecordTableProps {
  records: AttendanceRecord[];
  onSelectAll: (isChecked: boolean) => void;
  onSelectRecord: (id: string, isChecked: boolean) => void;
  onBatchPunch: () => void;
}

const AttendanceRecordTable: React.FC<AttendanceRecordTableProps> = ({
  records,
  onSelectAll,
  onSelectRecord,
  onBatchPunch
}) => {
  // 处理全选功能
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelectAll(e.target.checked);
  };

  // 处理单个记录选择
  const handleSelectRecord = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    onSelectRecord(id, e.target.checked);
  };

  return (
    <div id="attendance-card" className="dashboard-card" style={{ marginBottom: '20px' }}>
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="card-title" style={{ fontSize: '18px' }}>今日上课学员</div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button 
            className="btn-batch-punch" 
            style={{ marginRight: '10px' }}
            onClick={onBatchPunch}
          >
            批量打卡
          </button>
        </div>
      </div>
      <div className="card-body" style={{ padding: '0' }}>
        <div style={{ overflow: 'auto' }}>
          <table className="attendance-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'center', width: '40px' }}>
                  <input 
                    type="checkbox" 
                    style={{ cursor: 'pointer' }} 
                    onChange={handleSelectAll}
                    id="selectAllAttendance"
                  />
                </th>
                <th>学员姓名</th>
                <th>时间</th>
                <th>教练</th>
                <th>剩余课时</th>
                <th>课程类型</th>
                <th>销课金额</th>
                <th>剩余金额</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {records.map(record => (
                <tr key={record.id}>
                  <td style={{ textAlign: 'center' }}>
                    <input 
                      type="checkbox" 
                      style={{ cursor: 'pointer' }} 
                      data-status={record.status === '未打卡' ? 'unchecked' : record.status === '已打卡' ? 'checked' : 'leave'}
                      disabled={record.isDisabled}
                      checked={record.isChecked || false}
                      onChange={(e) => handleSelectRecord(record.id, e)}
                    />
                  </td>
                  <td>{record.studentName}</td>
                  <td>{record.time}</td>
                  <td>{record.coach}</td>
                  <td>{record.remainingLessons}</td>
                  <td>
                    <span className={`badge badge-${record.status === '未打卡' ? 'warning' : record.status === '已打卡' ? 'success' : 'danger'}`}>
                      {record.status}
                    </span>
                  </td>
                  <td>{record.salesAmount}</td>
                  <td>{record.remainingAmount}</td>
                  <td>
                    <span className={`badge badge-${record.status === '未打卡' ? 'warning' : record.status === '已打卡' ? 'success' : 'danger'}`}>
                      {record.status}
                    </span>
                  </td>
                  <td>
                    {record.status === '未打卡' ? (
                      <div>
                        <button className="btn-leave" style={{ marginRight: '8px' }}>请假</button>
                        <button className="btn-punch">打卡</button>
                      </div>
                    ) : (
                      <span style={{ color: '#888', fontSize: '12px' }}>
                        {record.status === '已打卡' ? '已完成' : '已请假'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceRecordTable; 