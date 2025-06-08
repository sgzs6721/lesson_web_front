import React from 'react';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { AttendanceRecord } from '../types';
import './AttendanceTable.css';

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
      width: 150,
      align: 'center',
      render: (text) => (
        <Tag 
          color="blue" 
          className="course-tag"
        >
          {text || '-'}
        </Tag>
      ),
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
      title: '打卡时间',
      dataIndex: 'checkTime',
      key: 'checkTime',
      width: 120,
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      align: 'center',
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
      width: 200,
      align: 'center',
      render: (text) => {
        if (!text) return '-';
        const parts = text.split(' | ');
        return (
          <div>
            {parts.map((part: string, index: number) => (
              <div key={index} style={{ fontSize: '12px', color: '#666' }}>
                {part}
              </div>
            ))}
          </div>
        );
      },
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