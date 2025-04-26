import React from 'react';
import { Tag, Button, Dropdown } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  EditOutlined,
  FileTextOutlined,
  DollarOutlined,
  RollbackOutlined,
  TransactionOutlined,
  SyncOutlined,
  DeleteOutlined,
  DownOutlined
} from '@ant-design/icons';
import { Student } from '@/pages/student/types/student';
import dayjs from 'dayjs';
import { courseTypeOptions } from './options';

// 表头居中样式
const columnStyle: React.CSSProperties = {
  textAlign: 'center',
};

// 课程类型渲染函数
const renderCourseType = (text: string | undefined) => {
  if (!text) return <Tag color="default">未设置</Tag>;

  const typeInfo = courseTypeOptions.find(t => t.value === text);

  return (
    <Tag
      color={
        text === 'sports' ? 'green' :
        text === 'art' ? 'purple' :
        text === 'academic' ? 'orange' :
        text === '大课' ? 'blue' : 'default'
      }
    >
      {typeInfo?.label || text}
    </Tag>
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
  onAttendance: (student: Student) => void,
): ColumnsType<Student> => [
  {
    title: '打卡',
    key: 'attendance',
    align: 'center',
    width: 80,
    render: (_: any, record: Student) => (
      <Button
        type="link"
        onClick={() => onAttendance(record)}
        style={{ padding: '4px 8px' }}
      >
        打卡
      </Button>
    ),
  },
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
      const numA = parseInt(a.id.replace(/[^\d]/g, ''), 10);
      const numB = parseInt(b.id.replace(/[^\d]/g, ''), 10);
      return numA - numB;
    }
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
    onHeaderCell: () => ({
      style: { ...columnStyle, whiteSpace: 'nowrap' },
    }),
    render: (text, record) => (
      <span>
        {record.gender === 'MALE' ?
          <span style={{ color: '#1890ff', marginRight: 5 }}>♂</span> :
          <span style={{ color: '#eb2f96', marginRight: 5 }}>♀</span>
        }
        {text}
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
    title: '课程类型',
    dataIndex: 'courseType',
    key: 'courseType',
    align: 'center',
    width: 120,
    onHeaderCell: () => ({
      style: { ...columnStyle, whiteSpace: 'nowrap' },
    }),
    render: renderCourseType,
    sorter: (a, b) => (a.courseType || '').localeCompare(b.courseType || '')
  },
  {
    title: '教练',
    dataIndex: 'coach',
    key: 'coach',
    align: 'center',
    onHeaderCell: () => ({
      style: { ...columnStyle, whiteSpace: 'nowrap' },
    }),
    render: (text, record) => {
      // 如果有教练信息，直接显示
      if (text) {
        return text;
      }

      // 如果没有教练信息，但有课程组信息，尝试从课程组获取
      if (record.courseGroups && record.courseGroups.length > 0 && record.courseGroups[0].coach) {
        return record.courseGroups[0].coach;
      }

      // 如果都没有，显示默认值
      return '-';
    },
    sorter: (a, b) => {
      const coachA = a.coach || (a.courseGroups && a.courseGroups.length > 0 ? a.courseGroups[0].coach : '') || '';
      const coachB = b.coach || (b.courseGroups && b.courseGroups.length > 0 ? b.courseGroups[0].coach : '') || '';
      return coachA.localeCompare(coachB);
    }
  },
  {
    title: '剩余课时',
    dataIndex: 'remainingClasses',
    key: 'remainingClasses',
    align: 'center',
    onHeaderCell: () => ({
      style: { ...columnStyle, whiteSpace: 'nowrap' },
    }),
    sorter: (a, b) => {
      const remainingA = parseInt(a.remainingClasses.split('/')[0], 10);
      const remainingB = parseInt(b.remainingClasses.split('/')[0], 10);
      return remainingA - remainingB;
    }
  },
  {
    title: '最近上课时间',
    dataIndex: 'lastClassDate',
    key: 'lastClassDate',
    align: 'center',
    onHeaderCell: () => ({
      style: { ...columnStyle, whiteSpace: 'nowrap' },
    }),
    render: text => text ? dayjs(text).format('YYYY-MM-DD') : '未上课',
    sorter: (a, b) => {
      if (!a.lastClassDate) return 1;
      if (!b.lastClassDate) return -1;
      return dayjs(a.lastClassDate).unix() - dayjs(b.lastClassDate).unix();
    }
  },
  {
    title: '报名日期',
    dataIndex: 'enrollDate',
    key: 'enrollDate',
    align: 'center',
    onHeaderCell: () => ({
      style: { ...columnStyle, whiteSpace: 'nowrap' },
    }),
    render: text => dayjs(text).format('YYYY-MM-DD'),
    sorter: (a, b) => dayjs(a.enrollDate).unix() - dayjs(b.enrollDate).unix(),
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    onHeaderCell: () => ({
      style: { ...columnStyle, whiteSpace: 'nowrap' },
    }),
    render: status => {
      let color = '';
      let text = '';

      switch (status) {
        case 'active':
        case 'normal':
        case 'NORMAL':
          color = 'green';
          text = '在学';
          break;
        case 'STUDYING':
          color = 'green';
          text = '在学';
          break;
        case 'inactive':
        case 'SUSPENDED':
          color = 'red';
          text = '停课';
          break;
        case 'pending':
          color = 'orange';
          text = '待处理';
          break;
        case 'graduated':
        case 'GRADUATED':
          color = 'blue';
          text = '结业';
          break;
        case 'expired':
          color = 'gray';
          text = '过期';
          break;
        default:
          color = 'default';
          text = status;
      }

      return <Tag color={color}>{text}</Tag>;
    },
    sorter: (a, b) => {
      const statusOrder = {
        active: 0,
        normal: 0,
        NORMAL: 0,
        STUDYING: 0,
        pending: 1,
        inactive: 2,
        SUSPENDED: 2,
        graduated: 3,
        GRADUATED: 3,
        expired: 4
      };
      const aOrder = statusOrder[a.status as keyof typeof statusOrder] ?? 99;
      const bOrder = statusOrder[b.status as keyof typeof statusOrder] ?? 99;
      return aOrder - bOrder;
    }
  },
  {
    title: '操作',
    key: 'action',
    width: 120,
    onHeaderCell: () => ({
      style: { ...columnStyle, whiteSpace: 'nowrap' },
    }),
    render: (_, record) => (
      <Dropdown
        menu={{
          items: [
            {
              key: 'edit',
              label: '编辑',
              icon: <EditOutlined />,
              onClick: () => onEdit(record)
            },
            {
              key: 'record',
              label: '课程记录',
              icon: <FileTextOutlined />,
              onClick: () => onClassRecord(record)
            },
            {
              key: 'payment',
              label: '缴费',
              icon: <DollarOutlined />,
              onClick: () => onPayment(record)
            },
            {
              key: 'refund',
              label: '退费',
              icon: <RollbackOutlined />,
              onClick: () => onRefund(record)
            },
            {
              key: 'transfer',
              label: '转课',
              icon: <TransactionOutlined />,
              onClick: () => onTransfer(record)
            },
            {
              key: 'transferClass',
              label: '转班',
              icon: <SyncOutlined />,
              onClick: () => onTransferClass(record)
            },
            {
              key: 'delete',
              label: '删除',
              icon: <DeleteOutlined />,
              danger: true,
              onClick: () => onDelete(record.id)
            },
          ]
        }}
        trigger={['click']}
      >
        <Button type="link">
          操作 <DownOutlined />
        </Button>
      </Dropdown>
    ),
  },
];