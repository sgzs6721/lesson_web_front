import React, { useEffect, useState } from 'react';
import { Modal, Descriptions, Avatar, Tag, Space, Button, Spin, Tooltip } from 'antd';
import { Coach } from '../types/coach';
import { getStatusTagInfo, getJobTitleTagInfo } from '../utils/formatters';
import { CoachGender, CoachStatus, CoachEmploymentType } from '../../../api/coach/types';
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

    // 创建Tooltip内容，每个证书一行，美化样式
    const tooltipContent = (
      <div style={{
        textAlign: 'left',
        padding: '0',
        minWidth: '220px',
        maxWidth: '260px',
        borderRadius: '6px',
        overflow: 'hidden',
        boxShadow: '0 3px 8px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e8e8e8',
        backgroundColor: '#fff'
      }}>
        <div style={{
          padding: '8px 12px',
          backgroundColor: '#f5f5f5',
          color: '#333',
          fontSize: '13px',
          fontWeight: 'bold',
          letterSpacing: '0.5px',
          borderBottom: '1px solid #e8e8e8'
        }}>
          证书列表
        </div>
        <div style={{
          padding: '8px 12px',
          backgroundColor: '#fff',
          maxHeight: '180px',
          overflowY: 'auto'
        }}>
          {certArray.length > 0 ? certArray.map((cert, idx) => (
            <div
              key={idx}
              style={{
                padding: '6px 10px',
                margin: '4px 0',
                backgroundColor: '#f6ffed',
                border: '1px solid #b7eb8f',
                borderRadius: '4px',
                fontSize: '12px',
                color: '#52c41a',
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div style={{
                width: '5px',
                height: '5px',
                backgroundColor: '#52c41a',
                borderRadius: '50%',
                marginRight: '8px'
              }}></div>
              {cert}
            </div>
          )) : (
            <div style={{
              padding: '8px',
              textAlign: 'center',
              color: '#999',
              fontStyle: 'italic',
              fontSize: '12px'
            }}>
              暂无证书信息
            </div>
          )}
        </div>
      </div>
    );

    return (
      <Tooltip placement="top" title={tooltipContent} styles={{ body: { padding: 0, backgroundColor: 'transparent', boxShadow: 'none' } }}>
        <Space size={[6, 4]} wrap style={{ margin: '0' }}>
          {certArray.map((cert, index) => (
            <Tag
              key={index}
              color="green"
              style={{
                margin: '2px',
                padding: '1px 5px',
                borderRadius: '3px',
                fontSize: '11px',
                lineHeight: '1.5',
                height: '20px',
                maxWidth: '150px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                alignItems: 'center'
              }}
            >
              {cert}
            </Tag>
          ))}
        </Space>
      </Tooltip>
    );
  };

  // 创建一个空的教练对象，用于在加载时显示结构
  const emptyCoach: Coach = {
    id: '',
    name: '',
    gender: CoachGender.MALE,
          workType: CoachEmploymentType.FULLTIME,
            idNumber: '',
    phone: '',
    status: CoachStatus.ACTIVE,
    jobTitle: '',
          coachingDate: '',
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
        {/* 添加头部区域，显示教练名称和职位标签 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, rgba(26, 41, 128, 0.7) 0%, #26d0ce 100%)',
          padding: '12px 16px',
          borderRadius: '8px 8px 0 0',
          marginBottom: '0',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            right: '-40px',
            top: '-50px',
            background: 'rgba(255, 255, 255, 0.15)'
          }}></div>
          <Avatar
            size={48}
            src={displayCoach.avatar}
            style={{
              backgroundColor: !displayCoach.avatar ? (displayCoach.gender === CoachGender.MALE ? '#1890ff' : '#eb2f96') : undefined,
              marginRight: '12px'
            }}
            icon={!displayCoach.avatar && <UserOutlined />}
          />
          <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '8px' }}>
            <span style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
              {displayCoach.name || '-'}
            </span>
            {displayCoach.gender === CoachGender.MALE ?
              <span style={{ color: '#1890ff', backgroundColor: 'white', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>♂</span> :
              <span style={{ color: '#eb2f96', backgroundColor: 'white', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>♀</span>
            }
            {displayCoach.jobTitle && (
              <Tag color={getJobTitleTagInfo(displayCoach.jobTitle).color} style={{ margin: 0, fontSize: '14px', padding: '2px 8px' }}>
                {displayCoach.jobTitle}
              </Tag>
            )}
            <span style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '14px', backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>{displayCoach.workType === 'FULLTIME' ? '全职' : '兼职'}</span>
            {displayCoach.status && (
              <Tag color={getStatusTagInfo(displayCoach.status).color} style={{ margin: 0, fontSize: '14px', padding: '2px 8px' }}>
                {getStatusTagInfo(displayCoach.status).text}
              </Tag>
            )}
          </div>
        </div>
        <Descriptions bordered column={2} size="small" style={{ marginTop: '0' }}>
          <Descriptions.Item label="教练ID" span={1}>{displayCoach.id || '-'}</Descriptions.Item>
          <Descriptions.Item label="联系电话" span={1}>{displayCoach.phone || '-'}</Descriptions.Item>

          <Descriptions.Item label="身份证号" span={1}>{displayCoach.idNumber || '-'}</Descriptions.Item>
          <Descriptions.Item label="所属校区" span={1}>{currentCampusName || displayCoach.campusName || '-'}</Descriptions.Item>

          <Descriptions.Item label="入职日期" span={1}>{displayCoach.hireDate || '-'}</Descriptions.Item>
          <Descriptions.Item label="执教日期" span={1}>{displayCoach.coachingDate ? new Date(displayCoach.coachingDate).toLocaleDateString() : '-'}</Descriptions.Item>

          <Descriptions.Item label="证书" span={2}>
            <div className="certification-content" style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              padding: '0',
              margin: '0',
              minHeight: '32px'
            }}>
              {renderCertifications(displayCoach.certifications)}
            </div>
          </Descriptions.Item>

          <Descriptions.Item label="基本工资" span={1}>{`¥ ${displayCoach.baseSalary?.toLocaleString() || '0'}`}</Descriptions.Item>
          <Descriptions.Item label="保底课时" span={1}>{displayCoach.guaranteedHours || '0'}小时</Descriptions.Item>

          <Descriptions.Item label="课时费" span={1}>{formatClassFee(displayCoach.classFee)}</Descriptions.Item>
          <Descriptions.Item label="社保费" span={1}>{`¥ ${displayCoach.socialInsurance?.toLocaleString() || '0'}`}</Descriptions.Item>

          <Descriptions.Item label="绩效奖金" span={1}>{`¥ ${displayCoach.performanceBonus?.toLocaleString() || '0'}`}</Descriptions.Item>
          <Descriptions.Item label="提成" span={1}>{`${displayCoach.commission || '0'}%`}</Descriptions.Item>

          <Descriptions.Item label="分红" span={1}>{`¥ ${displayCoach.dividend?.toLocaleString() || '0'}`}</Descriptions.Item>
        </Descriptions>
      </Spin>
    </Modal>
  );
};

export default CoachDetailModal;