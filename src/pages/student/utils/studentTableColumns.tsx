import React from 'react';
import { Tag, Space, Button } from 'antd';
import { EditOutlined, DeleteOutlined, FileTextOutlined, DollarOutlined, SwapOutlined } from '@ant-design/icons';
import { Student } from '@/pages/student/types/student';
import { ColumnsType } from 'antd/es/table';
import { courseOptions } from '@/pages/student/constants/options';

// 定义表格列
export const getStudentColumns = (
  onEdit: (student: Student) => void,
  onClassRecord: (student: Student) => void,
  onPayment: (student: Student) => void,
  onRefund: (student: Student) => void,
  onTransfer: (student: Student) => void, 
  onDelete: (id: string) => void
): ColumnsType<Student> => {
  return [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      render: (text: string, record: Student) => (
        <a onClick={() => onEdit(record)}>{text}</a>
      ),
    },
    {
      title: '学号',
      dataIndex: 'studentId',
      key: 'studentId',
      width: 100,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: 80,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      width: 80,
      render: (gender: string) => (
        gender === 'male' ? '男' : gender === 'female' ? '女' : '未知'
      ),
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 130,
    },
    {
      title: '课程',
      dataIndex: 'courseGroups',
      key: 'courseGroups',
      width: 220,
      ellipsis: true,
      render: (courseGroups: Student['courseGroups']) => 
        courseGroups?.map(group => {
          const courseName = group.courses?.[0] || '';
          return courseOptions.find((c: {value: string; label: string}) => c.value === courseName)?.label || courseName;
        }).join(', ') || '-',
    },
    {
      title: '教练',
      dataIndex: 'courseGroups',
      key: 'coach',
      width: 100,
      render: (courseGroups: Student['courseGroups']) => 
        courseGroups?.[0]?.coach || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (status: string) => (
        <Tag 
          color={
            status === 'active' ? 'green' :
            status === 'inactive' ? 'volcano' :
            status === 'pending' ? 'geekblue' : 'default'
          }
        >
          {
            status === 'active' ? '在读' :
            status === 'inactive' ? '停课' :
            status === 'pending' ? '待开课' : status
          }
        </Tag>
      ),
    },
    {
      title: '剩余课时',
      dataIndex: 'remainingClasses',
      key: 'remainingClasses',
      width: 100,
      render: (text: number) => (
        <span style={{ color: text <= 5 ? '#f5222d' : 'inherit' }}>
          {text}
        </span>
      ),
    },
    {
      title: '最近上课',
      dataIndex: 'lastClassDate',
      key: 'lastClassDate',
      width: 110,
    },
    {
      title: '报名日期',
      dataIndex: 'enrollDate',
      key: 'enrollDate',
      width: 110,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right' as const,
      width: 220,
      render: (_: any, record: Student) => (
        <Space size="small" className="student-action-buttons">
          <Button 
            type="text" 
            size="small" 
            icon={<EditOutlined />} 
            onClick={() => onEdit(record)}
          >
            编辑
          </Button>
          <Button 
            type="text" 
            size="small" 
            icon={<FileTextOutlined />} 
            onClick={() => onClassRecord(record)}
          >
            课程记录
          </Button>
          <Button
            type="text"
            size="small"
            icon={<DollarOutlined />}
            onClick={() => onPayment(record)}
          >
            缴费
          </Button>
          <Button 
            type="text" 
            size="small" 
            danger
            icon={<DeleteOutlined />} 
            onClick={() => onDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];
}; 