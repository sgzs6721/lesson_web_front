import React from 'react';
import { Modal, Button } from 'antd';
import { ScheduleChange } from '../types/schedule';

interface ScheduleChangeModalProps {
  visible: boolean;
  changes: ScheduleChange[];
  onConfirm: () => void;
  onCancel: () => void;
}

const ScheduleChangeModal: React.FC<ScheduleChangeModalProps> = ({
  visible,
  changes,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      title="课表变更确认"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="confirm" type="primary" onClick={onConfirm}>
          确认变更
        </Button>,
      ]}
    >
      {changes.length === 0 ? (
        <p>未检测到课表变更</p>
      ) : (
        changes.map((change, index) => (
          <div key={index} className="change-item">
            <div className="change-header">
              变更 {index + 1}: {change.weekday} {change.timeSlot}
            </div>
            <div className="change-detail">
              <div className="change-before">
                <div className="change-label">变更前:</div>
                {change.before.map((student, i) => (
                  <div key={i} className="student-change">
                    {student}
                  </div>
                ))}
              </div>
              <div className="change-after">
                <div className="change-label">变更后:</div>
                {change.after.map((student, i) => (
                  <div key={i} className="student-change">
                    {student}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))
      )}
    </Modal>
  );
};

export default ScheduleChangeModal; 