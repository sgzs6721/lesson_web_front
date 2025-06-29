import { ColumnsType } from 'antd/es/table';
import { Tag, Button, Tooltip, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Expense } from '../types/expense';
import { TRANSACTION_TYPE_LABEL } from './expenseTypes';

export const getTableColumns = (
  handleEdit: (record: Expense) => void,
  showDeleteConfirm: (id: string) => void
): ColumnsType<Expense> => [
  {
    title: '日期',
    dataIndex: 'date',
    key: 'date',
    align: 'center',
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    align: 'center',
    render: (type) => {
      const color = type === 'INCOME' ? 'green' : 'red';
      return <Tag color={color}>{TRANSACTION_TYPE_LABEL[type]}</Tag>;
    },
  },
  {
    title: '项目',
    dataIndex: 'item',
    key: 'item',
    align: 'center',
  },
  {
    title: '金额 (¥)',
    dataIndex: 'amount',
    key: 'amount',
    render: (amount, record) => {
      const style = { color: record.type === 'INCOME' ? '#3f8600' : '#cf1322' };
      return <span style={style}>{`¥${amount.toLocaleString('zh-CN')}`}</span>;
    },
    align: 'center',
  },
  {
    title: '收支类型',
    dataIndex: 'category',
    key: 'category',
    align: 'center',
    render: (category, record) => {
      let color = 'default';
      // 根据收支类型和具体类别设置颜色
      if (record.type === 'EXPEND') {
        switch (category) {
          case '工资支出': color = 'blue'; break;
          case '固定成本': color = 'orange'; break;
          case '其他支出': color = 'red'; break;
        }
      } else {
        switch (category) {
          case '学费收入': color = 'green'; break;
          case '培训收入': color = 'cyan'; break;
          case '零售收入': color = 'purple'; break;
          case '其他收入': color = 'magenta'; break;
        }
      }
      return <Tag color={color}>{category}</Tag>;
    },
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    align: 'center',
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    render: (_, record) => (
      <Space size="middle">
        <Tooltip title="编辑">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
        </Tooltip>
        <Tooltip title="删除">
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record.id)}
          />
        </Tooltip>
      </Space>
    ),
  },
];