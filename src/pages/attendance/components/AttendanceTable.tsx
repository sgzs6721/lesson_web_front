import React from 'react';
import { Table, Tag, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { AttendanceRecord } from '../types';
import { STATUS_TEXT_MAP, STATUS_COLOR_MAP } from '../constants';

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
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 100,
    },
    {
      title: '学员',
      dataIndex: 'studentName',
      key: 'studentName',
      width: 100,
    },
    {
      title: '课程',
      dataIndex: 'courseName',
      key: 'courseName',
      width: 150,
    },
    {
      title: '教练',
      dataIndex: 'coachName',
      key: 'coachName',
      width: 100,
    },
    {
      title: '上课时间',
      key: 'classTime',
      width: 150,
      render: (_, record) => `${record.startTime}-${record.endTime}`,
    },
    {
      title: '打卡时间',
      key: 'checkTime',
      width: 150,
      render: (_, record) => {
        if (!record.checkInTime && !record.checkOutTime) return '-';
        return (
          <Tooltip title={`签到: ${record.checkInTime || '-'} | 签退: ${record.checkOutTime || '-'}`}>
            <span>{record.checkInTime || '-'} / {record.checkOutTime || '-'}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: AttendanceRecord['status']) => (
        <Tag color={STATUS_COLOR_MAP[status]}>
          {STATUS_TEXT_MAP[status]}
        </Tag>
      ),
    },
  ];

  return (
    <Table<AttendanceRecord>
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