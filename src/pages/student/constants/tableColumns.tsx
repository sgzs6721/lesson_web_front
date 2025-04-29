import React from 'react';
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

// 课程类型渲染函数
const renderCourseType = (text: string | undefined) => {
  if (!text) return (
    <FixedWidthTag color="default" width={70} variant="outlined">
      未设置
    </FixedWidthTag>
  );

  const colorMapping: Record<string, string> = {
    '大课': 'amber',
    '一对一': 'blue',
    '小班': 'green',
    '体育类': 'teal',
    '艺术类': 'indigo',
    '学术类': 'cyan',
  };

  const color = colorMapping[text] || 'default';

  return (
    <FixedWidthTag
      color={color}
      width={70}
      variant="filled"
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
  onDelete: (id: string) => void,
  onAttendance: (student: Student & { attendanceCourse?: { id: number | string; name: string } }) => void,
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
    onHeaderCell: () => ({
      style: { ...columnStyle, whiteSpace: 'nowrap' },
    }),
    onCell: () => ({
      style: { textAlign: 'left', paddingLeft: '16px' },
    }),
    render: (text, record) => (
      <span style={{ display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
        {record.gender === 'MALE' ? (
          <span key="gender-icon" style={{ color: '#1890ff', marginRight: 5 }}>♂</span>
        ) : (
          <span key="gender-icon" style={{ color: '#eb2f96', marginRight: 5 }}>♀</span>
        )}
        <span key="name-text" /* style={{ overflow: 'hidden', textOverflow: 'ellipsis' }} */ >
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
            
            // ★ Use colors defined in FixedWidthTag's colorMap
            switch (course.status) {
              case 'PUBLISHED':
              case 'STUDYING':
                statusColor = 'green'; // Use 'green' from colorMap
                statusText = '在学';
                break;
              case 'EXPIRED':
                statusColor = 'red'; // Use 'red' from colorMap
                statusText = '已过期';
                break;
              case 'GRADUATED':
                statusColor = 'blue'; // Use 'blue' from colorMap
                statusText = '已结业';
                break;
              case 'PENDING':
                statusColor = 'orange'; // Use 'orange' or 'amber' from colorMap
                statusText = '待开课';
                break;
               case 'INACTIVE':
                 statusColor = 'gray'; // Use 'gray' or another suitable color from colorMap
                 statusText = '停课';
                 break;
              // Add more cases based on actual backend status values
              default:
                statusColor = 'default';
                statusText = course.status || '未知';
            }

            // 判断当前课程是否可打卡
            const isDisabled = remainingHours <= 0;

            // ★ Define menu items for remaining actions
            const remainingMenuItems = [
              { key: 'refund', label: '退费', icon: <RollbackOutlined style={{ color: '#f5222d' }} />, onClick: () => onRefund(record) },
              { key: 'transfer', label: '转课', icon: <TransactionOutlined />, onClick: () => onTransfer(record) },
              { key: 'transferClass', label: '转班', icon: <SyncOutlined />, onClick: () => onTransferClass(record) },
            ];

            return (
              <div key={`${record.id}-course-${course.courseId || index}`} style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: isDisabled ? '#fdfdfd' : '#fafafa',
                  padding: '6px 10px',
                  borderRadius: '4px',
                  width: '100%',
                  opacity: isDisabled ? 0.7 : 1,
                  border: '1px solid #f0f0f0'
              }}>
                  {/* Course Name - Center Align */}
                  <span style={{
                      fontWeight: 'bold', minWidth: '120px', marginRight: '8px',
                      flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', 
                      textAlign: 'center' 
                  }} title={course.courseName}>
                    {course.courseName || '-'}
                  </span>
                  {/* Course Type - Center Align */}
                  <span style={{ minWidth: '75px', marginRight: '8px', flexShrink: 0, textAlign: 'center' }}>
                    {renderCourseType(course.courseTypeName)} 
                  </span>
                  {/* Coach - Center Align */}
                  <span style={{
                      minWidth: '75px', marginRight: '8px',
                      color: 'rgba(0, 0, 0, 0.65)', flexShrink: 0, 
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', 
                      textAlign: 'center'
                  }}>
                    {course.coachName || '-'}
                  </span>
                  {/* Remaining Hours - Right Align */}
                  <span style={{
                      color: isDisabled ? '#bfbfbf' : (remainingHours <= 5 ? '#f5222d' : 'rgba(0, 0, 0, 0.85)'), 
                      minWidth: '80px', marginRight: '8px',
                      textDecoration: isDisabled ? 'line-through' : 'none', 
                      fontWeight: remainingHours <= 5 ? 'bold' : 'normal', 
                      flexShrink: 0, 
                      textAlign: 'right'
                  }}>
                    {`${remainingHours ?? 0}/${course.totalHours ?? 0}`}课时
                  </span>
                  {/* Expiry Date - Center Align */}
                  <span style={{
                      color: isDisabled ? '#aaa' : '#888', fontSize: '12px', minWidth: '100px', marginRight: '8px',
                      flexShrink: 0, textAlign: 'center'
                  }}>
                    有效期至: {course.endDate ? dayjs(course.endDate).format('YY-MM-DD') : '-'}
                  </span>
                  {/* Status Tag - Center Align */}
                  <span style={{ minWidth: '65px', marginRight: '8px', flexShrink: 0, textAlign: 'center' }}>
                    <FixedWidthTag color={isDisabled ? 'default' : statusColor} width={60} style={{ opacity: isDisabled ? 0.7 : 1 }}> {statusText}</FixedWidthTag>
                  </span>
                  
                  {/* Grouped Buttons - Fixed size */}
                  <Space size="small" style={{ flexShrink: 0, marginRight: '8px' }}>
                    {/* Attendance Button */}
                    <Button type="link" icon={<CheckCircleOutlined style={{ color: isDisabled ? '#bfbfbf' : '#52c41a' }} />} size="small" onClick={() => onAttendance({ ...record, attendanceCourse: { id: course.courseId, name: course.courseName } })} disabled={isDisabled} style={{ padding: '0' }} title={isDisabled ? '剩余课时不足' : '打卡'} />
                    {/* Record Button */}
                    <Button type="link" icon={<FileTextOutlined style={{ color: '#1890ff' }} />} size="small" onClick={() => onClassRecord(record)} style={{ padding: '0' }} title="课程记录" />
                    {/* Payment Button */}
                    <Button type="link" icon={<DollarOutlined style={{ color: '#fa8c16' }} />} size="small" onClick={() => onPayment(record)} style={{ padding: '0' }} title="缴费" />
                  </Space>

                  {/* Actions Dropdown - Push right */}
                  {remainingMenuItems.length > 0 && (
                    <Dropdown menu={{ items: remainingMenuItems }} trigger={['hover']} placement="bottomRight">
                      <Button type="text" size="small" icon={<MoreOutlined />} style={{ marginLeft: 'auto', padding: '0 4px', flexShrink: 0 }} /> 
                    </Dropdown>
                  )}
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
    width: 100,
    align: 'center',
    onHeaderCell: () => ({
      style: { ...columnStyle, whiteSpace: 'nowrap' },
    }),
    render: (_, record) => (
      <Space size="middle">
        <Button 
          type="link" 
          icon={<EditOutlined style={{ color: '#faad14' }} />} 
          onClick={() => onEdit(record)} 
          title="编辑"
          style={{ padding: '0' }}
        />
        <Button 
          type="link" 
          icon={<InfoCircleOutlined style={{ color: '#1890ff' }} />} 
          title="详情"
          style={{ padding: '0' }}
        />
        <Popconfirm
          title="确定删除该学员吗？"
          onConfirm={() => onDelete(record.id)}
          okText="确定"
          cancelText="取消"
        >
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined style={{ color: '#f5222d' }} />}
            title="删除"
            style={{ padding: '0' }}
          />
        </Popconfirm>
      </Space>
    ),
  },
];

// 添加一个映射函数将课程类型转换为颜色
const courseTypeToColor = (type: string) => {
  const colorMapping: Record<string, string> = {
    'sports': 'teal',
    'art': 'indigo',
    'academic': 'cyan',
    '大课': 'amber',
    '一对一': 'blue',
    '小班': 'green'
  };
  
  return colorMapping[type] || 'default';
};