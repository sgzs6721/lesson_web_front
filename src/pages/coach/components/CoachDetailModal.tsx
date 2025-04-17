import React from 'react';
import { Modal, Descriptions, Avatar, Tag, Space, Button, Spin } from 'antd';
import dayjs from 'dayjs';
import { Coach } from '../types/coach';
import { getStatusTagInfo } from '../utils/formatters';
import { CoachGender } from '../../../api/coach/types';
import { UserOutlined } from '@ant-design/icons';

interface CoachDetailModalProps {
  visible: boolean;
  coach: Coach | null;
  loading?: boolean;
  onCancel: () => void;
}

const CoachDetailModal: React.FC<CoachDetailModalProps> = ({
  visible,
  coach,
  loading = false,
  onCancel
}) => {
  if (!coach && !loading) return null;

  // 渲染状态标签
  const renderStatusTag = (status: string) => {
    const { color, text } = getStatusTagInfo(status);
    return <Tag color={color}>{text}</Tag>;
  };

  // 自定义标题样式
  const titleStyle = {
    textAlign: 'center',
    fontWeight: 'bold',
    display: 'block'
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
      <Spin spinning={loading}>
        {coach ? (
          <>
            <Descriptions 
              bordered 
              column={2} 
              size="small" 
              title={<div style={titleStyle as React.CSSProperties}>基本信息</div>}
            >
              <Descriptions.Item label="教练ID" span={1}>{coach.id}</Descriptions.Item>
              <Descriptions.Item label="年龄" span={1}>{coach.age}</Descriptions.Item>

              <Descriptions.Item label="姓名" span={1}>
                <Space>
                  <Avatar 
                    size="small" 
                    src={coach.avatar}
                    style={{
                      backgroundColor: !coach.avatar ? (coach.gender === CoachGender.MALE ? '#1890ff' : '#eb2f96') : undefined
                    }}
                    icon={!coach.avatar && <UserOutlined />}
                  />
                  {coach.name}
                  {coach.gender === CoachGender.MALE ?
                    <span style={{ color: '#1890ff' }}>♂</span> :
                    <span style={{ color: '#eb2f96' }}>♀</span>
                  }
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="状态" span={1}>{renderStatusTag(coach.status)}</Descriptions.Item>

              <Descriptions.Item label="联系电话" span={1}>{coach.phone}</Descriptions.Item>
              <Descriptions.Item label="职位" span={1}>{coach.jobTitle}</Descriptions.Item>

              <Descriptions.Item label="入职日期" span={1}>{coach.hireDate}</Descriptions.Item>
              <Descriptions.Item label="教龄" span={1}>{`${coach.experience}年`}</Descriptions.Item>

              <Descriptions.Item label="所属校区" span={1}>{coach.campusName || '-'}</Descriptions.Item>
              <Descriptions.Item label="所属机构" span={1}>{coach.institutionName || '-'}</Descriptions.Item>

              <Descriptions.Item label="基本工资" span={1}>{`¥${coach.baseSalary?.toLocaleString() ?? 'N/A'}`}</Descriptions.Item>
              <Descriptions.Item label="社保费" span={1}>{`¥${coach.socialInsurance?.toLocaleString() ?? 'N/A'}`}</Descriptions.Item>
              
              <Descriptions.Item label="课时费" span={1}>{`¥${coach.classFee?.toLocaleString() ?? 'N/A'} /时`}</Descriptions.Item>
              <Descriptions.Item label="绩效奖金" span={1}>{`¥${coach.performanceBonus?.toLocaleString() ?? 'N/A'}`}</Descriptions.Item>
              
              <Descriptions.Item label="提成" span={1}>{`${coach.commission ?? 'N/A'}%`}</Descriptions.Item>
              <Descriptions.Item label="分红" span={1}>{`¥${coach.dividend?.toLocaleString() ?? 'N/A'}`}</Descriptions.Item>

              <Descriptions.Item label="证书" span={2}>
                {Array.isArray(coach.certifications) && coach.certifications.length > 0
                  ? coach.certifications.map((cert, index) => (
                      <Tag key={index} style={{ marginBottom: 4 }}>{cert.trim()}</Tag>
                    ))
                  : typeof coach.certifications === 'string' && coach.certifications
                    ? coach.certifications.split('，').map((cert, index) => (
                        <Tag key={index} style={{ marginBottom: 4 }}>{cert.trim()}</Tag>
                      ))
                    : '无'
                }
              </Descriptions.Item>
            </Descriptions>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: 20 }}>
            加载中...
          </div>
        )}
      </Spin>
    </Modal>
  );
};

export default CoachDetailModal;