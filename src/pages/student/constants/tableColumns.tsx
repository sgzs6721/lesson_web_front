import React, { useState } from 'react';
import { Tag, Button, Dropdown, Popconfirm, Space, Divider } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  EditOutlined,
  FileTextOutlined,
  DollarOutlined,
  RollbackOutlined,
  TransactionOutlined,
  SyncOutlined,
  DeleteOutlined,
  DownOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  MoreOutlined
} from '@ant-design/icons';
import { Student, CourseInfo } from '@/pages/student/types/student';
import dayjs from 'dayjs';
import { courseTypeOptions } from './options';
import FixedWidthTag from '../components/FixedWidthTag';

// 表头居中样式
const columnStyle: React.CSSProperties = {
  textAlign: 'center',
};

// 课程类型颜色映射
const colorMapping: Record<string, string> = {
  '大课': 'amber',    // 暖色调
  '一对一': 'indigo',  // 深蓝紫色
  '小班': 'cyan',     // 青色
  '体育类': 'teal',    // 水鸭色
  '艺术类': 'purple', // 紫色
  '学术类': 'blue',    // 蓝色
  // 其他可能的课程类型
  '英语': 'green',
  '数学': 'orange',
  '音乐': 'pink',
  '绘画': 'teal',
  '舞蹈': 'pink',
  '体育': 'blue'
};

// 颜色边框映射
const borderColorMapping: Record<string, string> = {
  'amber': '#F59E0B',     // 更饱和的琥珀色
  'indigo': '#6366F1',    // 更柔和的靛蓝色
  'cyan': '#06B6D4',      // 鲜艳的青色
  'teal': '#14B8A6',      // 清新的水鸭绿
  'purple': '#A855F7',    // 优雅的紫色
  'blue': '#3B82F6',      // 亮丽的蓝色
  'green': '#10B981',     // 青翠的绿色
  'orange': '#FB923C',    // 柔和的橙色
  'pink': '#EC4899',      // 时尚的粉色
  'gray': '#6B7280',      // 中性灰色
  '大课': '#F97316',      // 明亮的橙色
  '一对一': '#4F46E5'     // 高贵的深蓝色
};

// 背景色映射
const bgColorMapping: Record<string, string> = {
  'amber': '#FEF3C7',     // 淡雅的琥珀背景
  'indigo': '#E0E7FF',    // 柔和的靛蓝背景
  'cyan': '#CFFAFE',      // 清爽的青色背景
  'teal': '#CCFBF1',      // 恬静的水鸭绿背景
  'purple': '#F3E8FF',    // 淡雅的紫色背景
  'blue': '#DBEAFE',      // 舒适的蓝色背景
  'green': '#D1FAE5',     // 轻柔的绿色背景
  'orange': '#FFEDD5',    // 温暖的橙色背景
  'pink': '#FCE7F3',      // 柔美的粉色背景
  'gray': '#F3F4F6',      // 简约的灰色背景
  '大课': '#FFF7ED',      // 温暖的橙色背景
  '一对一': '#EEF2FF'     // 静谧的蓝色背景
};

// 文字颜色映射
const textColorMapping: Record<string, string> = {
  'amber': '#B45309',     // 深邃的琥珀色
  'indigo': '#4338CA',    // 深沉的靛蓝色
  'cyan': '#0E7490',      // 沉稳的青色
  'teal': '#0F766E',      // 深沉的水鸭绿
  'purple': '#7E22CE',    // 高贵的紫色
  'blue': '#1D4ED8',      // 经典的蓝色
  'green': '#047857',     // 深邃的绿色
  'orange': '#C2410C',    // 热情的橙色
  'pink': '#BE185D',      // 浓郁的粉色
  'gray': '#4B5563',      // 沉稳的灰色
  '大课': '#C2410C',      // 深邃的橙色
  '一对一': '#3730A3'     // 高贵的深蓝色
};

// 课程类型渲染函数 - 调整颜色和样式
const renderCourseType = (text: string | undefined) => {
  if (!text) return (
    <FixedWidthTag color="gray" width={70} variant="outlined"> 
      未设置
    </FixedWidthTag>
  );

  const color = colorMapping[text] || 'gray'; // 未匹配的使用灰色

  return (
    <FixedWidthTag
      color={color}
      width={70}
      variant="filled" // 使用填充样式，但颜色已调整
      style={{ fontWeight: 400 }} // 可以调整字重等
    >
      {text}
    </FixedWidthTag>
  );
};

// 生成学员表格列定义
export const getStudentColumns = (
  onEdit: (record: Student) => void,
  onClassRecord: (student: Student) => void,
  onPayment: (student: Student) => void,
  onRefund: (student: Student) => void,
  onTransfer: (student: Student) => void,
  onTransferClass: (student: Student) => void,
  onDelete: (student: Student) => void,
  onAttendance: (student: Student & { attendanceCourse?: { id: number | string; name: string } }) => void,
  onDetails?: (record: Student) => void, // 添加详情查看回调
): ColumnsType<Student> => [
  {
    title: '学员ID',
    dataIndex: 'id',
    key: 'id',
    width: 100,
    align: 'center',
    onHeaderCell: () => ({
      style: { ...columnStyle, whiteSpace: 'nowrap' },
    }),
    sorter: (a, b) => {
      // 确保 id 是字符串类型，如果不是则转换为字符串
      const idA = typeof a.id === 'string' ? a.id : String(a.id);
      const idB = typeof b.id === 'string' ? b.id : String(b.id);

      // 提取数字部分并转换为整数
      const numA = parseInt(idA.replace(/[^\d]/g, '') || '0', 10);
      const numB = parseInt(idB.replace(/[^\d]/g, '') || '0', 10);

      return numA - numB;
    }
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    align: 'left',
    width: 120, // 设置固定宽度
    onHeaderCell: () => ({
      style: { ...columnStyle, whiteSpace: 'nowrap' },
    }),
    onCell: () => ({
      style: { textAlign: 'left', paddingLeft: '16px', whiteSpace: 'nowrap' }, // 强制不换行
    }),
    render: (text, record) => (
      <span style={{ display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
        {record.gender === 'MALE' ? (
          <span key="gender-icon" style={{ color: '#1890ff', marginRight: 5 }}>♂</span>
        ) : (
          <span key="gender-icon" style={{ color: '#eb2f96', marginRight: 5 }}>♀</span>
        )}
        <span key="name-text" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {text}
        </span>
      </span>
    ),
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
    width: 70,
    align: 'center',
    onHeaderCell: () => ({
      style: { ...columnStyle, whiteSpace: 'nowrap' },
    }),
    sorter: (a, b) => a.age - b.age
  },
  {
    title: '联系电话',
    dataIndex: 'phone',
    key: 'phone',
    align: 'center',
    onHeaderCell: () => ({
      style: { ...columnStyle, whiteSpace: 'nowrap' },
    }),
  },
  {
    title: '课程信息',
    key: 'courseInfo',
    align: 'left',
    width: 800, // Keep width
    onHeaderCell: () => ({
      style: { ...columnStyle, whiteSpace: 'nowrap' },
    }),
    render: (_, record) => {
      if (!record.courses || record.courses.length === 0) {
        return '-';
      }

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {record.courses.map((course: CourseInfo & { courseTypeName?: string }, index: number) => {
            // 获取课时
            const remainingHours = course.remainingHours ?? 0;
            
            // 获取状态
            let statusColor = '';
            let statusText = '';
            
            // 使用 FixedWidthTag 中定义的颜色
            const statusUpperCase = (course.status || '').toUpperCase();
            switch (statusUpperCase) {
              case 'PUBLISHED':
              case 'STUDYING':
              case 'NORMAL':  // 添加对NORMAL状态的处理
                statusColor = 'green';
                statusText = '在学';
                break;
              case 'EXPIRED':
                statusColor = 'error';
                statusText = '已过期';
                break;
              case 'GRADUATED':
                statusColor = 'blue';
                statusText = '已结业';
                break;
              case 'PENDING':
                statusColor = 'orange';
                statusText = '待开课';
                break;
              case 'INACTIVE':
                statusColor = 'gray';
                statusText = '停课';
                break;
              default:
                statusColor = 'default';
                statusText = course.status || '未知';
            }

            // 判断当前课程是否可打卡
            const isDisabled = remainingHours <= 0 || !(statusUpperCase === 'NORMAL' || statusUpperCase === 'STUDYING');
            
            // 获取打卡禁用原因
            const getAttendanceDisabledReason = () => {
              if (remainingHours <= 0) {
                return '剩余课时不足';
              }
              if (!(statusUpperCase === 'NORMAL' || statusUpperCase === 'STUDYING')) {
                return `课程${statusText}，无法打卡`;
              }
              return '打卡';
            };

            // 判断是否为已结业状态
            const isGraduated = statusUpperCase === 'GRADUATED';

            // 定义剩余操作的菜单项（退费、转课、转班）
            const remainingMenuItems = [
              { 
                key: 'refund', 
                label: '退费', 
                icon: <RollbackOutlined style={{ color: isGraduated ? '#d9d9d9' : '#f5222d' }} />, 
                onClick: () => !isGraduated && onRefund(record),
                disabled: isGraduated, // 已结业禁用退费
                style: isGraduated ? { color: '#d9d9d9', cursor: 'not-allowed' } : undefined
              },
              { 
                key: 'transfer', 
                label: '转课', 
                icon: <TransactionOutlined style={{ color: isGraduated ? '#d9d9d9' : '#1890ff' }} />, 
                onClick: () => !isGraduated && onTransfer(record),
                disabled: isGraduated, // 已结业禁用转课
                style: isGraduated ? { color: '#d9d9d9', cursor: 'not-allowed' } : undefined
              },
              { 
                key: 'transferClass', 
                label: '转班', 
                icon: <SyncOutlined style={{ color: isGraduated ? '#d9d9d9' : '#52c41a' }} />, 
                onClick: () => !isGraduated && onTransferClass(record),
                disabled: isGraduated, // 已结业禁用转班
                style: isGraduated ? { color: '#d9d9d9', cursor: 'not-allowed' } : undefined
              },
            ];

            return (
              <div key={`${record.id}-course-${course.courseId || index}`} style={{
                  display: 'grid',
                  gridTemplateColumns: '30px 100px 80px 80px 90px 120px 80px auto', // 重新调整列宽
                  alignItems: 'center',
                  backgroundColor: isDisabled ? '#fdfdfd' : '#fafafa',
                  padding: '6px 0',
                  borderRadius: '4px',
                  width: '100%',
                  opacity: statusUpperCase === 'EXPIRED' ? 1 : (isDisabled ? 0.7 : 1),
                  border: statusUpperCase === 'EXPIRED' ? '1px solid #ffccc7' : '1px solid #f0f0f0',
                  position: 'relative',
                  columnGap: '10px', // 减少列间距
              }}>
                  {/* 单独的短竖线元素 */}
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '4px',
                    height: '60%',
                    backgroundColor: 
                      statusUpperCase === 'EXPIRED' ? '#ff4d4f' :
                      course.courseTypeName === '大课' ? borderColorMapping['大课'] :
                      course.courseTypeName === '一对一' ? borderColorMapping['一对一'] :
                      (colorMapping[course.courseTypeName || ''] ? 
                        borderColorMapping[colorMapping[course.courseTypeName || '']] || '#faad14' : 
                        '#faad14'),
                    borderRadius: '0 2px 2px 0',
                  }}></div>

                  {/* 左侧空间，仅作为间隔 */}
                  <div></div>
                  
                  {/* 课程名称 - 居中显示 */}
                  <div style={{
                    margin: 0,
                    padding: '0',
                    color: 'rgba(0, 0, 0, 0.85)',
                    fontWeight: 500,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    textAlign: 'center',
                    lineHeight: '22px'
                  }} title={course.courseName}>
                    {course.courseName || '-'}
                  </div>
                  
                  {/* 课程类型 - 居中显示 */}
                  <div style={{ 
                    textAlign: 'center',
                    justifySelf: 'center'
                  }}>
                    <Tag
                      style={{
                        minWidth: '65px',
                        textAlign: 'center',
                        padding: '1px 8px',
                        margin: 0,
                        borderRadius: '2px',
                        fontWeight: 400,
                        fontSize: '12px',
                        border: '1px solid',
                        borderColor: colorMapping[course.courseTypeName || ''] ? 
                          `${borderColorMapping[colorMapping[course.courseTypeName || '']]}33` : '#ffd591',
                        backgroundColor: bgColorMapping[colorMapping[course.courseTypeName || ''] || 'amber'] || '#fffbeb',
                        color: textColorMapping[colorMapping[course.courseTypeName || ''] || 'amber'] || '#92400e'
                      }}
                    >
                      {course.courseTypeName || '未知'}
                    </Tag>
                  </div>
                  
                  {/* 教练 - 居中显示 */}
                  <div style={{
                      color: 'rgba(0, 0, 0, 0.65)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      textAlign: 'center'
                  }}>
                    {course.coachName || '-'}
                  </div>
                  
                  {/* 课时 - 居中显示 */}
                  <div style={{
                      color: isDisabled ? '#bfbfbf' : (remainingHours <= 5 ? '#f5222d' : 'rgba(0, 0, 0, 0.85)'),
                      textDecoration: isDisabled ? 'line-through' : 'none',
                      fontWeight: remainingHours <= 5 ? 'bold' : 'normal',
                      textAlign: 'right',
                      paddingRight: '10px'
                  }}>
                    {`${remainingHours ?? 0}/${course.totalHours ?? 0}`}课时
                  </div>
                  
                  {/* 有效期 - 居中显示 */}
                  <div style={{
                      color: statusUpperCase === 'EXPIRED' ? '#ff4d4f' : (isDisabled ? '#aaa' : '#888'),
                      fontSize: '12px',
                      textAlign: 'center',
                      fontWeight: statusUpperCase === 'EXPIRED' ? 'bold' : 'normal'
                  }}>
                    有效期至: {course.endDate ? dayjs(course.endDate).format('YY-MM-DD') : '-'}
                  </div>
                  
                  {/* 状态 - 居中显示 */}
                  <div style={{ 
                    textAlign: 'center',
                    justifySelf: 'center'
                  }}>
                    {statusUpperCase === 'EXPIRED' ? (
                      <Tag
                        style={{
                          width: '60px',
                          textAlign: 'center',
                          display: 'inline-block',
                          margin: 0,
                          padding: '4px 0',
                          fontSize: '12px',
                          fontWeight: '500',
                          borderRadius: '6px',
                          backgroundColor: '#fff',
                          color: '#ff4d4f',
                          border: '1px solid #ff4d4f'
                        }}
                      >
                        {statusText}
                      </Tag>
                    ) : statusUpperCase === 'NORMAL' || statusUpperCase === 'STUDYING' ? (
                      <Tag
                        style={{
                          width: '60px',
                          textAlign: 'center',
                          display: 'inline-block',
                          margin: 0,
                          padding: '4px 0',
                          fontSize: '12px',
                          fontWeight: '500',
                          borderRadius: '6px',
                          backgroundColor: '#fff',
                          color: '#52c41a',
                          border: '1px solid #52c41a'
                        }}
                      >
                        {statusText}
                      </Tag>
                    ) : statusUpperCase === 'GRADUATED' ? (
                      <Tag
                        style={{
                          width: '60px',
                          textAlign: 'center',
                          display: 'inline-block',
                          margin: 0,
                          padding: '4px 0',
                          fontSize: '12px',
                          fontWeight: '500',
                          borderRadius: '6px',
                          backgroundColor: '#fff',
                          color: '#f56c6c',
                          border: '1px solid #f56c6c'
                        }}
                      >
                        {statusText}
                      </Tag>
                    ) : (
                      <FixedWidthTag 
                        color={isDisabled ? 'default' : statusColor} 
                        width={60} 
                        style={{ 
                          opacity: isDisabled ? 0.7 : 1,
                        }}
                      >
                        {statusText}
                      </FixedWidthTag>
                    )}
                  </div>
                  
                  {/* 操作按钮组 - 居中显示 */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    {/* 打卡按钮 */}
                    <Button 
                      type="link" 
                      icon={<CheckCircleOutlined style={{ color: isDisabled ? '#bfbfbf' : '#52c41a' }} />} 
                      size="small" 
                      onClick={() => onAttendance({ ...record, attendanceCourse: { id: course.courseId, name: course.courseName } })} 
                      disabled={isDisabled} 
                      style={{ padding: '0' }} 
                      title={getAttendanceDisabledReason()} 
                    />
                    
                    {/* 课程记录按钮 */}
                    <Button 
                      type="link" 
                      icon={<FileTextOutlined style={{ color: '#1890ff' }} />} 
                      size="small" 
                      onClick={() => onClassRecord(record)} 
                      style={{ padding: '0' }} 
                      title="课程记录" 
                    />
                    
                    {/* 缴费按钮 */}
                    <Button 
                      type="link" 
                      icon={<DollarOutlined style={{ color: '#fa8c16' }} />} 
                      size="small" 
                      onClick={() => onPayment(record)} 
                      style={{ padding: '0' }} 
                      title="缴费" 
                    />
                    
                    {/* 更多操作 */}
                    {remainingMenuItems.length > 0 && (
                      <Dropdown 
                        menu={{ items: remainingMenuItems }} 
                        trigger={['hover']} 
                        placement="bottomRight"
                      >
                        <Button 
                          type="text" 
                          size="small" 
                          icon={<MoreOutlined />} 
                          style={{ padding: '0' }} 
                        />
                      </Dropdown>
                    )}
                  </div>
              </div>
            );
          })}
        </div>
      );
    }
  },
  {
    title: '操作',
    key: 'action',
    width: 110,
    align: 'center',
    onHeaderCell: () => ({
      style: { ...columnStyle, whiteSpace: 'nowrap' },
    }),
    render: (_, record) => (
      <Space size={8}>
        {/* 详情按钮 - 蓝色 */}
        <Button 
          type="link" 
          icon={<InfoCircleOutlined style={{ color: '#1890ff' }} />} 
          onClick={() => onDetails?.(record)} 
          title="详情"
          style={{ padding: '0' }}
        />
        
        {/* 编辑按钮 - 黄色 */}
        <Button 
          type="link" 
          icon={<EditOutlined style={{ color: '#faad14' }} />} 
          onClick={() => onEdit(record)} 
          title="编辑"
          style={{ padding: '0' }}
        />
        
        {/* 删除按钮 - 红色 */}
        <Button 
          type="link" 
          danger 
          icon={<DeleteOutlined style={{ color: '#f5222d' }} />}
          onClick={() => onDelete(record)}
          title="删除"
          style={{ padding: '0' }}
        />
      </Space>
    ),
  },
];