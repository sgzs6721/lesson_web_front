import React from 'react';
import { Modal, Button, Row, Col, Typography, Space, Card, Divider, Tag } from 'antd';
import { CalendarOutlined, TeamOutlined, TagOutlined, CheckCircleOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { Course } from '../types/course';
import { categoryOptions } from '../constants/courseOptions';
import { renderStatusTag } from '../constants/tableColumns';

const { Text } = Typography;

interface CourseDetailModalProps {
  visible: boolean;
  course: Course | null;
  onCancel: () => void;
}

const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  visible,
  course,
  onCancel
}) => {
  // 获取课程类型名称
  const getTypeName = (type: string | undefined) => {
    if (!type) return '';
    try {
      const category = categoryOptions.find(c => c.value.toString() === type || c.label === type);
      return category ? category.label : type;
    } catch (error) {
      console.error('获取课程类型名称出错:', error);
      return type;
    }
  };

  // 获取教练名称
  const getCoachNames = (coaches: { id: number; name: string }[] | undefined) => {
    if (!coaches || coaches.length === 0) return '暂无教练';
    return coaches.map(coach => coach.name).join(', ');
  };

  // 统一获取教练课时费列表（适配多数据来源）
  const getCoachFeeList = () => {
    if (!course) return [] as { id: number; name: string; fee: number }[];
    const list: { id: number; name: string; fee: number }[] = [];
    const coaches = course.coaches || [];
    if (coaches.length > 0) {
      coaches.forEach((c: any) => {
        const fee = (course.coachFees && course.coachFees[c.id] !== undefined)
          ? Number(course.coachFees[c.id])
          : (c.coachFee !== undefined ? Number(c.coachFee) : (c.classFee !== undefined ? Number(c.classFee) : (course.coachFee || 0)));
        list.push({ id: c.id, name: c.name, fee: isNaN(fee) ? 0 : fee });
      });
      return list;
    }
    // 单教练且coaches未填充时，回退用course.coachFee显示一个汇总
    return course.coachFee !== undefined ? [{ id: 0, name: '课时费', fee: Number(course.coachFee) }] : [];
  };

  // 计算平均课时费
  const getAverageCoachFee = (coachFees: Record<number, number> | undefined) => {
    if (!coachFees || Object.keys(coachFees).length === 0) return 0;
    const fees = Object.values(coachFees);
    const total = fees.reduce((sum, fee) => sum + fee, 0);
    return total / fees.length;
  };

  // 计算总课时费（多教师）
  const getTotalCoachFee = (coachFees: Record<number, number> | undefined, coaches?: { id: number; name: string; classFee?: number }[]) => {
    if (coaches && coaches.length > 0) {
      return coaches.reduce((sum, c: any) => sum + (coachFees?.[c.id] ?? c.coachFee ?? c.classFee ?? 0), 0);
    }
    if (!coachFees || Object.keys(coachFees).length === 0) return 0;
    return Object.values(coachFees).reduce((sum, fee) => sum + (fee || 0), 0);
  };


  if (!course) return null;

  // 定义标签样式
  const labelStyle = {
    color: '#8c8c8c',
    fontSize: '13px',
    marginBottom: '4px',
    display: 'block'
  };

  // 定义值样式
  const valueStyle = {
    fontSize: '15px',
    color: '#262626',
    fontWeight: 500,
    lineHeight: '24px'
  };

  // 定义标题样式
  const sectionTitleStyle = {
    borderLeft: '3px solid #1890ff',
    paddingLeft: '8px',
    fontSize: '15px',
    fontWeight: 600,
    marginBottom: '12px',
    color: '#262626'
  };

  // 课时信息项的样式
  const courseInfoItemStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 0',
    textAlign: 'center' as const,
    flex: 1,
    width: '100%'
  };

  // coach tag color palette (pastel)
  const pastelColors = [
    { bg: '#fff7e6', text: '#ad4e00', border: '#ffd591' },
    { bg: '#e6f7ff', text: '#095cb5', border: '#91d5ff' },
    { bg: '#f6ffed', text: '#237804', border: '#b7eb8f' },
    { bg: '#f0f5ff', text: '#2f54eb', border: '#adc6ff' },
    { bg: '#fff0f6', text: '#c41d7f', border: '#ffadd2' }
  ];
  const getCoachTagStyle = (index: number) => {
    const c = pastelColors[index % pastelColors.length];
    return {
      backgroundColor: c.bg,
      color: c.text,
      border: `1px solid ${c.border}`,
      borderRadius: 10,
      padding: '2px 8px',
      fontSize: 12
    } as React.CSSProperties;
  };

  return (
    <Modal
      title={<div style={{ fontSize: '20px', fontWeight: 500, lineHeight: '28px' }}>课程详情</div>}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      centered
      bodyStyle={{ padding: '14px', maxHeight: '75vh', overflowY: 'auto' }}
    >
      {/* 基本信息标题 */}
      <div style={{ ...sectionTitleStyle, marginBottom: '16px' }}>基本信息</div>
      
      {/* 基本信息内容 */}
      <Card 
        style={{ marginBottom: '12px', borderRadius: '8px', border: '1px solid #f0f0f0' }}
        bodyStyle={{ padding: '12px 16px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ fontSize: '22px', fontWeight: 700, lineHeight: '30px' }}>{course.name}</div>
          <div>{renderStatusTag(course.status)}</div>
        </div>
        <Row gutter={[16, 12]}>
          <Col span={8}>
            <div style={{ background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}>课程类型</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#262626' }}>{getTypeName(course.type)}</div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}>上课教练</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#262626' }}>{getCoachNames(course.coaches)}</div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}>是否多教师教学</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#262626' }}>{course.isMultiTeacher ? '是' : '否'}</div>
            </div>
          </Col>
          {/* 创建/更新时间移动到课时费区块之后 */}
          {/* 课时费展示（统一适配单/多教练） */}
          {(getCoachFeeList().length > 0) && (
            <Col span={24}>
              <span style={{ ...labelStyle }}>课时费</span>
              <div style={{ background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: 8, padding: '10px 12px' }}>
                <Space size={[8, 8]} wrap>
                  {getCoachFeeList().map((item, idx) => (
                    <Tag key={item.id} style={getCoachTagStyle(idx)}>
                      <span>{item.name}</span>
                      <span style={{ marginLeft: 8 }}>¥{item.fee}/课时</span>
                    </Tag>
                  ))}
                </Space>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                  <div style={{ background: '#f5f5f5', border: '1px solid #eee', borderRadius: 12, padding: '2px 8px', fontSize: 12 }}>
                    总课时费 <strong style={{ color: '#f5222d' }}>¥{getTotalCoachFee(course.coachFees, course.coaches).toFixed(2)}</strong> /课时
                  </div>
                  <div style={{ background: '#f5f5f5', border: '1px solid #eee', borderRadius: 12, padding: '2px 8px', fontSize: 12 }}>
                    每节课支出 <strong style={{ color: '#fa8c16' }}>¥{(getTotalCoachFee(course.coachFees, course.coaches) * (course.unitHours || 1)).toFixed(2)}</strong>
                  </div>
                </div>
              </div>
            </Col>
          )}
          <Col span={12}>
            <div style={{ background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}>创建时间</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#262626' }}>{dayjs(course.createdTime).format('YYYY-MM-DD HH:mm')}</div>
            </div>
          </Col>
          <Col span={12}>
            <div style={{ background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}>更新时间</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#262626' }}>{dayjs(course.updateTime).format('YYYY-MM-DD HH:mm')}</div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 课时信息标题 */}
      <div style={{ ...sectionTitleStyle, marginBottom: '16px' }}>课时信息</div>
      
      {/* 课时信息内容 */}
      <Card
        style={{ marginBottom: '20px', borderRadius: '8px', border: '1px solid #f0f0f0' }}
        bodyStyle={{ padding: '16px' }}
      >
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          borderRadius: '4px',
          background: '#f7f9fc',
          padding: '10px',
          alignItems: 'center'
        }}>
          <div style={courseInfoItemStyle}>
            <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px', textAlign: 'center' }}>课程价格</div>
            <div style={{ fontSize: '18px', color: '#fa8c16', fontWeight: 600, textAlign: 'center' }}>¥{course.price || 0}</div>
          </div>

          <Divider type="vertical" style={{ height: '36px', margin: '0 16px', background: '#e8e8e8', alignSelf: 'center' }} />

          <div style={courseInfoItemStyle}>
            <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px', textAlign: 'center' }}>每次消耗</div>
            <div style={{ fontSize: '18px', color: '#1890ff', fontWeight: 600, textAlign: 'center' }}>{course.unitHours || 0} 小时</div>
          </div>

          <Divider type="vertical" style={{ height: '36px', margin: '0 16px', background: '#e8e8e8', alignSelf: 'center' }} />

          <div style={courseInfoItemStyle}>
            <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px', textAlign: 'center' }}>总课时</div>
            <div style={{ fontSize: '18px', color: '#52c41a', fontWeight: 600, textAlign: 'center' }}>{course.totalHours || 0} 小时</div>
          </div>

          <Divider type="vertical" style={{ height: '36px', margin: '0 16px', background: '#e8e8e8', alignSelf: 'center' }} />

          <div style={courseInfoItemStyle}>
            <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px', textAlign: 'center' }}>已销课时</div>
            <div style={{ fontSize: '18px', color: '#fa541c', fontWeight: 600, textAlign: 'center' }}>{course.consumedHours || 0} 小时</div>
          </div>
          {/* 课时费总览从指标中移除，放在下方多教师详情区域 */}
        </div>
      </Card>

      {/* 已在基本信息区域展示课时费明细与汇总，这里不再重复 */}

      {/* 课程描述 - 始终显示 */}
      <div style={{ ...sectionTitleStyle, marginBottom: '16px' }}>课程描述</div>
      
      <Card
        style={{ marginBottom: '14px', borderRadius: '8px', border: '1px solid #f0f0f0' }}
        bodyStyle={{ padding: '16px' }}
      >
        <div style={{ 
          minHeight: '40px',
          lineHeight: '22px',
          fontSize: '14px',
          color: course.description ? '#262626' : '#8c8c8c'
        }}>
          {course.description || '暂无描述'}
        </div>
      </Card>
    </Modal>
  );
};

export default CourseDetailModal;