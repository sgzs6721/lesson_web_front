import React from 'react';
import { Tabs, Divider } from 'antd';
import { BookOutlined, DollarOutlined, SettingOutlined } from '@ant-design/icons';
import { IOptionItem } from '../types';
import OptionListComponent from './OptionListComponent';
import './OptionsTab.css';

interface OptionsTabProps {
  courseTypeOptions: IOptionItem[];
  paymentMethodOptions: IOptionItem[];
  giftOptions: IOptionItem[];
  feeOptions: IOptionItem[];
  expireTypeOptions: IOptionItem[];
  expenseTypeOptions: IOptionItem[];
  incomeTypeOptions: IOptionItem[];
  loading: Record<string, boolean>;
  onAddOption: (type: string, option: IOptionItem) => Promise<void>;
  onUpdateOption: (id: string, option: IOptionItem) => Promise<void>;
  showDeleteConfirm: (type: string, id: string, name: string) => void;
  closeAddForm: Record<string, boolean>;
  closeEditForm: Record<string, boolean>;
}

const OptionsTab: React.FC<OptionsTabProps> = ({
  courseTypeOptions,
  paymentMethodOptions,
  giftOptions,
  feeOptions,
  expireTypeOptions,
  expenseTypeOptions,
  incomeTypeOptions,
  loading,
  onAddOption,
  onUpdateOption,
  showDeleteConfirm,
  closeAddForm,
  closeEditForm,
}) => {
  const handleAddOption = async (type: string, option: IOptionItem) => {
    await onAddOption(type, option);
  };

  const handleDeleteOption = (type: string, id: string, name: string) => {
    showDeleteConfirm(type, id, name);
  };

  const handleUpdateOption = async (id: string, option: IOptionItem) => {
    await onUpdateOption(id, option);
  };

  const tabItems = [
    {
      key: 'course',
      label: (
        <span className="tab-item">
          <BookOutlined />
          课程相关
        </span>
      ),
      children: (
        <div className="option-section">
          <OptionListComponent
            type="courseType"
            options={courseTypeOptions}
            title="课程类型"
            onAdd={async (option) => await handleAddOption('courseType', option)}
            onDelete={(id, name) => handleDeleteOption('courseType', id, name)}
            onUpdate={async (id, option) => await handleUpdateOption(id, option)}
            loading={loading['COURSE_TYPE']}
            closeForm={closeAddForm['COURSE_TYPE'] || closeEditForm['COURSE_TYPE']}
            formFields={[
              { name: 'name', label: '类型名称', required: true, message: '请输入课程类型名称' },
              { name: 'value', label: '枚举值', required: true, message: '请输入枚举值' },
              { name: 'description', label: '描述', required: false, message: '' }
            ]}
          />
          <Divider />
          <OptionListComponent
            type="expireType"
            options={expireTypeOptions}
            title="有效期时长（月）"
            onAdd={async (option) => await handleAddOption('expireType', option)}
            onDelete={(id, name) => handleDeleteOption('expireType', id, name)}
            onUpdate={async (id, option) => await handleUpdateOption(id, option)}
            loading={loading['VALIDITY_PERIOD']}
            closeForm={closeAddForm['VALIDITY_PERIOD'] || closeEditForm['VALIDITY_PERIOD']}
            formFields={[
              { name: 'name', label: '时长名称', required: true, message: '请输入时长名称' },
              { name: 'value', label: '枚举值 (月数)', required: true, message: '请输入月数' },
              { name: 'description', label: '描述', required: false, message: '' }
            ]}
          />
        </div>
      )
    },
    {
      key: 'payment',
      label: (
        <span className="tab-item">
          <DollarOutlined />
          支付相关
        </span>
      ),
      children: (
        <>
          <div className="option-section">
            <OptionListComponent
              type="paymentType"
              options={paymentMethodOptions}
              title="支付方式"
              onAdd={async (option) => await handleAddOption('paymentType', option)}
              onDelete={(id, name) => handleDeleteOption('paymentType', id, name)}
              onUpdate={async (id, option) => await handleUpdateOption(id, option)}
              loading={loading['PAYMENT_TYPE']}
              closeForm={closeAddForm['PAYMENT_TYPE'] || closeEditForm['PAYMENT_TYPE']}
              formFields={[
                { name: 'name', label: '方式名称', required: true, message: '请输入支付方式名称' },
                { name: 'value', label: '枚举值', required: true, message: '请输入枚举值' },
                { name: 'description', label: '描述', required: false, message: '' }
              ]}
            />
          </div>
          <Divider />
          <div className="option-section">
            <OptionListComponent
              type="gift"
              options={giftOptions}
              title="赠品列表"
              onAdd={async (option) => await handleAddOption('gift', option)}
              onDelete={(id, name) => handleDeleteOption('gift', id, name)}
              onUpdate={async (id, option) => await handleUpdateOption(id, option)}
              loading={loading['GIFT_ITEM']}
              closeForm={closeAddForm['GIFT_ITEM'] || closeEditForm['GIFT_ITEM']}
              formFields={[
                { name: 'name', label: '赠品名称', required: true, message: '请输入赠品名称' },
                { name: 'value', label: '枚举值', required: true, message: '请输入枚举值' },
                { name: 'description', label: '描述', required: false, message: '' }
              ]}
            />
          </div>
          <Divider />
          <div className="option-section">
            <OptionListComponent
              type="fee"
              options={feeOptions}
              title="手续费选项"
              onAdd={async (option) => await handleAddOption('fee', option)}
              onDelete={(id, name) => handleDeleteOption('fee', id, name)}
              onUpdate={async (id, option) => await handleUpdateOption(id, option)}
              loading={loading['HANDLING_FEE_TYPE']}
              closeForm={closeAddForm['HANDLING_FEE_TYPE'] || closeEditForm['HANDLING_FEE_TYPE']}
              formFields={[
                { name: 'name', label: '选项名称', required: true, message: '请输入选项名称' },
                { name: 'value', label: '枚举值', required: true, message: '请输入枚举值' },
                { name: 'description', label: '描述', required: false, message: '' }
              ]}
            />
          </div>
        </>
      )
    },
    {
      key: 'system',
      label: (
        <span className="tab-item">
          <SettingOutlined />
          系统相关
        </span>
      ),
      children: (
        <>
          <div className="option-section">
            <OptionListComponent
              type="expenseType"
              options={expenseTypeOptions}
              title="支出类型"
              onAdd={async (option) => await handleAddOption('expenseType', option)}
              onDelete={(id, name) => handleDeleteOption('expenseType', id, name)}
              onUpdate={async (id, option) => await handleUpdateOption(id, option)}
              loading={loading['EXPEND']}
              closeForm={closeAddForm['EXPEND'] || closeEditForm['EXPEND']}
              formFields={[
                { name: 'name', label: '类型名称', required: true, message: '请输入支出类型名称' },
                { name: 'value', label: '枚举值', required: true, message: '请输入枚举值' },
                { name: 'description', label: '描述', required: false, message: '' }
              ]}
            />
          </div>
          <Divider />
          <div className="option-section">
            <OptionListComponent
              type="incomeType"
              options={incomeTypeOptions}
              title="收入类型"
              onAdd={async (option) => await handleAddOption('incomeType', option)}
              onDelete={(id, name) => handleDeleteOption('incomeType', id, name)}
              onUpdate={async (id, option) => await handleUpdateOption(id, option)}
              loading={loading['INCOME']}
              closeForm={closeAddForm['INCOME'] || closeEditForm['INCOME']}
              formFields={[
                { name: 'name', label: '类型名称', required: true, message: '请输入收入类型名称' },
                { name: 'value', label: '枚举值', required: true, message: '请输入枚举值' },
                { name: 'description', label: '描述', required: false, message: '' }
              ]}
            />
          </div>
        </>
      )
    }
  ];

  return (
    <div className="options-tab">
      <Tabs 
        defaultActiveKey="course" 
        tabPosition="left"
        className="settings-vertical-tabs"
        items={tabItems}
      />
    </div>
  );
};

export default OptionsTab; 