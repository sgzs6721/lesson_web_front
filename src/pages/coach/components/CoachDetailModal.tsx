import React, { useEffect, useState } from 'react';
import { Modal, Descriptions, Avatar, Tag, Space, Button, Spin } from 'antd';
import { Coach } from '../types/coach';
import { getStatusTagInfo, getJobTitleTagInfo } from '../utils/formatters';
import { CoachGender, CoachStatus } from '../../../api/coach/types';
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
  // 使用状态来存储当前校区信息
  const [currentCampusName, setCurrentCampusName] = useState<string>('');

  // 在组件挂载时从 localStorage 获取当前校区信息
  useEffect(() => {
    if (visible) {
      try {
        // 从 localStorage 获取当前校区名称
        const campusName = localStorage.getItem('currentCampusName');
        if (campusName) {
          setCurrentCampusName(campusName);
        }
      } catch (error) {
        console.error('获取当前校区信息失败:', error);
      }
    }
  }, [visible]);

  // 如果没有教练数据且不在加载中，不渲染组件
  if (!coach && !loading) return null;

  // 渲染状态标签
  const renderStatusTag = (status: string) => {
    const { color, text } = getStatusTagInfo(status);
    return <Tag color={color}>{text}</Tag>;
  };

  // 格式化课时费
  const formatClassFee = (fee: number | undefined) => {
    const formattedFee = fee?.toLocaleString() || '0';
    const noBreakSpace = '\u200B'; // 零宽度空格
    return `¥ ${formattedFee}${noBreakSpace}/时`;
  };

  // 渲染证书标签
  const renderCertifications = (certifications: string | string[] | undefined) => {
    if (!certifications) return '无';

    let certArray: string[] = [];

    if (typeof certifications === 'string') {
      certArray = certifications.split(/[,，\n\r]/).map(c => c.trim()).filter(c => c);
    } else if (Array.isArray(certifications)) {
      certArray = certifications.filter(c => c.trim());
    }

    if (certArray.length === 0) {
      return '无';
    }

    return (
      <Space size={[6, 4]} wrap style={{ marginTop: '-2px', marginBottom: '-2px' }}>
        {certArray.map((cert, index) => (
          <Tag
            key={index}
            color="green"
            style={{
              marginBottom: 4,
              padding: '1px 5px',
              borderRadius: '3px',
              fontSize: '11px',
              lineHeight: '1.3',
              height: '18px'
            }}
          >
            {cert}
          </Tag>
        ))}
      </Space>
    );
  };

  // 创建一个空的教练对象，用于在加载时显示结构
  const emptyCoach: Coach = {
    id: '',
    name: '',
    gender: CoachGender.MALE,
    age: 0,
    phone: '',
    status: CoachStatus.ACTIVE,
    jobTitle: '',
    experience: 0,
    hireDate: '',
    campusId: '',
    campusName: '',
    institutionId: '',
    institutionName: '',
    baseSalary: 0,
    socialInsurance: 0,
    classFee: 0,
    performanceBonus: 0,
    commission: 0,
    dividend: 0,
    certifications: '',
    avatar: ''
  };

  // 使用实际的教练数据或空对象
  const displayCoach = coach || emptyCoach;

  // 正常渲染教练详情
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
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="教练ID" span={1}>{displayCoach.id || '-'}</Descriptions.Item>
          <Descriptions.Item label="年龄" span={1}>{displayCoach.age || '-'}</Descriptions.Item>

          <Descriptions.Item label="姓名" span={1}>
            <Space>
              <Avatar
                size="small"
                src={displayCoach.avatar}
                style={{
                  backgroundColor: !displayCoach.avatar ? (displayCoach.gender === CoachGender.MALE ? '#1890ff' : '#eb2f96') : undefined
                }}
                icon={!displayCoach.avatar && <UserOutlined />}
              />
              {displayCoach.name || '-'}
              {displayCoach.gender === CoachGender.MALE ?
                <span style={{ color: '#1890ff' }}>♂</span> :
                <span style={{ color: '#eb2f96' }}>♀</span>
              }
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="状态" span={1}>{displayCoach.status ? renderStatusTag(displayCoach.status) : '-'}</Descriptions.Item>

          <Descriptions.Item label="联系电话" span={1}>{displayCoach.phone || '-'}</Descriptions.Item>
          <Descriptions.Item label="职位" span={1}>
            {displayCoach.jobTitle ? (
              <Tag color={getJobTitleTagInfo(displayCoach.jobTitle).color}>
                {displayCoach.jobTitle}
              </Tag>
            ) : '-'}
          </Descriptions.Item>

          <Descriptions.Item label="入职日期" span={1}>{displayCoach.hireDate || '-'}</Descriptions.Item>
          <Descriptions.Item label="教龄" span={1}>{displayCoach.experience ? `${displayCoach.experience}年` : '-'}</Descriptions.Item>

          <Descriptions.Item label="所属校区" span={1}>{currentCampusName || displayCoach.campusName || '-'}</Descriptions.Item>
          <Descriptions.Item label="所属机构" span={1}>{displayCoach.institutionName || '-'}</Descriptions.Item>

          <Descriptions.Item label="基本工资" span={1}>{`¥ ${displayCoach.baseSalary?.toLocaleString() || '0'}`}</Descriptions.Item>
          <Descriptions.Item label="社保费" span={1}>{`¥ ${displayCoach.socialInsurance?.toLocaleString() || '0'}`}</Descriptions.Item>

          <Descriptions.Item label="课时费" span={1}>{formatClassFee(displayCoach.classFee)}</Descriptions.Item>
          <Descriptions.Item label="绩效奖金" span={1}>{`¥ ${displayCoach.performanceBonus?.toLocaleString() || '0'}`}</Descriptions.Item>

          <Descriptions.Item label="提成" span={1}>{`${displayCoach.commission || '0'}%`}</Descriptions.Item>
          <Descriptions.Item label="分红" span={1}>{`¥ ${displayCoach.dividend?.toLocaleString() || '0'}`}</Descriptions.Item>

          <Descriptions.Item label="证书" span={2}>
            <div className="certification-content" style={{
              display: 'block',
              width: '100%',
              padding: '0',
              margin: '-4px 0',
            }}>
              {renderCertifications(displayCoach.certifications)}
            </div>
          </Descriptions.Item>
        </Descriptions>
      </Spin>
    </Modal>
  );
};

export default CoachDetailModal;