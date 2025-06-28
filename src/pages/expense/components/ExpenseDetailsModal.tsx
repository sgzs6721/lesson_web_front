import React from 'react';
import { Modal, Descriptions, Tag, Typography, Divider } from 'antd';
import { Expense } from '../types/expense';
import { formatCurrency } from '../utils/formatters';
import { TRANSACTION_TYPE_LABEL } from '../constants/expenseTypes';

const { Text } = Typography;

interface FinanceDetailsModalProps {
  visible: boolean;
  record: Expense | null;
  onCancel: () => void;
}

const FinanceDetailsModal: React.FC<FinanceDetailsModalProps> = ({
  visible,
  record,
  onCancel
}) => {
  if (!record) {
    return null;
  }

  // 根据交易类型设置颜色
  const getTypeTag = () => {
    const color = record.type === 'INCOME' ? 'green' : 'red';
    return <Tag color={color}>{TRANSACTION_TYPE_LABEL[record.type]}</Tag>;
  };

  // 根据类别设置颜色
  const getCategoryTag = () => {
    let color = 'default';

    if (record.type === 'EXPEND') {
      switch (record.category) {
        case '工资支出': color = 'blue'; break;
        case '固定成本': color = 'orange'; break;
        case '其他支出': color = 'red'; break;
      }
    } else {
      switch (record.category) {
        case '学费收入': color = 'green'; break;
        case '培训收入': color = 'cyan'; break;
        case '零售收入': color = 'purple'; break;
        case '其他收入': color = 'magenta'; break;
      }
    }

    return <Tag color={color}>{record.category}</Tag>;
  };

  return (
    <Modal
      title="交易记录详情"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Divider style={{ margin: '0 0 24px 0' }} />
      <Descriptions bordered column={1}>
        <Descriptions.Item label="交易类型">
          {getTypeTag()}
        </Descriptions.Item>

        <Descriptions.Item label="日期">
          {record.date}
        </Descriptions.Item>

        <Descriptions.Item label="项目">
          {record.item}
        </Descriptions.Item>

        <Descriptions.Item label="金额">
          <Text
            style={{
              color: record.type === 'INCOME' ? '#3f8600' : '#cf1322',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            {formatCurrency(record.amount)}
          </Text>
        </Descriptions.Item>

        <Descriptions.Item label="类别">
          {getCategoryTag()}
        </Descriptions.Item>

        <Descriptions.Item label="备注">
          {record.remark || '无'}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default FinanceDetailsModal;