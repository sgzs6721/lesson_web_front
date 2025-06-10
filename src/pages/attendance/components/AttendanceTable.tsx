import React from 'react';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { AttendanceRecord } from '../types';
import { STATUS_TEXT_MAP, STATUS_COLOR_MAP } from '../constants';
import './AttendanceTable.css';

const PRESET_COLORS = [
  'magenta', 'red', 'volcano', 'orange', 'gold',
  'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'
];

const getColorForText = (text: string) => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PRESET_COLORS[Math.abs(hash) % PRESET_COLORS.length];
};

interface AttendanceTableProps {
  loading: boolean;
  data: AttendanceRecord[];
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({
  loading,
  data,
  total,
  currentPage,
  pageSize,
  onPageChange,
}) => {
  const columns: ColumnsType<AttendanceRecord> = [
    {
      title: '学员',
      dataIndex: 'studentName',
      key: 'studentName',
      width: 120,
      align: 'center',
    },
    {
      title: '课程',
      dataIndex: 'courseName',
      key: 'courseName',
      width: 140,
      align: 'center',
      render: (text: string) => text ? (
        <Tag
          color={getColorForText(text)}
          style={{ width: '120px', textAlign: 'center' }}
        >
          {text}
        </Tag>
      ) : '-',
    },
    {
      title: '教练',
      dataIndex: 'coachName',
      key: 'coachName',
      width: 100,
      align: 'center',
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 100,
      align: 'center',
    },
    {
      title: '上课时间',
      dataIndex: 'classTime',
      key: 'classTime',
      width: 120,
      align: 'center',
    },
    {
      title: '类型',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      align: 'center',
      render: (status: string) => {
        const color = STATUS_COLOR_MAP[status] || 'default';
        const text = STATUS_TEXT_MAP[status] || status;
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
      width: 120,
      ellipsis: true,
    },
    {
      title: '操作时间',
      dataIndex: 'checkTime',
      key: 'checkTime',
      width: 180,
      render: (text: string) => text ? new Date(text).toLocaleString('sv-SE') : '-',
    },
  ];

  return (
    <Table<AttendanceRecord>
      className="attendance-table"
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      pagination={{
        current: currentPage,
        pageSize: pageSize,
        total: total,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条记录`,
        locale: {
          items_per_page: '条/页',
          jump_to: '跳至',
          jump_to_confirm: '确定',
          page: '页',
        },
      }}
      onChange={(pagination) => {
        onPageChange(pagination.current || 1, pagination.pageSize || 10);
      }}
    />
  );
};

export default AttendanceTable; 