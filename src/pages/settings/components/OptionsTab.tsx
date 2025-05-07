import React, { useEffect, useState } from 'react';
import { Tabs, Divider, Typography } from 'antd';
import { BookOutlined, DollarOutlined, GiftOutlined, PercentageOutlined } from '@ant-design/icons';
import { IOptionItem } from '../types';
import OptionListComponent from './OptionListComponent';
import './OptionsTab.css';

const { TabPane } = Tabs;
const { Title } = Typography;

interface OptionsTabProps {
  courseTypeOptions: IOptionItem[];
  paymentMethodOptions: IOptionItem[];
  giftOptions: IOptionItem[];
  feeOptions: IOptionItem[];
  onAddOption: (type: string, option: IOptionItem) => void;
  onDeleteOption: (type: string, id: string) => void;
  onUpdateOption: (id: string, option: IOptionItem) => void;
  loading?: Record<string, boolean>;
  closeAddForm?: Record<string, boolean>;
  closeEditForm?: Record<string, boolean>;
}

const OptionsTab: React.FC<OptionsTabProps> = ({
  courseTypeOptions,
  paymentMethodOptions,
  giftOptions,
  feeOptions,
  onAddOption,
  onDeleteOption,
  onUpdateOption,
  loading = {},
  closeAddForm = {},
  closeEditForm = {}
}) => {
  // 直接使用父组件传入的选项数据，不再本地维护状态
  // 这样确保只有当API调用成功时，UI才会更新
  
  // 处理添加选项
  const handleAddOption = (type: string, option: IOptionItem) => {
    // 直接调用父组件方法，让父组件处理API调用和状态更新
    onAddOption(type, option);
  };

  // 处理删除选项
  const handleDeleteOption = (type: string, id: string) => {
    // 直接调用父组件方法，让父组件处理API调用和状态更新
    onDeleteOption(type, id);
  };

  // 处理更新选项
  const handleUpdateOption = (id: string, option: IOptionItem) => {
    // 不再需要传递 type，直接传递 id 和 option 给父组件
    onUpdateOption(id, option);
  };

  return (
    <div className="options-tab">
      <Tabs 
        defaultActiveKey="course" 
        tabPosition="left"
        className="settings-vertical-tabs"
      >
        <TabPane 
          tab={
            <span className="tab-item">
              <BookOutlined />
              课程相关
            </span>
          }
          key="course"
        >
          <div className="option-section">
            <OptionListComponent
              type="courseType"
              options={courseTypeOptions}
              title="课程类型"
              addButtonText="添加"
              onAdd={(option) => handleAddOption('courseType', option)}
              onDelete={(id) => handleDeleteOption('courseType', id)}
              onUpdate={(id, option) => handleUpdateOption(id, option)}
              loading={loading['COURSE_TYPE']}
              closeForm={closeAddForm['COURSE_TYPE'] || closeEditForm['COURSE_TYPE']}
            />
          </div>
        </TabPane>
        
        <TabPane 
          tab={
            <span className="tab-item">
              <DollarOutlined />
              支付相关
            </span>
          }
          key="payment"
        >
          <div className="option-section">
            <OptionListComponent
              type="paymentMethod"
              options={paymentMethodOptions}
              title="支付方式"
              addButtonText="添加"
              onAdd={(option) => handleAddOption('paymentMethod', option)}
              onDelete={(id) => handleDeleteOption('paymentMethod', id)}
              onUpdate={(id, option) => handleUpdateOption(id, option)}
              loading={loading['PAYMENT_TYPE']}
              closeForm={closeAddForm['PAYMENT_TYPE'] || closeEditForm['PAYMENT_TYPE']}
            />
          </div>
          
          <Divider />
          
          <div className="option-section">
            <OptionListComponent
              type="gift"
              options={giftOptions}
              title="赠品列表"
              addButtonText="添加"
              onAdd={(option) => handleAddOption('gift', option)}
              onDelete={(id) => handleDeleteOption('gift', id)}
              onUpdate={(id, option) => handleUpdateOption(id, option)}
              loading={loading['GIFT_ITEM']}
              closeForm={closeAddForm['GIFT_ITEM'] || closeEditForm['GIFT_ITEM']}
            />
          </div>
          
          <Divider />
          
          <div className="option-section">
            <OptionListComponent
              type="fee"
              options={feeOptions}
              title="手续费选项"
              addButtonText="添加"
              onAdd={(option) => handleAddOption('fee', option)}
              onDelete={(id) => handleDeleteOption('fee', id)}
              onUpdate={(id, option) => handleUpdateOption(id, option)}
              loading={loading['HANDLING_FEE_TYPE']}
              closeForm={closeAddForm['HANDLING_FEE_TYPE'] || closeEditForm['HANDLING_FEE_TYPE']}
            />
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default OptionsTab; 