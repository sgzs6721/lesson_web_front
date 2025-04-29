import React from 'react';
import { Modal, Table, Empty, Tag } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { Student, UIAttendanceRecord } from '../types/student'; // 使用正确的相对路径
import '../student.css';

// 辅助函数：根据文本生成 Antd Tag 颜色
const PREDEFINED_COLORS = [
  'magenta',
  'red',
  'volcano',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'purple',
];

const getStringHashCode = (str: string): number => {
  let hash = 0;
  if (str.length === 0) return hash;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

const getTagColor = (text: string): string => {
  if (!text) return 'default'; // 如果文本为空，返回默认颜色
  const hash = getStringHashCode(text);
  const index = Math.abs(hash) % PREDEFINED_COLORS.length;
  return PREDEFINED_COLORS[index];
};

interface ClassRecordModalProps {
  visible: boolean;
  student: Student | null;
  records: UIAttendanceRecord[]; // 使用新的 UI 记录类型
  loading: boolean;
  pagination: TablePaginationConfig; // 使用 antd 的分页配置类型
  courseSummaries: { courseName: string; count: number }[]; // 新增 prop
  onCancel: () => void;
  onTableChange: (pagination: TablePaginationConfig) => void; // 表格变化回调
}

const ClassRecordModal: React.FC<ClassRecordModalProps> = ({
  visible,
  student,
  records,
  loading,
  pagination,
  courseSummaries, // 接收 prop
  onCancel,
  onTableChange
}) => {
  // 定义表格列
  const columns: ColumnsType<UIAttendanceRecord> = [
    {
      title: '上课日期',
      dataIndex: 'courseDate',
      key: 'courseDate',
      width: 120,
      align: 'center',
      onHeaderCell: () => ({ style: { textAlign: 'center' } }),
      render: (text) => text || '无',
      sorter: (a, b) => new Date(a.courseDate).getTime() - new Date(b.courseDate).getTime(),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: '时间段',
      dataIndex: 'timeRange',
      key: 'timeRange',
      width: 140,
      align: 'center',
      onHeaderCell: () => ({ style: { textAlign: 'center' } }),
      render: (text) => text || '无',
    },
    {
      title: '课程名称',
      dataIndex: 'courseName',
      key: 'courseName',
      align: 'center',
      ellipsis: true,
      onHeaderCell: () => ({ style: { textAlign: 'center' } }),
      render: (text) => text ? <Tag color={getTagColor(text)}>{text}</Tag> : '无',
    },
    {
      title: '教练',
      dataIndex: 'coachName',
      key: 'coachName',
      width: 100,
      align: 'center',
      onHeaderCell: () => ({ style: { textAlign: 'center' } }),
      render: (text) => text ? <Tag color={getTagColor(text)}>{text}</Tag> : '无',
    },
    {
      title: '剩余课时',
      dataIndex: 'remainingHours',
      key: 'remainingHours',
      width: 90,
      align: 'right',
      render: (hours?: number) => {
        return '-';
      },
    },
    {
      title: '备注',
      dataIndex: 'notes',
      key: 'notes',
      align: 'center',
      ellipsis: true,
      onHeaderCell: () => ({ style: { textAlign: 'center' } }),
      render: (text) => text || '无',
    },
  ];

  return (
    <Modal
      title={`课程记录 - ${student?.name || '学员'}`}
      open={visible}
      onCancel={onCancel}
      footer={null} // 一般记录查看不需要确认按钮
      width={800} // 可能需要稍微加宽 Modal 以容纳新列
      destroyOnClose
      centered
      className="class-record-modal"
    >
      {/* 在表格上方显示课程统计信息 */}
      {courseSummaries && courseSummaries.length > 0 && (
        <div style={{ marginBottom: '16px', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
          {courseSummaries.map((summary) => (
            <span key={summary.courseName} style={{ marginRight: '16px' }}>
              <Tag color={getTagColor(summary.courseName)}>{summary.courseName}</Tag>
              共 {summary.count} 条记录
            </span>
          ))}
        </div>
      )}

      <Table
        columns={columns}
        dataSource={records}
        loading={loading}
        pagination={pagination} // 使用包含 showTotal 的 pagination
        onChange={onTableChange}
        rowKey="key"
        scroll={{ y: 350 }} // 稍微减小滚动高度，为统计信息留出空间
        locale={{
          emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无上课记录" />
        }}
        size="small"
      />
    </Modal>
  );
};

export default ClassRecordModal;