import React, { useEffect, useState } from 'react';
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

              <Descriptions.Item label="所属校区" span={1}>{currentCampusName || coach.campusName || '-'}</Descriptions.Item>
              <Descriptions.Item label="所属机构" span={1}>{coach.institutionName || '-'}</Descriptions.Item>

              <Descriptions.Item label="基本工资" span={1}>{`¥${coach.baseSalary?.toLocaleString() || '0'}`}</Descriptions.Item>
              <Descriptions.Item label="社保费" span={1}>{`¥${coach.socialInsurance?.toLocaleString() || '0'}`}</Descriptions.Item>

              <Descriptions.Item label="课时费" span={1}>
                {(() => {
                  // 直接以字符串形式连接，而不是使用React组件
                  const fee = coach.classFee?.toLocaleString() || '0';
                  // 使用Unicode零宽度空格来强制浏览器不插入空格
                  const noBreakSpace = '\u200B'; // 零宽度空格
                  return `¥${fee}${noBreakSpace}/时`;
                })()}
              </Descriptions.Item>
              <Descriptions.Item label="绩效奖金" span={1}>{`¥${coach.performanceBonus?.toLocaleString() || '0'}`}</Descriptions.Item>

              <Descriptions.Item label="提成" span={1}>{`${coach.commission || '0'}%`}</Descriptions.Item>
              <Descriptions.Item label="分红" span={1}>{`¥${coach.dividend?.toLocaleString() || '0'}`}</Descriptions.Item>

              <Descriptions.Item label="证书" span={2}>
                <div className="certification-content" style={{
                  display: 'block',
                  width: '100%',
                  padding: '0',
                  margin: '-4px 0',
                }}>
                  {(() => {
                    // 将任何类型的数据转换为标准数组
                    if (!coach.certifications) return '无';

                    let certArray: string[] = [];

                    if (typeof coach.certifications === 'string') {
                      certArray = coach.certifications.split(/[,，\n\r]/).map(c => c.trim()).filter(c => c);
                    } else if (Array.isArray(coach.certifications)) {
                      certArray = coach.certifications.filter(c => c.trim());
                    }

                    if (certArray.length === 0) {
                      return '无';
                    }

                    // 使用Tag组件显示每个证书
                    return (
                      <Space size={[6, 4]} wrap style={{ marginTop: '-2px', marginBottom: '-2px' }}>
                        {certArray.map((cert, index) => (
                          <Tag
                            key={index}
                            color="blue"
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
                  })()}
                </div>
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