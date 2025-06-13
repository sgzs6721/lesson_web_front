import React from 'react';
import { Input, Select, DatePicker, Button, Space, Row, Col } from 'antd';
import { SearchOutlined, ReloadOutlined, DownloadOutlined } from '@ant-design/icons';
import { ExpenseSearchParams } from '../types/expense';
import { EXPENSE_CATEGORY, INCOME_CATEGORY, TRANSACTION_TYPE_LABEL } from '../constants/expenseTypes';
import locale from 'antd/es/date-picker/locale/zh_CN';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface FinanceSearchBarProps {
  params: ExpenseSearchParams;
  onSearch: () => void;
  onReset: () => void;
  onExport: () => void;
  onTextChange: (value: string) => void;
  onCategoriesChange: (value: string[]) => void;
  onTypeChange: (value: 'income' | 'expense' | null) => void;
  onDateRangeChange: (dates: any) => void;
}

const FinanceSearchBar: React.FC<FinanceSearchBarProps> = ({
  params,
  onSearch,
  onReset,
  onExport,
  onTextChange,
  onCategoriesChange,
  onTypeChange,
  onDateRangeChange
}) => {
  // 根据交易类型获取对应的类别选项
  const getCategoryOptions = () => {
    const options: React.ReactNode[] = [];

    // 支出类别
    Object.values(EXPENSE_CATEGORY).forEach(category => {
      options.push(<Option key={category} value={category}>{category}</Option>);
    });

    // 收入类别
    Object.values(INCOME_CATEGORY).forEach(category => {
      options.push(<Option key={category} value={category}>{category}</Option>);
    });

    return options;
  };

  return (
    <div className="table-toolbar" style={{ marginBottom: '16px', width: '100%' }}>
      <Row gutter={[12, 8]} align="middle" style={{ width: '100%' }}>
        <Col span={5}>
          <Input
            placeholder="项目关键字搜索"
            value={params.text || ''}
            onChange={(e) => onTextChange(e.target.value)}
            allowClear
            style={{ width: '100%' }}
          />
        </Col>
        <Col span={4}>
          <Select
            placeholder="选择交易类型"
            value={params.type || undefined}
            onChange={onTypeChange}
            allowClear
            style={{ width: '100%' }}
            getPopupContainer={triggerNode => triggerNode.parentNode as HTMLElement}
          >
            <Option value="income">{TRANSACTION_TYPE_LABEL.income}</Option>
            <Option value="expense">{TRANSACTION_TYPE_LABEL.expense}</Option>
          </Select>
        </Col>
        <Col span={4}>
          <Select
            placeholder="选择类别"
            mode="multiple"
            value={params.searchCategories}
            onChange={onCategoriesChange}
            allowClear
            maxTagCount={2}
            style={{ width: '100%' }}
            getPopupContainer={triggerNode => triggerNode.parentNode as HTMLElement}
          >
            {getCategoryOptions()}
          </Select>
        </Col>
        <Col flex="auto" style={{ minWidth: '240px' }}>
          <RangePicker
            locale={locale}
            value={params.dateRange}
            onChange={onDateRangeChange}
            style={{ width: '100%', textAlign: 'center' }}
            placeholder={['开始日期', '结束日期']}
          />
        </Col>
        <Col flex="none" style={{ minWidth: '280px' }}>
          <Space size="middle" style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button type="primary" icon={<SearchOutlined />} onClick={onSearch}>
              搜索
            </Button>
            <Button icon={<ReloadOutlined />} onClick={onReset}>
              重置
            </Button>
            <Button icon={<DownloadOutlined />} onClick={onExport}>
              导出
            </Button>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default FinanceSearchBar;