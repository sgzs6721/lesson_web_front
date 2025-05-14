import React from 'react';
import { Tag, Button, Dropdown, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  EditOutlined,
  FileTextOutlined,
  DollarOutlined,
  RollbackOutlined,
  TransactionOutlined,
  SyncOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  MoreOutlined
} from '@ant-design/icons';
import { Student, CourseInfo } from '@/pages/student/types/student';
import dayjs from 'dayjs';
import FixedWidthTag from '../components/FixedWidthTag';

// 表头居中样式
const columnStyle: React.CSSProperties = {
  textAlign: 'center',
};

// 课程类型颜色映射
const courseTypeColors: Record<string, string> = {
  '一对一': '#4F46E5', // 深蓝色
  '一对二': '#6366F1', // 靛蓝色
  '大课': '#F97316',  // 橙色
  '小班': '#06B6D4',  // 青色
  '体育类': '#14B8A6', // 水鸭绿
  '艺术类': '#A855F7', // 紫色
  '学术类': '#3B82F6', // 蓝色
};

// 课程类型显示配色
const colorMap: Record<string, { border: string; bg: string; text: string }> = {
  '一对一': { border: '#4F46E5', bg: '#E0E7FF', text: '#4338CA' },
  '一对二': { border: '#6366F1', bg: '#E0E7FF', text: '#4338CA' },
  '大课': { border: '#F97316', bg: '#FFF7ED', text: '#C2410C' },
  '小班': { border: '#06B6D4', bg: '#CFFAFE', text: '#0E7490' },
  '体育类': { border: '#14B8A6', bg: '#CCFBF1', text: '#0F766E' },
  '艺术类': { border: '#A855F7', bg: '#F3E8FF', text: '#7E22CE' },
  '学术类': { border: '#3B82F6', bg: '#DBEAFE', text: '#1D4ED8' },
};

// 定义课程类型标签的样式函数
const getCourseTypeTagStyle = (courseTypeName?: string): React.CSSProperties => {
  const defaultStyle = {
    border: '#ffd591',
    bg: '#fffbeb',
    text: '#92400e'
  };

  const style = courseTypeName ? (colorMap[courseTypeName] || defaultStyle) : defaultStyle;

  // 根据课程类型设置不同的样式
  let customStyle: React.CSSProperties = {};

  if (courseTypeName === '一对一') {
    // 一对一使用淡蓝色
    customStyle = {
      backgroundColor: '#E6F7FF',
      color: '#1890FF',
      border: '1px solid #91D5FF'
    };
  } else if (courseTypeName === '一对二') {
    // 一对二使用淡绿色
    customStyle = {
      backgroundColor: '#F6FFED',
      color: '#52C41A',
      border: '1px solid #B7EB8F'
    };
  } else if (courseTypeName === '大课') {
    // 大课使用淡橙色
    customStyle = {
      backgroundColor: '#FFF7E6',
      color: '#FA8C16',
      border: '1px solid #FFD591'
    };
  } else if (courseTypeName === '小班') {
    // 小班使用淡紫色
    customStyle = {
      backgroundColor: '#F9F0FF',
      color: '#722ED1',
      border: '1px solid #D3ADF7'
    };
  } else {
    // 其他课程类型使用浅色背景
    customStyle = {
      backgroundColor: style.bg,
      color: style.text,
      border: `1px solid ${style.border}33`
    };
  }

  return {
    minWidth: '65px',
    textAlign: 'center' as const,
    padding: '2px 8px',
    margin: 0,
    borderRadius: '4px',
    fontWeight: 500,
    fontSize: '12px',
    ...customStyle
  };
};

// 定义课程卡片中的类型指示器样式
const renderCourseTypeIndicator = (courseTypeName?: string, status?: string): React.CSSProperties => {
  const statusUpperCase = (status || '').toUpperCase();

  // 根据状态和课程类型决定颜色
  let color;
  if (statusUpperCase === 'EXPIRED') {
    color = '#ff4d4f'; // 过期课程显示红色
  } else if (courseTypeName && courseTypeColors[courseTypeName]) {
    color = courseTypeColors[courseTypeName];
  } else {
    color = '#1677FF'; // 默认蓝色
  }

  return {
    position: 'absolute' as const,
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    height: '20px', // 减小高度为20px
    width: '4px',
    backgroundColor: color,
    borderRadius: '0 2px 2px 0'
  };
};

// 注意: 此函数已不再使用，但保留作为参考
// 课程类型渲染函数 - 调整颜色和样式
/*
const renderCourseType = (text: string | undefined) => {
  if (!text) return (
    <FixedWidthTag color="gray" width={70} variant="outlined">
      未设置
    </FixedWidthTag>
  );

  return (
    <Tag style={getCourseTypeTagStyle(text)}>
      {text}
    </Tag>
  );
};
*/

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
    width: 800, // Keep width for large screens
    onHeaderCell: () => ({
      style: { ...columnStyle, whiteSpace: 'nowrap' },
    }),
    render: (_, record) => {
      if (!record.courses || record.courses.length === 0) {
        return '-';
      }

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span className="scroll-indicator">← 左右滑动查看更多 →</span>
          {record.courses.map((course: CourseInfo & { courseTypeName?: string }, index: number) => {
            // 获取课时
            const remainingHours = course.remainingHours ?? 0;

            // 获取状态
            let statusColor = '';
            let statusText = '';

            // 使用 FixedWidthTag 中定义的颜色
            const statusUpperCase = (course.status || '').toUpperCase();
            switch (statusUpperCase) {
              case 'STUDYING':
                statusColor = 'green';
                statusText = '学习中';
                break;
              case 'NORMAL':  // 兼容旧状态
                statusColor = 'green';
                statusText = '学习中';
                break;
              case 'EXPIRED':
                statusColor = 'error';
                statusText = '过期';
                break;
              case 'GRADUATED':
                statusColor = 'blue';
                statusText = '结业';
                break;
              case 'WAITING_PAYMENT':
                statusColor = 'orange';
                statusText = '待缴费';
                break;
              case 'WAITING_CLASS':
                statusColor = 'purple';
                statusText = '待上课';
                break;
              case 'WAITING_RENEWAL':
                statusColor = 'cyan';
                statusText = '待续费';
                break;
              case 'REFUNDED':
                statusColor = 'red';
                statusText = '已退费';
                break;
              // 兼容其他旧状态
              case 'PUBLISHED':
                statusColor = 'green';
                statusText = '学习中';
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
                icon: <RollbackOutlined style={{ color: isGraduated || remainingHours === 0 ? '#d9d9d9' : '#f5222d' }} />,
                onClick: () => !isGraduated && remainingHours > 0 && onRefund(record),
                disabled: isGraduated || remainingHours === 0, // 已结业或剩余课时为0时禁用退费
                style: isGraduated || remainingHours === 0 ? { color: '#d9d9d9', cursor: 'not-allowed' } : undefined
              },
              {
                key: 'transfer',
                label: '转课',
                icon: <TransactionOutlined style={{ color: isGraduated || remainingHours === 0 ? '#d9d9d9' : '#1890ff' }} />,
                onClick: () => {
                  if (!isGraduated && remainingHours > 0) {
                    // 调试信息，打印当前课程
                    console.log(`点击转课按钮 - 课程ID: ${course.courseId}, 类型: ${typeof course.courseId}, 名称: ${course.courseName}`);

                    // 从课程完整信息中找到对应信息，避免ID类型不匹配问题
                    const courseInfoForTransfer = {
                      ...record,
                      selectedCourseId: course.courseId ? String(course.courseId) : undefined,
                      selectedCourseName: course.courseName // 添加课程名称
                    };

                    // 打印完整的传递信息
                    console.log('转课 - 传递的完整信息:', courseInfoForTransfer);

                    // 调用转课方法
                    onTransfer(courseInfoForTransfer as any);
                  }
                },
                disabled: isGraduated || remainingHours === 0, // 已结业或剩余课时为0时禁用转课
                style: isGraduated || remainingHours === 0 ? { color: '#d9d9d9', cursor: 'not-allowed' } : undefined
              },
              {
                key: 'transferClass',
                label: '转班',
                icon: <SyncOutlined style={{ color: isGraduated || remainingHours === 0 ? '#d9d9d9' : '#52c41a' }} />,
                onClick: () => {
                  if (!isGraduated && remainingHours > 0) {
                    // 调试信息，打印当前课程
                    console.log(`点击转班按钮 - 课程ID: ${course.courseId}, 类型: ${typeof course.courseId}, 名称: ${course.courseName}`);

                    // 从课程完整信息中找到对应信息，避免ID类型不匹配问题
                    const courseInfoForTransfer = {
                      ...record,
                      selectedCourseId: course.courseId ? String(course.courseId) : undefined,
                      selectedCourseName: course.courseName // 添加课程名称
                    };

                    // 打印完整的传递信息
                    console.log('转班 - 传递的完整信息:', courseInfoForTransfer);

                    // 调用转班方法
                    onTransferClass(courseInfoForTransfer as any);
                  }
                },
                disabled: isGraduated || remainingHours === 0, // 已结业或剩余课时为0时禁用转班
                style: isGraduated || remainingHours === 0 ? { color: '#d9d9d9', cursor: 'not-allowed' } : undefined
              },
            ];

            return (
              <div
                key={`${record.id}-course-${course.studentCourseId || course.courseId || index}`}
                className="course-info-grid"
                style={{
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
                  {/* 左侧的课程类型颜色条，只在左侧显示 */}
                  <div style={renderCourseTypeIndicator(course.courseTypeName, course.status)}></div>

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
                      style={getCourseTypeTagStyle(course.courseTypeName)}
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
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                      display: 'inline-block',
                      minWidth: '100px'
                  }}>
                    {`${remainingHours ?? 0}/${course.totalHours ?? 0}课时`}
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
    fixed: 'right', // 固定在右侧，确保在小屏幕上也可见
    onHeaderCell: () => ({
      style: { ...columnStyle, whiteSpace: 'nowrap' },
    }),
    render: (_, record) => (
      <Space size={8} className="student-action-buttons">
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