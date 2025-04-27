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
import FixedWidthTag from '../components/FixedWidthTag';

// 表头居中样式
const columnStyle: React.CSSProperties = {
  textAlign: 'center',
};

// 课程类型渲染函数
const renderCourseType = (text: string | undefined) => {
  if (!text) return (
    <FixedWidthTag color="default" width={70} variant="outlined">
      未设置
    </FixedWidthTag>
  );

  const typeInfo = courseTypeOptions.find(t => t.value === text);

  // 使用更加高级的颜色映射
  const colorMapping = {
    'sports': 'teal',
    'art': 'indigo',
    'academic': 'cyan',
    '大课': 'amber',
    '一对一': 'blue',
    '小班': 'green'
  };

  const color = colorMapping[text as keyof typeof colorMapping] || 'default';

  return (
    <FixedWidthTag
      color={color}
      width={70}
      variant="filled"
    >
      {typeInfo?.label || text}
    </FixedWidthTag>
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
    render: (_: any, record: Student) => {
      // 解析剩余课时，获取数值部分
      const remainingClassesStr = record.remainingClasses || '0/0';
      const remainingClasses = parseInt(remainingClassesStr.split('/')[0] || '0', 10);

      // 判断剩余课时是否为0
      const isDisabled = remainingClasses <= 0;

      return (
        <Button
          type="link"
          onClick={() => onAttendance(record)}
          style={{
            padding: '4px 8px',
            // 禁用状态下的样式
            color: isDisabled ? '#d9d9d9' : undefined,
            cursor: isDisabled ? 'not-allowed' : 'pointer',
          }}
          disabled={isDisabled}
          title={isDisabled ? '剩余课时为0，无法打卡' : '打卡'}
        >
          打卡
        </Button>
      );
    },
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
    align: 'left', // 修改为左对齐
    onHeaderCell: () => ({
      style: { ...columnStyle, whiteSpace: 'nowrap' }, // 表头仍然居中
    }),
    onCell: () => ({
      style: { textAlign: 'left', paddingLeft: '16px' }, // 单元格内容左对齐
    }),
    render: (text, record) => (
      <span>
        {record.gender === 'MALE' ? (
          <span key="gender-icon" style={{ color: '#1890ff', marginRight: 5 }}>♂</span>
        ) : (
          <span key="gender-icon" style={{ color: '#eb2f96', marginRight: 5 }}>♀</span>
        )}
        <span key="name-text">{text}</span>
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
      // 确保 remainingClasses 是字符串类型
      const classesA = typeof a.remainingClasses === 'string' ? a.remainingClasses : String(a.remainingClasses || '0');
      const classesB = typeof b.remainingClasses === 'string' ? b.remainingClasses : String(b.remainingClasses || '0');

      // 安全地提取数字部分
      const remainingA = parseInt((classesA.split('/')[0] || '0').trim(), 10) || 0;
      const remainingB = parseInt((classesB.split('/')[0] || '0').trim(), 10) || 0;

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
    render: text => text ? dayjs(text).format('YYYY-MM-DD') : '-',
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
      let variant: 'filled' | 'outlined' = 'filled';

      // 使用更加稳重的颜色映射
      switch (status) {
        case 'active':
        case 'normal':
        case 'NORMAL':
          color = 'green';
          text = '在学';
          variant = 'filled';
          break;
        case 'STUDYING':
          color = 'green';
          text = '在学';
          variant = 'filled';
          break;
        case 'inactive':
        case 'SUSPENDED':
          color = 'red';
          text = '停课';
          variant = 'outlined';
          break;
        case 'pending':
          color = 'orange';
          text = '待处理';
          variant = 'outlined';
          break;
        case 'graduated':
        case 'GRADUATED':
          color = 'blue';
          text = '结业';
          variant = 'filled';
          break;
        case 'expired':
          color = 'gray';
          text = '过期';
          variant = 'outlined';
          break;
        default:
          color = 'default';
          text = status;
          variant = 'outlined';
      }

      // 使用更加稳重的样式
      return (
        <FixedWidthTag
          color={color}
          width={70}
          variant={variant}
        >
          {text}
        </FixedWidthTag>
      );
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