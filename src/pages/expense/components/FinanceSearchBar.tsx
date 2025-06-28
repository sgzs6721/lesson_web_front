import { Button, Input, Select, DatePicker, Row, Col, Space, Tag } from 'antd';
import { SearchOutlined, ReloadOutlined, DownloadOutlined } from '@ant-design/icons';
import { ExpenseSearchParams } from '../types/expense';
import { TRANSACTION_TYPE_LABEL } from '../constants/expenseTypes';
import { useExpenseCategories } from '../hooks/useExpenseCategories';
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
  onTypeChange: (value: 'EXPEND' | 'INCOME' | null | undefined) => void;
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
  // 获取类别选项
  const { categories, loading: categoriesLoading } = useExpenseCategories(params.type);

  return (
    <div className="table-toolbar" style={{ marginBottom: '16px', width: '100%' }}>
      <Row gutter={[12, 12]} align="middle" style={{ width: '100%' }}>
        {/* 搜索框 - 在小屏幕占满宽度 */}
        <Col xs={24} sm={12} md={8} lg={6} xl={5}>
          <Input
            placeholder="项目关键字搜索"
            value={params.text || ''}
            onChange={(e) => onTextChange(e.target.value)}
            allowClear
            style={{ width: '100%' }}
          />
        </Col>
        
        {/* 交易类型选择 */}
        <Col xs={12} sm={6} md={5} lg={4} xl={4}>
          <Select
            placeholder="选择交易类型"
            value={params.type || undefined}
            onChange={onTypeChange}
            allowClear
            style={{ width: '100%' }}
            getPopupContainer={triggerNode => triggerNode.parentNode as HTMLElement}
          >
            <Option value="INCOME">{TRANSACTION_TYPE_LABEL.INCOME}</Option>
            <Option value="EXPEND">{TRANSACTION_TYPE_LABEL.EXPEND}</Option>
          </Select>
        </Col>

        {/* 类别选择 */}
        <Col xs={12} sm={6} md={5} lg={4} xl={4}>
          <Select
            placeholder="选择类别"
            mode="multiple"
            value={params.searchCategories}
            onChange={onCategoriesChange}
            allowClear
            maxTagCount={1}
            loading={categoriesLoading}
            style={{ width: '100%' }}
            getPopupContainer={triggerNode => triggerNode.parentNode as HTMLElement}
            optionLabelProp="label"
          >
            {categories.map(category => {
              // 强制显示类型标签
              const shouldShowTypeTag = category.type;
              return (
                <Option 
                  key={category.value} 
                  value={category.value}
                  label={category.label}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    width: '100%',
                    padding: '4px 0'
                  }}>
                    <span style={{ flex: 1 }}>{category.label}</span>
                    {shouldShowTypeTag && (
                      <Tag 
                        color={category.type === 'EXPEND' ? 'red' : 'green'}
                        style={{ 
                          margin: 0,
                          fontSize: '12px',
                          lineHeight: '20px',
                          padding: '0 6px',
                          borderRadius: '10px'
                        }}
                      >
                        {category.type === 'EXPEND' ? '支出' : '收入'}
                      </Tag>
                    )}
                  </div>
                </Option>
              );
            })}
          </Select>
        </Col>

        {/* 日期范围选择 - 在小屏幕占满宽度 */}
        <Col xs={24} sm={12} md={6} lg={6} xl={6}>
          <RangePicker
            locale={locale}
            value={params.dateRange}
            onChange={onDateRangeChange}
            style={{ width: '100%' }}
            placeholder={['开始日期', '结束日期']}
            size="middle"
          />
        </Col>

        {/* 操作按钮 - 确保在一行显示 */}
        <Col xs={24} sm={12} md={6} lg={4} xl={5}>
          <div className="search-actions">
            <Space size="small" style={{ display: 'flex', flexWrap: 'nowrap' }}>
              <Button type="primary" icon={<SearchOutlined />} onClick={onSearch} size="middle">
                搜索
              </Button>
              <Button icon={<ReloadOutlined />} onClick={onReset} size="middle">
                重置
              </Button>
              <Button icon={<DownloadOutlined />} onClick={onExport} size="middle">
                导出
              </Button>
            </Space>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default FinanceSearchBar;