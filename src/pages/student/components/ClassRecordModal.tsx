import React from 'react';
import { Modal, Table, Typography, Tag, Divider, Button } from 'antd';
import { Student, ClassRecord } from '../types/student';
import { FileTextOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

interface ClassRecordModalProps {
  visible: boolean;
  student: Student | null;
  records: ClassRecord[];
  onCancel: () => void;
}

const ClassRecordModal: React.FC<ClassRecordModalProps> = ({
  visible,
  student,
  records,
  onCancel
}) => {
  // 表格列定义 (参照 StudentManagement.tsx)
  const columns: ColumnsType<ClassRecord> = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      align: 'center',
    },
    {
      title: '时间',
      key: 'time',
      width: 120,
      align: 'center',
      render: (_: unknown, record: ClassRecord) => `${record.startTime} - ${record.endTime}`
    },
    {
      title: '教练',
      dataIndex: 'coach',
      key: 'coach',
      width: 100,
      align: 'center',
    },
    {
      title: '课程',
      dataIndex: 'content',
      key: 'content',
      width: 200,
    },
    {
      title: '备注',
      dataIndex: 'feedback',
      key: 'feedback',
    },
  ];

  return (
    <Modal
      title={
        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
          <FileTextOutlined style={{ marginRight: 8 }} /> 
          {student?.name} 的课程记录
        </span>
      }
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button key="close" onClick={onCancel}>
          关闭
        </Button>
      ]}
    >
      <Divider style={{ margin: '0 0 24px 0' }} />

      <Table
        dataSource={records}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </Modal>
  );
};

export default ClassRecordModal; 