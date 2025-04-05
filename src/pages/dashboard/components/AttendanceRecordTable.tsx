import React, { useState, useEffect } from 'react';
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
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(records);

  // 当外部记录变化时更新本地状态
  useEffect(() => {
    setAttendanceRecords(records);
  }, [records]);

  // 处理全选功能
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelectAll(e.target.checked);
  };

  // 处理单个记录选择
  const handleSelectRecord = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    onSelectRecord(id, e.target.checked);
  };

  // 处理单个学员打卡
  const handlePunch = (id: string) => {
    // 找到要打卡的学员
    const studentToPunch = attendanceRecords.find(r => r.id === id);
    if (!studentToPunch) return;
    
    // 更新本地状态
    const updatedRecords = attendanceRecords.map(record => 
      record.id === id 
        ? { ...record, status: '已打卡' as const, isDisabled: true, isChecked: false }
        : record
    );
    setAttendanceRecords(updatedRecords);
    
    // 通知父组件取消选中该学员，因为打卡后学员已被禁用
    onSelectRecord(id, false);
    
    alert(`${studentToPunch.studentName} 打卡成功！`);
  };

  // 处理单个学员请假
  const handleLeave = (id: string) => {
    // 找到要请假的学员
    const studentToLeave = attendanceRecords.find(r => r.id === id);
    if (!studentToLeave) return;
    
    // 更新本地状态
    const updatedRecords = attendanceRecords.map(record => 
      record.id === id 
        ? { ...record, status: '已请假' as const, isDisabled: true, isChecked: false }
        : record
    );
    setAttendanceRecords(updatedRecords);
    
    // 通知父组件取消选中该学员，因为请假后学员已被禁用
    onSelectRecord(id, false);
    
    alert(`${studentToLeave.studentName} 请假成功！`);
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
                <th style={{ textAlign: 'center' }}>学员姓名</th>
                <th style={{ textAlign: 'center' }}>时间</th>
                <th style={{ textAlign: 'center' }}>教练</th>
                <th style={{ textAlign: 'center' }}>剩余课时</th>
                <th style={{ textAlign: 'center' }}>课程类型</th>
                <th style={{ textAlign: 'center' }}>销课金额</th>
                <th style={{ textAlign: 'center' }}>剩余金额</th>
                <th style={{ textAlign: 'center' }}>状态</th>
                <th style={{ textAlign: 'center', width: '160px' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.map(record => (
                <tr key={record.id} className={record.status === '未打卡' ? 'unchecked-record' : ''}>
                  <td style={{ textAlign: 'center' }}>
                    <input 
                      type="checkbox" 
                      style={{ cursor: record.isDisabled ? 'not-allowed' : 'pointer' }} 
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
                      {record.courseType}
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
                      <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
                        <button 
                          className="btn-punch"
                          onClick={() => handlePunch(record.id)}
                        >
                          打卡
                        </button>
                        <button 
                          className="btn-leave"
                          onClick={() => handleLeave(record.id)}
                        >
                          请假
                        </button>
                      </div>
                    ) : (
                      <span style={{ color: '#888', fontSize: '12px', textAlign: 'center', display: 'block' }}>
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