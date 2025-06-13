import React, { useEffect } from 'react';
import { Modal, Form, DatePicker, Input, Select, Button, Radio, Divider, InputNumber } from 'antd';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { FormInstance } from 'antd/lib/form';
import { EXPENSE_CATEGORY, INCOME_CATEGORY, TRANSACTION_TYPE_LABEL } from '../constants/expenseTypes';

const { Option } = Select;

interface FinanceEditModalProps {
  visible: boolean;
  loading: boolean;
  form: FormInstance;
  editingId: string | null;
  type: 'income' | 'expense';
  onCancel: () => void;
  onSubmit: () => void;
  onTypeChange: (type: 'income' | 'expense') => void;
}

const FinanceEditModal: React.FC<FinanceEditModalProps> = ({
  visible,
  loading,
  form,
  editingId,
  type,
  onCancel,
  onSubmit,
  onTypeChange
}) => {
  // 监听类型变化，重置类别选择
  useEffect(() => {
    if (visible && !editingId) {
      form.setFieldValue('category', undefined);
    }
  }, [form, type, visible, editingId]);

  // 根据交易类型获取对应的类别选项
  const getCategoryOptions = () => {
    if (type === 'expense') {
      return Object.values(EXPENSE_CATEGORY).map(category => (
        <Option key={category} value={category}>{category}</Option>
      ));
    } else {
      return Object.values(INCOME_CATEGORY).map(category => (
        <Option key={category} value={category}>{category}</Option>
      ));
    }
  };

  const handleTypeChange = (e: any) => {
    onTypeChange(e.target.value);
  };

  return (
    <Modal
      title={editingId ? "编辑记录" : "添加收支记录"}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={onSubmit}>
          保存
        </Button>,
      ]}
      maskClosable={false}
    >
      <Divider style={{ margin: '0 0 24px 0' }} />
      <Form
        form={form}
        layout="vertical"
      >
        {!editingId && (
          <Form.Item label="交易类型">
            <Radio.Group value={type} onChange={handleTypeChange}>
              <Radio.Button value="expense">{TRANSACTION_TYPE_LABEL.expense}</Radio.Button>
              <Radio.Button value="income">{TRANSACTION_TYPE_LABEL.income}</Radio.Button>
            </Radio.Group>
          </Form.Item>
        )}

        <Form.Item
          label="日期"
          name="date"
          rules={[{ required: true, message: '请选择日期' }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            placeholder="选择日期"
            locale={locale}
            format="YYYY-MM-DD"
          />
        </Form.Item>

        <Form.Item
          label={type === 'expense' ? '支出项目' : '收入项目'}
          name="item"
          rules={[{ required: true, message: `请输入${type === 'expense' ? '支出' : '收入'}项目` }]}
        >
          <Input placeholder={`请输入${type === 'expense' ? '支出' : '收入'}项目`} />
        </Form.Item>

        <Form.Item
          label="金额"
          name="amount"
          rules={[
            { required: true, message: '请输入金额' },
            { type: 'number', min: 0, message: '金额必须大于等于0' }
          ]}
        >
          <InputNumber style={{ width: '100%' }} prefix="¥" placeholder="请输入金额" />
        </Form.Item>

        <Form.Item
          label="类别"
          name="category"
          rules={[{ required: true, message: '请选择类别' }]}
        >
          <Select
            placeholder="请选择类别"
            showSearch={false}
            virtual={false}
            dropdownMatchSelectWidth={true}
            getPopupContainer={triggerNode => triggerNode.parentNode as HTMLElement}
          >
            {getCategoryOptions()}
          </Select>
        </Form.Item>

        <Form.Item
          label="备注"
          name="remark"
        >
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FinanceEditModal;