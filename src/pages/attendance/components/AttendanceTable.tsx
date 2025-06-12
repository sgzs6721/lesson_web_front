import React from 'react';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { AttendanceRecord } from '../types';
import { STATUS_TEXT_MAP, STATUS_COLOR_MAP } from '../constants';
import StandardPagination from '@/components/common/StandardPagination';
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
      title: '操作时间',
      dataIndex: 'checkTime',
      key: 'checkTime',
      width: 180,
      render: (text: string) => text ? new Date(text).toLocaleString('sv-SE') : '-',
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
      width: 120,
      ellipsis: true,
      render: (text: string) => text || '-',
    },
  ];

  return (
    <>
      <Table<AttendanceRecord>
        className="attendance-table"
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={false}
      />
      <StandardPagination
        current={currentPage}
        pageSize={pageSize}
        total={total}
        onChange={onPageChange}
        totalText="条考勤记录"
      />
    </>
  );
};

export default AttendanceTable; 