import React from 'react';
import { ColumnsType } from 'antd/es/table';
import { Tag, Button, Dropdown, Space, Tooltip } from 'antd';
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
  MoreOutlined,
  ShareAltOutlined,
  ManOutlined,
  WomanOutlined
} from '@ant-design/icons';
import { Student, CourseInfo } from '@/pages/student/types/student';
import { Constant } from '@/api/constants/types';
import { SimpleCourse } from '@/api/course/types';
import dayjs from 'dayjs';
// 不再需要 FixedWidthTag，使用统一的 Tag 样式
// import FixedWidthTag from '../components/FixedWidthTag';

// 在模块级别添加一次事件监听：用于共享后的本地预览渲染
if (typeof window !== 'undefined' && !(window as any).__student_share_preview_bound) {
  (window as any).__student_share_preview_bound = true;
  window.addEventListener('student:share:preview', (e: any) => {
    const { studentId, fromCourseId, toCourseName } = e.detail || {};
    try {
      const key = `share-preview-${studentId}-${fromCourseId}`;
      const el = document.querySelector(`[data-share-preview-key="${key}"]`);
      if (el) {
        (el as HTMLElement).textContent = toCourseName ? `共享至：${toCourseName}` : '';
        (el as HTMLElement).style.display = toCourseName ? 'block' : 'none';
      }
    } catch {}
  });
}

// 表头居中样式
const columnStyle: React.CSSProperties = {
  textAlign: 'center',
  backgroundColor: '#f5f5f5',
  fontWeight: 500,
  color: 'rgba(0, 0, 0, 0.85)',
  whiteSpace: 'nowrap',
};

// 移除未使用的 colorMap

// 定义课程类型标签的样式函数 - 纯动态分配
const getCourseTypeTagStyle = (type: string) => {
  // 动态颜色方案 - 深色系，避免绿色系
  const dynamicColors = [
    { background: '#e6f4ff', color: '#1d39c4', border: '#91caff' }, // 深蓝色系
    { background: '#fff2e8', color: '#d46b08', border: '#ffd591' }, // 深橙色系
    { background: '#f9f0ff', color: '#531dab', border: '#d3adf7' }, // 深紫色系
    { background: '#fff1f0', color: '#cf1322', border: '#ffccc7' }, // 深红色系
    { background: '#e6fffb', color: '#08979c', border: '#87e8de' }, // 深青色系
    { background: '#fef7ff', color: '#c41d7f', border: '#fad1e8' }, // 深粉色系
    { background: '#fffbe6', color: '#d48806', border: '#ffe58f' }, // 深黄色系
    { background: '#f0f5ff', color: '#2f54eb', border: '#adc6ff' }, // 蓝色系
    { background: '#fff7e6', color: '#fa8c16', border: '#ffd591' }, // 橙色系
    { background: '#f9f0ff', color: '#722ed1', border: '#d3adf7' }, // 紫色系
    { background: '#fff2f0', color: '#ff4d4f', border: '#ffccc7' }, // 红色系
    { background: '#e6fffb', color: '#13c2c2', border: '#87e8de' }, // 青色系
    { background: '#fef7ff', color: '#eb2f96', border: '#fad1e8' }, // 粉色系
    { background: '#fffbe6', color: '#faad14', border: '#ffe58f' }, // 黄色系
    { background: '#f0f9ff', color: '#0369a1', border: '#7dd3fc' }, // 深蓝色系
    { background: '#fff7ed', color: '#ea580c', border: '#fed7aa' }, // 深橙色系
    { background: '#faf5ff', color: '#7c3aed', border: '#c4b5fd' }, // 深紫色系
  ];
  
  // 根据类型名称生成哈希值来选择颜色 - 改进算法避免冲突
  let hash = 0;
  for (let i = 0; i < type.length; i++) {
    const char = type.charCodeAt(i);
    hash = ((hash << 5) - hash + char) & 0xffffffff;
  }
  
  // 使用更大的素数来减少冲突
  const colorIndex = Math.abs(hash) % 31; // 使用31而不是16
  const actualIndex = colorIndex % dynamicColors.length;
  const colorSet = dynamicColors[actualIndex];
  
  return {
    display: 'inline-block',
    padding: '2px 6px',
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
  } else if (courseTypeName) {
    // 动态生成颜色
    const colors = ['#4F46E5', '#6366F1', '#F97316', '#06B6D4', '#14B8A6', '#A855F7', '#3B82F6', '#1677FF'];
    let hash = 0;
    for (let i = 0; i < courseTypeName.length; i++) {
      const char = courseTypeName.charCodeAt(i);
      hash = ((hash << 5) - hash + char) & 0xffffffff;
    }
    const colorIndex = Math.abs(hash) % colors.length;
    color = colors[colorIndex];
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

// 教练名颜色映射（稳定且均匀）- 避免绿色系，使用蓝色、紫色、红色、橙色等
const coachPalette = [
  '#1d39c4', // 深蓝色
  '#d4380d', // 深红色
  '#531dab', // 深紫色
  '#c41d7f', // 深粉色
  '#d46b08', // 深橙色
  '#642ab5', // 深紫罗兰色
  '#722ed1', // 紫色
  '#eb2f96', // 深粉色
  '#fa8c16', // 深橙色
  '#9254de', // 深紫罗兰色
  '#f5222d', // 深红色
  '#fa541c', // 深橙红色
  '#2f54eb', // 深蓝色
  '#1890ff', // 深蓝色
  '#13c2c2', // 深青色
  '#36cfc9', // 深青蓝色
  '#08979c', // 深青色
  '#595959', // 深灰色
  '#434343', // 更深灰色
  '#262626'  // 最深灰色
];
const getCoachColor = (name?: string) => {
  if (!name) return '#8c8c8c';
  
  // 改进的哈希算法，确保不同名字得到不同颜色
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = ((hash << 5) - hash + char) & 0xffffffff; // 确保32位整数
  }
  
  // 使用更精确的索引计算
  const idx = Math.abs(hash) % coachPalette.length;
  return coachPalette[idx];
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
  onShare?: (student: Student) => void, // 新增：共享回调
  validityPeriodOptions?: Constant[], // 新增：有效期常量选项
  courseList?: SimpleCourse[], // 新增：课程列表
): ColumnsType<Student> => [
  {
    title: '学员ID',
    dataIndex: 'studentId',
    key: 'id',
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
    // 取消姓名排序
    render: (text: string, record: Student) => {
      const genderValue = String((record as any)?.gender || '').toUpperCase();
      const isMale = genderValue === 'MALE';
      const isFemale = genderValue === 'FEMALE';
      const IconComp = isMale ? ManOutlined : WomanOutlined;
      const color = isMale ? '#1890ff' : '#eb2f96';

      return (
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          {(isMale || isFemale) && (
            <IconComp style={{ fontSize: 12, color, opacity: 0.9, marginRight: 4, lineHeight: 1 }} />
          )}
          <span>{text}</span>
        </span>
      );
    }
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
              case 'WAITING_RENEWAL':
                statusText = '待续费';
                break;
              case 'REFUNDED':
                statusText = '已退费';
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

            // 定义剩余操作的菜单项（退费、转课、转班、共享）
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
              {
                key: 'share',
                label: '共享',
                icon: <ShareAltOutlined style={{ color: '#13c2c2' }} />,
                onClick: () => {
                  if (onShare) {
                    const infoForShare = {
                      ...record,
                      selectedCourseId: course.courseId ? String(course.courseId) : undefined,
                      selectedCourseName: course.courseName
                    } as any;
                    console.log('共享 - 传递的完整信息:', infoForShare);
                    onShare(infoForShare);
                  }
                },
                disabled: false,
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
                  // 动态设置高度：有共享课程时36px，没有时18px
                  height: course.sharingInfoList && course.sharingInfoList.length > 0 ? '36px' : '18px',
                  backgroundColor: (() => {
                    const statusUpperCase = (course.status || '').toUpperCase();
                    if (statusUpperCase === 'EXPIRED') {
                      return '#ff4d4f';
                    } else if (course.courseTypeName) {
                      // 动态生成颜色
                      const colors = ['#4F46E5', '#6366F1', '#F97316', '#06B6D4', '#14B8A6', '#A855F7', '#3B82F6', '#1677FF'];
                      let hash = 0;
                      for (let i = 0; i < course.courseTypeName.length; i++) {
                        const char = course.courseTypeName.charCodeAt(i);
                        hash = ((hash << 5) - hash + char) & 0xffffffff;
                      }
                      const colorIndex = Math.abs(hash) % colors.length;
                      return colors[colorIndex];
                    } else {
                      return '#1677FF';
                    }
                  })(),
                  borderRadius: '2px',
                  // 确保竖线在容器中垂直居中
                  alignSelf: 'center'
                }}></div>
                
                {/* 课程类型 - 先显示标签 */}
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
                
                {/* 课程名称 + 教练 - 原课程与共享课程分两行显示 */}
                <div style={{ 
                  color: 'rgba(0, 0, 0, 0.85)',
                  fontWeight: 500,
                  lineHeight: '1.2',
                  // 动态设置高度：有共享课程时44px，没有时22px
                  minHeight: course.sharingInfoList && course.sharingInfoList.length > 0 ? '44px' : '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  maxWidth: '100%',
                  position: 'relative'
                }}>

                  {/* 第一行：打卡按钮 + 原课程名称 + 教练 */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 6, 
                    marginBottom: course.sharingInfoList && course.sharingInfoList.length > 0 ? 2 : 0,
                    minHeight: '20px'
                  }}>
                    <Tooltip title={isDisabled ? getAttendanceDisabledReason() : '打卡请假'}>
                      <Button 
                        type="link"
                        icon={<CheckCircleOutlined style={{ color: isDisabled ? '#bfbfbf' : '#52c41a' }} />}
                        size="small"
                        onClick={() => onAttendance({ ...record, attendanceCourse: { id: course.courseId, name: course.courseName } })}
                        disabled={isDisabled}
                        style={{ padding: 0, margin: 0, minWidth: 'auto', width: '16px' }}
                      />
                    </Tooltip>
                    <span style={{ 
                      fontSize: '14px',
                      fontWeight: 500,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      width: '90px', // 固定宽度确保对齐
                      display: 'inline-block'
                    }}>
                      {course.courseName || '-'}
                    </span>
                    <span style={{ margin: '0 2px', color: '#d9d9d9', width: '8px', textAlign: 'center' }}>|</span>
                    <span style={{ 
                      color: getCoachColor(course.coachName),
                      fontSize: '14px',
                      fontWeight: 500,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      width: '60px', // 固定宽度确保对齐
                      display: 'inline-block'
                    }}>
                      {course.coachName || '-'}
                    </span>
                  </div>
                  
                  {/* 第二行：共享课程信息 - 如果存在 */}
                  {course.sharingInfoList && course.sharingInfoList.length > 0 && (
                    <div style={{ 
                      minHeight: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}>
                      {course.sharingInfoList.map((sharing, idx) => (
                        <div key={idx} style={{ 
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          marginRight: idx < course.sharingInfoList!.length - 1 ? 8 : 0,
                          width: '100%' // 确保占满宽度
                        }}>
                          {/* 共享课程的打卡按钮 */}
                          <Tooltip title={isDisabled ? getAttendanceDisabledReason() : '打卡请假'}>
                            <Button 
                              type="link"
                              icon={<CheckCircleOutlined style={{ color: isDisabled ? '#bfbfbf' : '#52c41a' }} />}
                              size="small"
                              onClick={() => {
                                // 根据targetCourseId从课程列表中查找对应的课程名称
                                const targetCourse = courseList?.find(course => course.id === sharing.targetCourseId);
                                const targetCourseName = targetCourse?.name || sharing.targetCourseName || `课程${sharing.targetCourseId}`;
                                
                                onAttendance({ 
                                  ...record, 
                                  // 对于共享课程，传入目标课程的信息
                                  courseId: sharing.targetCourseId, 
                                  courseName: targetCourseName,
                                  attendanceCourse: { 
                                    id: sharing.targetCourseId, 
                                    name: targetCourseName 
                                  } 
                                } as Student & { courseName?: string });
                              }}
                              disabled={isDisabled}
                              style={{ padding: 0, margin: 0, minWidth: 'auto', width: '16px' }}
                            />
                          </Tooltip>
                          
                          {/* 共享课程名称和教练 - 与第一行完全相同的布局和宽度 */}
                          <span style={{ 
                            fontSize: '14px',
                            fontWeight: 500,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            width: '90px', // 与第一行相同的固定宽度
                            display: 'inline-block'
                          }}>
                            {sharing.sourceCourseName || '-'}
                          </span>
                          <span style={{ margin: '0 2px', color: '#d9d9d9', width: '8px', textAlign: 'center' }}>|</span>
                          <span style={{ 
                            color: getCoachColor(sharing.coachName),
                            fontSize: '14px',
                            fontWeight: 500,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            width: '60px', // 与第一行相同的固定宽度
                            display: 'inline-block'
                          }}>
                            {sharing.coachName || '-'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* 课时 - 居中对齐，通过CSS控制 */}
                <div style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: course.sharingInfoList && course.sharingInfoList.length > 0 ? '44px' : '22px',
                }}>
                  {/* 如果有共享课程，左侧显示共享标签 */}
                  {course.sharingInfoList && course.sharingInfoList.length > 0 && (
                    <div style={{
                      position: 'absolute',
                      left: '-30px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: '#52c41a',
                      color: '#fff',
                      fontSize: '10px',
                      padding: '2px 4px',
                      borderRadius: '2px',
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap',
                      zIndex: 2,
                    }}>
                      共享
                    </div>
                  )}
                  
                  <div style={{
                      color: isDisabled ? '#bfbfbf' : (remainingHours <= 5 ? '#f5222d' : 'rgba(0, 0, 0, 0.85)'),
                      textDecoration: isDisabled ? 'line-through' : 'none',
                      fontWeight: remainingHours <= 5 ? 'bold' : 'normal',
                      whiteSpace: 'nowrap',
                      lineHeight: '22px',
                  }}>
                    {`${remainingHours ?? 0}/${course.totalHours ?? 0}课时`}
                  </div>
                </div>
                
                {/* 状态 - 居中对齐，通过CSS控制 */}
                <div>
                  <Tooltip title={(() => {
                    const end = course.endDate;
                    if (end) {
                      return `有效期至：${dayjs(end).format('YYYY-MM-DD')}`;
                    }
                    // 如果endDate为null，使用validityPeriodId查找对应的常量值
                    const validityPeriodId = (course as any).validityPeriodId;
                    if (validityPeriodId && validityPeriodOptions && validityPeriodOptions.length > 0) {
                      const validityOption = validityPeriodOptions.find(opt => opt.id === Number(validityPeriodId));
                      if (validityOption) {
                        return `有效期：${validityOption.constantValue}个月`;
                      }
                    }
                    return '有效期：未设置';
                  })()}>
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
                                        (statusUpperCase === 'NORMAL' || statusUpperCase === 'STUDYING' ? '#f0f9f0' : '#f9f0ff'),
                        color: statusUpperCase === 'EXPIRED' ? '#ff4d4f' :
                              (statusUpperCase === 'NORMAL' || statusUpperCase === 'STUDYING' ? '#389e0d' :
                              (statusUpperCase === 'GRADUATED' ? '#1890ff' : '#722ed1')),
                        border: `1px solid ${statusUpperCase === 'EXPIRED' ? '#ff4d4f' :
                                (statusUpperCase === 'NORMAL' || statusUpperCase === 'STUDYING' ? '#389e0d' :
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
                    onClick={() => onPayment({ 
                      ...record, 
                      paymentCourse: { 
                        id: course.courseId, 
                        name: course.courseName,
                        type: course.courseTypeName,
                        coach: course.coachName,
                        remainingHours: course.remainingHours,
                        totalHours: course.totalHours,
                        status: course.status,
                        enrollDate: (course as any).enrollDate,
                        expireDate: course.endDate
                      }
                    } as any)}
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
                {/* 共享预览行（提交后即时展示） */}
                <div
                  data-share-preview-key={`share-preview-${record.studentId || record.id}-${course.courseId || course.studentCourseId}`}
                  style={{ display: 'none', marginTop: 6, color: '#8c8c8c', gridColumn: '1 / -1' }}
                />
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