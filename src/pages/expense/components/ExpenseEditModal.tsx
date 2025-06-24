import { Modal, Form, DatePicker, Input, Select, Button, Radio, Divider, InputNumber } from 'antd';
import { useEffect } from 'react';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { FormInstance } from 'antd/lib/form';
import { TRANSACTION_TYPE_LABEL } from '../constants/expenseTypes';
import { useExpenseCategories } from '../hooks/useExpenseCategories';

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
  // 只在模态框可见时获取类别选项，避免不必要的API调用
  const { categories, loading: categoriesLoading } = useExpenseCategories(visible ? type : undefined);

  // 监听类型变化，重置类别选择
  useEffect(() => {
    if (visible && !editingId) {
      form.setFieldValue('category', undefined);
    }
  }, [form, type, visible, editingId]);

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
            loading={categoriesLoading}
            showSearch={false}
            virtual={false}
            dropdownMatchSelectWidth={true}
            getPopupContainer={triggerNode => triggerNode.parentNode as HTMLElement}
          >
            {categories.map(category => (
              <Option key={category.value} value={category.value}>
                {category.label}
              </Option>
            ))}
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