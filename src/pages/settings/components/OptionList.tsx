import React, { useState } from 'react';
import { List, Input, Button, Space } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { IOptionItem, IOptionListProps } from '../types';

const OptionList: React.FC<IOptionListProps> = ({
  options,
  title,
  addButtonText,
  onAdd,
  onDelete,
  onUpdate
}) => {
  const [newOptionName, setNewOptionName] = useState('');
  const [newOptionValue, setNewOptionValue] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editValue, setEditValue] = useState('');

  const handleAdd = () => {
    if (!newOptionName.trim() || !newOptionValue.trim()) {
      return;
    }
    
    const newOption: IOptionItem = {
      id: '', // 会在父组件中通过uuid生成
      name: newOptionName,
      value: newOptionValue
    };
    
    onAdd(newOption);
    setNewOptionName('');
    setNewOptionValue('');
  };

  const startEditing = (option: IOptionItem) => {
    setEditingId(option.id);
    setEditName(option.name);
    setEditValue(option.value);
  };

  const saveEdit = () => {
    if (!editingId || !editName.trim() || !editValue.trim()) {
      return;
    }
    
    onUpdate(editingId, { id: editingId, name: editName, value: editValue });
    setEditingId(null);
  };

  return (
    <div className="option-list-container">
      <h4>{title}</h4>
      <List
        className="option-list"
        bordered
        dataSource={options}
        renderItem={(item) => (
          <List.Item
            className="option-item"
            actions={
              editingId === item.id
                ? [
                    <Button 
                      icon={<SaveOutlined />} 
                      size="small" 
                      type="primary"
                      onClick={saveEdit}
                    >
                      保存
                    </Button>,
                    <Button 
                      size="small" 
                      onClick={() => setEditingId(null)}
                    >
                      取消
                    </Button>
                  ]
                : [
                    <Button 
                      icon={<EditOutlined />} 
                      size="small" 
                      onClick={() => startEditing(item)}
                    >
                      编辑
                    </Button>,
                    <Button 
                      danger 
                      icon={<DeleteOutlined />} 
                      size="small"
                      onClick={() => onDelete(item.id)}
                    >
                      删除
                    </Button>
                  ]
            }
          >
            {editingId === item.id ? (
              <Space style={{ width: '100%' }}>
                <Input
                  placeholder="名称"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{ width: '45%' }}
                />
                <Input
                  placeholder="值"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  style={{ width: '45%' }}
                />
              </Space>
            ) : (
              <Space>
                <span><strong>名称:</strong> {item.name}</span>
                <span><strong>值:</strong> {item.value}</span>
              </Space>
            )}
          </List.Item>
        )}
        footer={
          <div style={{ display: 'flex', gap: '10px' }}>
            <Input
              placeholder="选项名称"
              value={newOptionName}
              onChange={(e) => setNewOptionName(e.target.value)}
              style={{ width: '40%' }}
            />
            <Input
              placeholder="选项值"
              value={newOptionValue}
              onChange={(e) => setNewOptionValue(e.target.value)}
              style={{ width: '40%' }}
            />
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              {addButtonText}
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default OptionList; 