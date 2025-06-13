import React from 'react';
import OptionListComponent from './OptionListComponent';
import { IOptionItem } from '../types';

interface ExpenseTypeOptionsProps {
  options: IOptionItem[];
  loading: boolean;
  onAdd: (option: IOptionItem) => void;
  onUpdate: (id: string, option: IOptionItem) => void;
  onDelete: (id: string, name: string) => void;
  closeAddForm: boolean;
  closeEditForm: boolean;
}

const ExpenseTypeOptions: React.FC<ExpenseTypeOptionsProps> = ({
  options,
  loading,
  onAdd,
  onUpdate,
  onDelete,
  closeAddForm,
  closeEditForm,
}) => {
  return (
    <OptionListComponent
      type="expenseType"
      options={options}
      title="支出类型"
      onAdd={onAdd}
      onUpdate={onUpdate}
      onDelete={onDelete}
      loading={loading}
      closeForm={closeAddForm || closeEditForm}
      formFields={[
        { name: 'name', label: '类型名称', required: true, message: '请输入支出类型名称' },
        { name: 'value', label: '枚举值', required: true, message: '请输入枚举值' },
        { name: 'description', label: '描述', required: false, message: '' }
      ]}
    />
  );
};

export default ExpenseTypeOptions; 