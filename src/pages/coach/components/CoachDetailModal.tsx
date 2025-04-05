import React from 'react';
import { Modal, Descriptions, Avatar, Tag, Space, Button } from 'antd';
import dayjs from 'dayjs';
import { Coach } from '../types/coach';
import { getStatusTagInfo } from '../utils/formatters';

interface CoachDetailModalProps {
  visible: boolean;
  coach: Coach | null;
  onCancel: () => void;
}

const CoachDetailModal: React.FC<CoachDetailModalProps> = ({
  visible,
  coach,
  onCancel
}) => {
  if (!coach) return null;

  // 渲染状态标签
  const renderStatusTag = (status: string) => {
    const { color, text } = getStatusTagInfo(status);
    return <Tag color={color}>{text}</Tag>;
  };

  return (
    <Modal
      title="教练详情"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel}>
          关闭
        </Button>
      ]}
      width={700}
    >
      <Descriptions bordered column={2} size="small">
        <Descriptions.Item label="教练ID" span={1}>{coach.id}</Descriptions.Item>
        <Descriptions.Item label="年龄" span={1}>{coach.age}</Descriptions.Item>
        
        <Descriptions.Item label="姓名" span={1}>
          <Space>
            {coach.avatar && <Avatar size="small" src={coach.avatar} />}
            {coach.name}
            {coach.gender === 'male' ? 
              <span style={{ color: '#1890ff' }}>♂</span> : 
              <span style={{ color: '#eb2f96' }}>♀</span>
            }
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="状态" span={1}>{renderStatusTag(coach.status)}</Descriptions.Item>

        <Descriptions.Item label="联系电话" span={1}>{coach.phone}</Descriptions.Item>
        <Descriptions.Item label="职位" span={1}>{coach.jobTitle}</Descriptions.Item>

        <Descriptions.Item label="入职日期" span={1}>{dayjs(coach.hireDate).format('YYYY-MM-DD')}</Descriptions.Item>
        <Descriptions.Item label="教龄" span={1}>{`${coach.experience}年`}</Descriptions.Item>

        <Descriptions.Item label="证书" span={2}>
          {coach.certifications.split('，').map((cert, index) => (
            <Tag key={index} style={{ marginBottom: 4 }}>{cert.trim()}</Tag>
          ))}
        </Descriptions.Item>

        <Descriptions.Item label="基本工资" span={1}>{`¥${coach.baseSalary?.toLocaleString() ?? 'N/A'}`}</Descriptions.Item>
        <Descriptions.Item label="社保费" span={1}>{`¥${coach.socialSecurity?.toLocaleString() ?? 'N/A'}`}</Descriptions.Item>
        <Descriptions.Item label="课时费" span={1}>{`¥${coach.hourlyRate?.toLocaleString() ?? 'N/A'} /时`}</Descriptions.Item>
        <Descriptions.Item label="绩效奖金" span={1}>{`¥${coach.performanceBonus?.toLocaleString() ?? 'N/A'}`}</Descriptions.Item>
        <Descriptions.Item label="提成" span={1}>{`${coach.commission ?? 'N/A'}%`}</Descriptions.Item>
        <Descriptions.Item label="分红" span={1}>{`¥${coach.dividend?.toLocaleString() ?? 'N/A'}`}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default CoachDetailModal; 