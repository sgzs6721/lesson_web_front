import React from 'react';
import { List, Card, Avatar, Tooltip, Tag, Button, Dropdown, Spin } from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined, DownOutlined, LoadingOutlined } from '@ant-design/icons';
import { Coach } from '../types/coach';
import { getStatusTagInfo, getJobTitleTagInfo } from '../utils/formatters';
import { CoachGender } from '../../../api/coach/types';
import dayjs from 'dayjs';
import './CoachCardView.css';
import { avatarMap } from '../constants/avatarMap';

interface CoachCardViewProps {
  data: Coach[];
  loading: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  onEdit: (record: Coach) => void;
  onDelete: (id: string) => void;
  onViewDetail: (record: Coach) => void;
  onStatusChange?: (id: string, newStatus: string) => void;
  rowLoading?: Record<string, boolean>; // 每一行的加载状态，用于状态变更时显示加载效果
}

const CoachCardView: React.FC<CoachCardViewProps> = ({
  data,
  loading,
  pagination,
  onEdit,
  onDelete,
  onViewDetail,
  onStatusChange,
  rowLoading = {}
}) => {
  // 从身份证号计算年龄
  const calculateAgeFromIdNumber = (idNumber: string): number => {
    if (!idNumber || idNumber.length < 6) return 0;
    
    try {
      // 提取出生年份
      const year = parseInt(idNumber.substring(6, 10));
      const currentYear = new Date().getFullYear();
      return currentYear - year;
    } catch (error) {
      console.error('计算年龄失败:', error);
      return 0;
    }
  };

  // 从执教日期计算教龄
  const calculateTeachingExperience = (coachingDate: string): number => {
    if (!coachingDate) return 0;
    
    try {
      const startDate = new Date(coachingDate);
      const currentDate = new Date();
      const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
      const diffYears = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365));
      return diffYears;
    } catch (error) {
      console.error('计算教龄失败:', error);
      return 0;
    }
  };

  // 渲染状态标签
  const renderStatusTag = (status: string, coach: Coach) => {
    const { color, text } = getStatusTagInfo(status);

    // 如果没有提供状态变更回调，则只显示文本
    if (!onStatusChange) {
      return (
        <Tag
          color={color}
          style={{
            borderRadius: '4px',
            fontSize: '12px',
            padding: '0 8px',
            fontWeight: 600,
            marginRight: 0,
            border: 'none',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            height: '22px',
            lineHeight: '22px',
            display: 'inline-block'
          }}
        >
          {text}
        </Tag>
      );
    }

    // 状态选项
    const statusOptions = [
      { key: 'ACTIVE', label: '在职', color: '#52c41a' },
      { key: 'VACATION', label: '休假中', color: '#faad14' },
      { key: 'RESIGNED', label: '已离职', color: '#ff4d4f' }
    ];

    // 创建下拉菜单项
    const items = statusOptions.map(option => ({
      key: option.key,
      label: (
        <span style={{ color: option.color }}>{option.label}</span>
      ),
      disabled: option.key === status // 当前状态禁用
    }));

    // 处理状态变更
    const handleStatusChange = (info: any) => {
      const { key, domEvent } = info;
      // 阻止事件冒泡
      if (domEvent) {
        domEvent.stopPropagation();
        domEvent.preventDefault();
      }

      if (key !== status) {
        onStatusChange(coach.id, key);
      }
    };

    // 判断当前教练是否处于状态变更中
    const isStatusChanging = rowLoading[coach.id];

    // 自定义加载图标
    const antIcon = <LoadingOutlined style={{ fontSize: 16, color: '#1890ff' }} spin />;

    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {isStatusChanging ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 1000 // 增加状态标签的z-index
            }}
            onClick={(e) => {
              e.stopPropagation(); // 阻止点击事件传播到卡片
              e.preventDefault(); // 阻止默认行为
            }}
          >
            <Spin indicator={antIcon} size="small" />
          </div>
        ) : (
          <Dropdown
            menu={{ items, onClick: handleStatusChange }}
            trigger={['click']}
            placement="bottom"
            disabled={isStatusChanging}
            overlayStyle={{ zIndex: 1050 }} // 增加下拉菜单的z-index
          >
            <div
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 1000 // 增加状态标签的z-index
              }}
              onClick={(e) => {
                e.stopPropagation(); // 阻止点击事件传播到卡片
                e.preventDefault(); // 阻止默认行为
              }}
            >
              <Tag
                color={color}
                style={{
                  borderRadius: '4px',
                  fontSize: '12px',
                  padding: '0 8px',
                  fontWeight: 600,
                  marginRight: 0,
                  border: 'none',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  height: '22px',
                  lineHeight: '22px',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                {text}
                <DownOutlined style={{ fontSize: '10px', color: '#999', marginLeft: '4px' }} />
              </Tag>
            </div>
          </Dropdown>
        )}
      </div>
    );
  };

  // 渲染职位标签
  const renderJobTitleTag = (jobTitle: string) => {
    const { color, text } = getJobTitleTagInfo(jobTitle);
    return (
      <Tag
        color={color}
        style={{
          borderRadius: '4px',
          fontSize: '12px',
          padding: '0 8px',
          fontWeight: 500,
          border: 'none',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          height: '22px',
          lineHeight: '22px',
          display: 'inline-block'
        }}
      >
        {text}
      </Tag>
    );
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return dayjs(dateString).format('YYYY-MM-DD');
  };

  return (
    <List
      grid={{
        gutter: 24,
        xs: 1,
        sm: 2,
        md: 2,
        lg: 3,
        xl: 3,
        xxl: 3
      }}
      dataSource={data}
      loading={loading}
      pagination={false}
      renderItem={(coach) => (
        <List.Item>
          <Card
            hoverable
            className="coach-card-premium"
            onClick={() => onViewDetail(coach)}
          >
            <div className="card-background-decoration">
              <div className="card-decoration-circle"></div>
            </div>

            <div className="coach-card-content-premium">
              <div className="coach-header-section" style={{
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                height: '56px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                zIndex: 2
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <div className="coach-avatar-container-premium">
                    <Avatar
                      size={60}
                      src={coach.avatar ? (avatarMap[coach.avatar] || coach.avatar) : undefined}
                      className="premium-avatar"
                      style={{
                        backgroundColor: !coach.avatar ? (coach.gender === CoachGender.MALE ? '#1890ff' : '#eb2f96') : undefined,
                      }}
                      icon={!coach.avatar && <UserOutlined />}
                    />
                    <div className="coach-gender-badge">
                      <span className="gender-icon-badge">
                        {coach.gender === CoachGender.MALE ?
                          <span className="gender-icon male">♂</span> :
                          <span className="gender-icon female">♀</span>
                        }
                      </span>
                    </div>
                    {/* 职位标签放在头像下方 */}
                    <div style={{
                      position: 'absolute',
                      bottom: '-25px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      zIndex: 3
                    }}>
                      {renderJobTitleTag(coach.jobTitle)}
                    </div>
                  </div>

                  <div className="coach-title-section" style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: '56px',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '-20px',
                    marginLeft: '10px'
                  }}>
                    <div className="coach-name-premium">
                      {coach.name}
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      {/* 工作类型标签 */}
                      <Tag
                        color={coach.workType === 'FULLTIME' ? 'purple' : 'blue'}
                        style={{
                          borderRadius: '4px',
                          fontSize: '12px',
                          padding: '0 8px',
                          fontWeight: 600,
                          marginRight: 0,
                          border: 'none',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          height: '22px',
                          lineHeight: '22px',
                          display: 'inline-block'
                        }}
                      >
                        {coach.workType === 'FULLTIME' ? '全职' : '兼职'}
                      </Tag>
                      {/* 状态标签 */}
                      {renderStatusTag(coach.status, coach)}
                    </div>
                    {/* 编辑删除按钮组 */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      marginLeft: 'auto',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '6px',
                      padding: '0 8px',
                      height: '22px',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}>
                      <Tooltip title="编辑">
                        <Button
                          type="text"
                          shape="circle"
                          size="small"
                          icon={<EditOutlined style={{ fontSize: '14px' }} />}
                          className="action-button edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(coach);
                          }}
                        />
                      </Tooltip>
                      <Tooltip title="删除">
                        <Button
                          type="text"
                          shape="circle"
                          size="small"
                          icon={<DeleteOutlined style={{ fontSize: '14px' }} />}
                          className="action-button delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(coach.id);
                          }}
                        />
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '32px', width: '100%', marginTop: '-16px' }}>
                {/* 左栏：基本信息 */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="coach-info-item" style={{whiteSpace: 'nowrap', display: 'flex'}}>
                    <span className="info-label" style={{minWidth: 56, flexShrink: 0}}>ID：</span>
                    <span className="info-value" style={{textAlign: 'right', flex: 1}}>{coach.id}</span>
                  </div>
                  <div className="coach-info-item" style={{whiteSpace: 'nowrap', display: 'flex'}}>
                    <span className="info-label" style={{minWidth: 56, flexShrink: 0}}>电话：</span>
                    <span className="info-value" style={{textAlign: 'right', flex: 1}}>{coach.phone}</span>
                  </div>
                  <div className="coach-info-item" style={{whiteSpace: 'nowrap', display: 'flex'}}>
                    <span className="info-label" style={{minWidth: 56, flexShrink: 0}}>身份证：</span>
                    <span className="info-value" style={{textAlign: 'right', flex: 1}}>{coach.idNumber || '-'}</span>
                  </div>
                  <div className="coach-info-item" style={{whiteSpace: 'nowrap', display: 'flex'}}>
                    <span className="info-label" style={{minWidth: 56, flexShrink: 0}}>入职日期：</span>
                    <span className="info-value" style={{textAlign: 'right', flex: 1}}>{formatDate(coach.hireDate)}</span>
                  </div>
                  <div className="coach-info-item" style={{whiteSpace: 'nowrap', display: 'flex'}}>
                    <span className="info-label" style={{minWidth: 56, flexShrink: 0}}>执教日期：</span>
                    <span className="info-value" style={{textAlign: 'right', flex: 1}}>{coach.coachingDate ? formatDate(coach.coachingDate) : '-'}</span>
                  </div>
                  <div className="coach-info-item" style={{display: 'flex', alignItems: 'center'}}>
                    <span className="info-label" style={{minWidth: 56, flexShrink: 0}}>证书：</span>
                    <span className="info-value" style={{textAlign: 'right', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                      {(() => {
                        // 将任何类型的数据转换为标准数组
                        if (!coach.certifications) return <span className="no-cert">暂无证书</span>;

                        let certArray: string[] = [];

                        if (typeof coach.certifications === 'string') {
                          certArray = coach.certifications.split(/[,，\n\r]/).map(c => c.trim()).filter(c => c);
                        } else if (Array.isArray(coach.certifications)) {
                          certArray = coach.certifications.filter(c => c.trim());
                        }

                        if (certArray.length === 0) {
                          return <span className="no-cert">暂无证书</span>;
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

                        // 限制最多显示2个证书，超出部分显示+N
                        const maxShow = 2;
                        const hasMore = certArray.length > maxShow;
                        const visibleCerts = certArray.slice(0, maxShow);

                        // 使用Tag组件显示每个证书，限制在一行内
                        return (
                          <Tooltip placement="top" title={tooltipContent} styles={{ body: { padding: 0, backgroundColor: 'transparent', boxShadow: 'none' } }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', overflow: 'hidden', justifyContent: 'flex-end' }}>
                              {visibleCerts.map((cert, index) => (
                                <Tag
                                  key={index}
                                  color="green"
                                  style={{
                                    padding: '1px 5px',
                                    borderRadius: '3px',
                                    fontSize: '11px',
                                    lineHeight: '1.3',
                                    height: '18px',
                                    margin: '0 2px',
                                    whiteSpace: 'nowrap',
                                    maxWidth: '80px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    flexShrink: 0
                                  }}
                                >
                                  {cert}
                                </Tag>
                              ))}
                              {hasMore && (
                                <Tag
                                  color="default"
                                  style={{
                                    padding: '1px 5px',
                                    borderRadius: '3px',
                                    fontSize: '11px',
                                    lineHeight: '1.3',
                                    height: '18px',
                                    margin: '0 2px',
                                    whiteSpace: 'nowrap',
                                    flexShrink: 0
                                  }}
                                >
                                  +{certArray.length - maxShow}
                                </Tag>
                              )}
                            </div>
                          </Tooltip>
                        );
                      })()}
                    </span>
                  </div>
                </div>
                {/* 右栏：薪资信息 */}
                <div style={{ flex: 1, minWidth: 0, paddingLeft: 16, borderLeft: '1px solid #f0f0f0', marginTop: '-24px' }}>
                  <div className="coach-info-item" style={{whiteSpace: 'nowrap', display: 'flex'}}>
                    <span className="info-label" style={{minWidth: 64, flexShrink: 0}}>基本工资：</span>
                    <span className="info-value" style={{textAlign: 'right', flex: 1}}>
                      {typeof coach.baseSalary === 'number'
                        ? `¥ ${coach.baseSalary.toLocaleString()}`
                        : '¥ 0'}
                    </span>
                  </div>
                  <div className="coach-info-item" style={{whiteSpace: 'nowrap', display: 'flex'}}>
                    <span className="info-label" style={{minWidth: 64, flexShrink: 0}}>保底课时：</span>
                    <span className="info-value" style={{textAlign: 'right', flex: 1}}>
                      {coach.guaranteedHours || '0'}小时
                    </span>
                  </div>
                  <div className="coach-info-item" style={{whiteSpace: 'nowrap', display: 'flex'}}>
                    <span className="info-label" style={{minWidth: 64, flexShrink: 0}}>课时费：</span>
                    <span className="info-value" style={{textAlign: 'right', flex: 1}}>
                      {(() => {
                        const noBreakSpace = '\u200B'; // 零宽度空格
                        if (typeof coach.classFee === 'number') {
                          const fee = coach.classFee.toLocaleString();
                          return `¥ ${fee}${noBreakSpace}/时`;
                        }
                        return `¥ 0${noBreakSpace}/时`;
                      })()}
                    </span>
                  </div>
                  <div className="coach-info-item" style={{whiteSpace: 'nowrap', display: 'flex'}}>
                    <span className="info-label" style={{minWidth: 64, flexShrink: 0}}>社保费：</span>
                    <span className="info-value" style={{textAlign: 'right', flex: 1}}>
                      {typeof coach.socialInsurance === 'number'
                        ? `¥ ${coach.socialInsurance.toLocaleString()}`
                        : '¥ 0'}
                    </span>
                  </div>
                  <div className="coach-info-item" style={{whiteSpace: 'nowrap', display: 'flex'}}>
                    <span className="info-label" style={{minWidth: 64, flexShrink: 0}}>绩效奖：</span>
                    <span className="info-value" style={{textAlign: 'right', flex: 1}}>
                      {typeof coach.performanceBonus === 'number'
                        ? `¥ ${coach.performanceBonus.toLocaleString()}`
                        : '¥ 0'}
                    </span>
                  </div>
                  <div className="coach-info-item" style={{whiteSpace: 'nowrap', display: 'flex'}}>
                    <span className="info-label" style={{minWidth: 64, flexShrink: 0}}>提成：</span>
                    <span className="info-value" style={{textAlign: 'right', flex: 1}}>
                      {typeof coach.commission === 'number'
                        ? `${coach.commission}%`
                        : '0%'}
                    </span>
                  </div>
                  <div className="coach-info-item" style={{whiteSpace: 'nowrap', display: 'flex'}}>
                    <span className="info-label" style={{minWidth: 64, flexShrink: 0}}>分红：</span>
                    <span className="info-value" style={{textAlign: 'right', flex: 1}}>
                      {typeof coach.dividend === 'number'
                        ? `¥ ${coach.dividend.toLocaleString()}`
                        : '¥ 0'}
                    </span>
                  </div>
                </div>
              </div>


            </div>
          </Card>
        </List.Item>
      )}
    />
  );
};

export default CoachCardView;