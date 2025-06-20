import React from 'react';
import { Tag, Button, Dropdown, Space, Tooltip } from 'antd';
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
// 不再需要 FixedWidthTag，使用统一的 Tag 样式
// import FixedWidthTag from '../components/FixedWidthTag';

// 表头居中样式
const columnStyle: React.CSSProperties = {
  textAlign: 'center',
  backgroundColor: '#f5f5f5',
  fontWeight: 500,
  color: 'rgba(0, 0, 0, 0.85)',
  whiteSpace: 'nowrap',
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

// 移除未使用的 colorMap

// 定义课程类型标签的样式函数 - 统一样式
const getCourseTypeTagStyle = (type: string) => {
  const colors = {
    '大课': { background: '#e6f7ff', color: '#1890ff', border: '#91d5ff' },
    '一对一': { background: '#f6ffed', color: '#52c41a', border: '#b7eb8f' },
    '试听课': { background: '#fff2e8', color: '#fa8c16', border: '#ffd591' },
    '赠课': { background: '#f9f0ff', color: '#722ed1', border: '#d3adf7' },
  };
  
  const colorSet = colors[type as keyof typeof colors] || colors['大课'];
  
  return {
    display: 'inline-block',
    padding: '2px 6px', // 合理的内边距
    backgroundColor: colorSet.background,
    color: colorSet.color,
    border: `1px solid ${colorSet.border}`,
    borderRadius: '4px',
    fontSize: '11px',
    textAlign: 'center' as const,
    lineHeight: '1.2',
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
    position: 'relative',
    height: '100%', // 使用100%高度填充整个网格单元格
    width: '6px',
    backgroundColor: color,
    borderRadius: '3px',
    margin: '0 auto'
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
    dataIndex: 'studentId',
    key: 'studentId',
    width: '8%', // 增加ID列宽度
    align: 'center' as const,
    onHeaderCell: () => ({
      style: { ...columnStyle, whiteSpace: 'nowrap', padding: '8px 8px' },
    }),
    render: (value: number, record: Student) => {
      // 优先显示 studentId，如果不存在则显示 id
      return record.studentId || record.id || '-';
    },
    sorter: (a: any, b: any) => {
      const aId = a.studentId || a.id || '';
      const bId = b.studentId || b.id || '';
      return String(aId).localeCompare(String(bId));
    },
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: '11%', // 增加姓名列宽度
    align: 'center' as const,
    onHeaderCell: () => ({
      style: { ...columnStyle, whiteSpace: 'nowrap', padding: '8px 8px' },
    }),
    sorter: (a: any, b: any) => a.name.localeCompare(b.name),
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
    width: '6%', // 增加年龄列宽度
    align: 'center' as const,
    onHeaderCell: () => ({
      style: { ...columnStyle, whiteSpace: 'nowrap', padding: '8px 8px' },
    }),
    sorter: (a: any, b: any) => (a.age || 0) - (b.age || 0),
  },
  {
    title: '联系电话',
    dataIndex: 'phone',
    key: 'phone',
    width: '13%', // 增加电话列宽度
    align: 'center' as const,
    onHeaderCell: () => ({
      style: { ...columnStyle, whiteSpace: 'nowrap', padding: '8px 8px' },
    }),
  },
  {
    title: '课程信息',
    dataIndex: 'courseInfos',
    key: 'courseInfos',
    className: 'course-info-column',
    width: '52%', // 增加课程信息列宽度，给内容更多空间
    ellipsis: false, // 禁用省略，允许内容滚动
    onHeaderCell: () => ({
      style: { ...columnStyle, whiteSpace: 'nowrap', padding: '8px 8px' },
    }),
    render: (_, record) => {
      if (!record.courses || record.courses.length === 0) {
        return '-';
      }

      return (
        <div className="course-info-scroll-container" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px' // 统一设置课程行之间的间距为8px
        }}>
          <span className="scroll-indicator">← 左右滑动查看更多 →</span>
          {record.courses.map((course: CourseInfo & { courseTypeName?: string }, index: number) => {
            // 获取课时
            const remainingHours = course.remainingHours ?? 0;

            // 获取状态文本
            let statusText = '';
            const statusUpperCase = (course.status || '').toUpperCase();
            switch (statusUpperCase) {
              case 'STUDYING':
                statusText = '学习中';
                break;
              case 'NORMAL':  // 兼容旧状态
                statusText = '学习中';
                break;
              case 'EXPIRED':
                statusText = '过期';
                break;
              case 'GRADUATED':
                statusText = '结业';
                break;
              case 'WAITING_PAYMENT':
                statusText = '待缴费';
                break;
              case 'WAITING_CLASS':
                statusText = '待上课';
                break;
              case 'WAITING_RENEWAL':
                statusText = '待续费';
                break;
              case 'REFUNDED':
                statusText = '已退费';
                break;
              // 兼容其他旧状态
              case 'PUBLISHED':
                statusText = '学习中';
                break;
              case 'PENDING':
                statusText = '待开课';
                break;
              case 'INACTIVE':
                statusText = '停课';
                break;
              default:
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
                  alignItems: 'center',
                  backgroundColor: isDisabled ? '#fdfdfd' : '#fafafa',
                  width: '100%',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  opacity: statusUpperCase === 'EXPIRED' ? 1 : (isDisabled ? 0.7 : 1),
                  border: statusUpperCase === 'EXPIRED' ? '1px solid #ffccc7' : '1px solid #f0f0f0',
                  position: 'relative',
                  marginBottom: index < (record.courses?.length || 0) - 1 ? '4px' : '0',
                }}>
                {/* 左侧的课程状态竖线 */}
                <div style={{ 
                  width: '4px',
                  height: '20px',
                  backgroundColor: (() => {
                    const statusUpperCase = (course.status || '').toUpperCase();
                    if (statusUpperCase === 'EXPIRED') {
                      return '#ff4d4f';
                    } else if (course.courseTypeName && courseTypeColors[course.courseTypeName]) {
                      return courseTypeColors[course.courseTypeName];
                    } else {
                      return '#1677FF';
                    }
                  })(),
                  borderRadius: '2px',
                  justifySelf: 'center'
                }}></div>
                
                {/* 课程名称 - 左对齐，通过CSS控制 */}
                <div style={{ 
                  color: 'rgba(0, 0, 0, 0.85)',
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  lineHeight: '22px',
                }} title={course.courseName}>
                  {course.courseName || '-'}
                </div>
                
                {/* 课程类型 - 居中对齐，通过CSS控制 */}
                <div>
                  <Tag
                    style={{
                      ...getCourseTypeTagStyle(course.courseTypeName || '未知'),
                      height: '22px',
                      lineHeight: '18px',
                    }}
                  >
                    {course.courseTypeName || '未知'}
                  </Tag>
                </div>
                
                {/* 教练 - 居中对齐，通过CSS控制 */}
                <div style={{
                    color: 'rgba(0, 0, 0, 0.65)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    lineHeight: '22px',
                }}>
                  {course.coachName || '-'}
                </div>
                
                {/* 课时 - 居中对齐，通过CSS控制 */}
                <div style={{
                    color: isDisabled ? '#bfbfbf' : (remainingHours <= 5 ? '#f5222d' : 'rgba(0, 0, 0, 0.85)'),
                    textDecoration: isDisabled ? 'line-through' : 'none',
                    fontWeight: remainingHours <= 5 ? 'bold' : 'normal',
                    whiteSpace: 'nowrap',
                    lineHeight: '22px',
                }}>
                  {`${remainingHours ?? 0}/${course.totalHours ?? 0}课时`}
                </div>
                
                {/* 状态 - 居中对齐，通过CSS控制 */}
                <div>
                  <Tooltip title={`有效期至: ${course.endDate ? dayjs(course.endDate).format('YYYY-MM-DD') : '未设置'}`}>
                    <Tag
                      style={{
                        height: '22px',
                        textAlign: 'center',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: 0,
                        padding: '0 4px',
                        fontSize: '12px',
                        fontWeight: '500',
                        borderRadius: '4px',
                        lineHeight: '1',
                        backgroundColor: statusUpperCase === 'EXPIRED' || statusUpperCase === 'GRADUATED' || statusUpperCase === 'REFUNDED' ? '#fff' :
                                        (statusUpperCase === 'NORMAL' || statusUpperCase === 'STUDYING' ? '#f6ffed' : '#f9f0ff'),
                        color: statusUpperCase === 'EXPIRED' ? '#ff4d4f' :
                              (statusUpperCase === 'NORMAL' || statusUpperCase === 'STUDYING' ? '#52c41a' :
                              (statusUpperCase === 'GRADUATED' ? '#1890ff' : '#722ed1')),
                        border: `1px solid ${statusUpperCase === 'EXPIRED' ? '#ff4d4f' :
                                (statusUpperCase === 'NORMAL' || statusUpperCase === 'STUDYING' ? '#52c41a' :
                                (statusUpperCase === 'GRADUATED' ? '#1890ff' : '#722ed1'))}`,
                        opacity: isDisabled ? 0.7 : 1
                      }}
                    >
                      {statusText}
                    </Tag>
                  </Tooltip>
                </div>
                
                {/* 操作按钮组 - 居中对齐，通过CSS控制 */}
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}>
                  {/* 打卡请假按钮 */}
                  <Tooltip title={isDisabled ? getAttendanceDisabledReason() : "打卡请假"}>
                    <Button 
                      type="link"
                      icon={<CheckCircleOutlined style={{ color: isDisabled ? '#bfbfbf' : '#52c41a' }} />}
                      size="small"
                      onClick={() => onAttendance({ ...record, attendanceCourse: { id: course.courseId, name: course.courseName } })}
                      disabled={isDisabled}
                      style={{ padding: '0', margin: '0' }}
                    />
                  </Tooltip>

                  {/* 课程记录按钮 */}
                  <Button 
                    type="link"
                    icon={<FileTextOutlined style={{ color: '#1890ff' }} />}
                    size="small"
                    onClick={() => onClassRecord(record)}
                    style={{ padding: '0', margin: '0' }}
                    title="课程记录"
                  />

                  {/* 缴费按钮 */}
                  <Button 
                    type="link"
                    icon={<DollarOutlined style={{ color: '#fa8c16' }} />}
                    size="small"
                    onClick={() => onPayment(record)}
                    style={{ padding: '0', margin: '0' }}
                    title="缴费"
                  />

                  {/* 更多操作 */}
                  {remainingMenuItems.length > 0 && (
                    <Dropdown
                      menu={{ items: remainingMenuItems }}
                      trigger={['click']}
                      placement="bottomRight"
                    >
                      <Button 
                        type="link"
                        icon={<MoreOutlined style={{ color: '#666' }} />}
                        size="small"
                        style={{ padding: '0', margin: '0' }}
                        title="更多操作"
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
    key: 'operation',
    width: '10%', // 8%+11%+6%+13%+52%+10%=100%，保持操作按钮紧凑
    fixed: 'right' as const,
    align: 'center',
    className: 'operation-column', // 添加特殊类名，用于CSS选择器
    onHeaderCell: () => ({
      style: { ...columnStyle },
    }),
    render: (_, record) => (
      <div className="student-action-buttons">
        {/* 详情按钮 - 蓝色 */}
        <Button
          type="link"
          icon={<InfoCircleOutlined style={{ color: '#1890ff' }} />}
          onClick={() => onDetails?.(record)}
          title="详情"
          className="action-button"
        />

        {/* 编辑按钮 - 黄色 */}
        <Button
          type="link"
          icon={<EditOutlined style={{ color: '#faad14' }} />}
          onClick={() => onEdit(record)}
          title="编辑"
          className="action-button"
        />

        {/* 删除按钮 - 红色 */}
        <Button
          type="link"
          danger
          icon={<DeleteOutlined style={{ color: '#f5222d' }} />}
          onClick={() => onDelete(record)}
          title="删除"
          className="action-button"
        />
      </div>
    ),
  },
];