import React, { useState, useEffect } from 'react';
import { Button, Input, Typography, Form, message, Spin, Row, Col, Space, Card, Empty, Switch, Modal, InputNumber } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, CheckOutlined, CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { IOptionListProps, IOptionItem } from '../types';
import './cards.css';

const { Title, Text } = Typography;
const { TextArea } = Input;

// 类型颜色映射，每种类型使用一种固定颜色
const typeColorMap: Record<string, string> = {
  'courseType': '#4F46E5',     // 课程类型 - 深蓝色
  'VALIDITY_PERIOD': '#10B981', // 有效期 - 绿色
  'paymentMethod': '#6366F1',  // 支付方式 - 靛蓝色
  'fee': '#F97316',            // 手续费 - 橙色
  'gift': '#A855F7',           // 赠品 - 紫色
};

// 获取指示器颜色函数，按类型固定颜色
const getIndicatorColor = (type: string): string => {
  // 根据类型返回固定颜色
  return typeColorMap[type] || '#1677FF'; // 默认蓝色
};

// 定义局部加载蒙板的样式
const localSpinStyle = `
  .local-spin .ant-spin-container {
    position: relative;
  }
  .local-spin .ant-spin {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    border-radius: 8px;
  }
`;

const OptionListComponent: React.FC<IOptionListProps> = ({
  type,
  options = [],
  title,
  addButtonText,
  onAdd,
  onDelete,
  onUpdate,
  loading = false,
  closeForm = false
}) => {

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editLoadingId, setEditLoadingId] = useState<string | null>(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);
  const [addLoading, setAddLoading] = useState(false);
  const [newOption, setNewOption] = useState<{name: string, value: string, enabled: boolean, description: string}>({
    name: '',
    value: '',
    enabled: true,
    description: ''
  });

  // 确保 options 总是一个数组
  const safeOptions = Array.isArray(options) ? options : [];

  // 监听 loading 和 closeForm 属性的变化
  useEffect(() => {
    // 当 loading 从 true 变为 false 时，检查是否需要关闭表单
    if (loading === false) {
      // 清除删除loading状态
      setDeleteLoadingId(null);
      
      // 只有当表单正在添加时并且API调用成功时才关闭添加表单
      if (addLoading) {
        setAddLoading(false);
        // 只有当closeForm为true时才关闭表单
        if (closeForm) {
          setIsAddingNew(false);
          setNewOption({name: '', value: '', enabled: true, description: ''});
        }
      }
      
      // 只有当表单正在编辑时并且API调用成功时才关闭编辑表单
      if (editLoadingId) {
        setEditLoadingId(null);
        // 只有当closeForm为true时才关闭表单
        if (closeForm) {
          setIsInlineEditing(false);
          setEditingItemId(null);
        }
      }
    }
  }, [loading, addLoading, editLoadingId, closeForm]);

  // 开始添加新选项
  const startAddingNew = () => {
    setIsAddingNew(true);
    setNewOption({name: '', value: '', enabled: true, description: ''});
  };

  // 保存新添加的选项
  const saveNewOption = () => {
    if (!newOption.name.trim() || !newOption.value.trim()) {
      message.error('显示文本和枚举值不能为空');
      return;
    }

    // 为有效期时长类型添加验证
    if (type === 'VALIDITY_PERIOD') {
      const nameValue = Number(newOption.name);
      if (isNaN(nameValue) || !Number.isInteger(nameValue) || nameValue < 1) {
        message.error('有效期时长的显示文本必须是大于等于1的整数');
        return;
      }
    }

    setAddLoading(true);
    try {
    onAdd({
      id: '',
      name: newOption.name,
      value: newOption.value,
      enabled: newOption.enabled,
      description: newOption.description,
      status: newOption.enabled ? 1 : 0
    });
      // 不在这里关闭表单，而是等待父组件通过props告知是否关闭
    } catch (error) {
      // 发生错误时关闭加载状态，但保留表单
      setAddLoading(false);
    }
  };

  // 取消添加新选项
  const cancelAddingNew = () => {
    setIsAddingNew(false);
    setNewOption({name: '', value: '', enabled: true, description: ''});
  };

  // 开始内联编辑选项
  const startInlineEditing = (item: IOptionItem) => {
    setIsInlineEditing(true);
    setEditingItemId(item.id);
    setNewOption({
      name: item.name,
      value: item.value,
      enabled: item.enabled === undefined ? true : !!item.enabled,
      description: item.description || ''
    });
  };

  // 保存内联编辑的选项
  const saveInlineEdit = (id: string) => {
    if (!newOption.name.trim() || !newOption.value.trim()) {
      message.error('显示文本和枚举值不能为空');
      return;
    }

    // 为有效期时长类型添加验证
    if (type === 'VALIDITY_PERIOD') {
      const nameValue = Number(newOption.name);
      if (isNaN(nameValue) || !Number.isInteger(nameValue) || nameValue < 1) {
        message.error('有效期时长的显示文本必须是大于等于1的整数');
        return;
      }
    }

    setEditLoadingId(id);
    try {
    onUpdate(id, {
      id,
      name: newOption.name,
      value: newOption.value,
      enabled: newOption.enabled,
      description: newOption.description,
      status: newOption.enabled ? 1 : 0
    });
      // 不在这里关闭表单，而是等待父组件通过props告知是否关闭
    } catch (error) {
      // 发生错误时关闭加载状态，但保留表单
      setEditLoadingId(null);
    }
  };

  // 取消内联编辑
  const cancelInlineEdit = () => {
    setIsInlineEditing(false);
    setEditingItemId(null);
  };

  // 处理删除选项
  const handleDeleteOption = (id: string, name: string) => {
    setDeleteLoadingId(id);
    onDelete(id, name);
  };

  return (
    <div className="option-list-container" style={{ width: '100%' }}>
      {/* 添加内联样式标签 */}
      <style>{localSpinStyle}</style>
      <div>
      <div className="option-header" style={{ 
        marginBottom: '16px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        width: '100%',
        position: 'static',
        padding: '0 0 12px 0',
        borderBottom: '1px solid #f0f0f0'
      }}>
        {title && <Title level={5} style={{ margin: 0 }}>{title}</Title>}
        <div style={{ position: 'static' }}>
          <Button
            type="primary"
            className="add-button"
            icon={<PlusOutlined />}
            onClick={startAddingNew}
            disabled={loading || isAddingNew || addLoading}
            loading={addLoading}
          >
            {addButtonText}
          </Button>
        </div>
      </div>

        {/* 编辑表单优先显示在最上方 */}
        {isInlineEditing && editingItemId && safeOptions.find(item => item.id === editingItemId) && (
          <div className="adding-card" style={{ width: '100%', marginBottom: '24px', background: '#f8faff', border: '1px dashed #1677FF', borderRadius: '8px', padding: '16px', position: 'relative' }}>
            <Spin spinning={editLoadingId === editingItemId} tip="保存中..." wrapperClassName="local-spin">
              <Form layout="horizontal">
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', flex: '0 0 auto', marginRight: '16px' }}>
                    <span style={{ marginRight: '8px', whiteSpace: 'nowrap' }}>显示文本:</span>
                    {type === 'VALIDITY_PERIOD' ? (
                      <InputNumber
                        placeholder="请输入大于等于1的整数"
                        min={1}
                        precision={0}
                        value={newOption.name === '' ? undefined : Number(newOption.name)}
                        onChange={(value) => setNewOption({...newOption, name: value ? value.toString() : ''})}
                        style={{ width: '180px' }}
                      />
                    ) : (
                      <Input
                        placeholder="请输入显示文本"
                        value={newOption.name}
                        onChange={(e) => setNewOption({...newOption, name: e.target.value})}
                        style={{ width: '180px' }}
                      />
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', flex: '0 0 auto', marginRight: '16px' }}>
                    <span style={{ marginRight: '8px', whiteSpace: 'nowrap' }}>枚举值:</span>
                    <Input
                      placeholder="请输入枚举值"
                      value={newOption.value}
                      onChange={(e) => setNewOption({...newOption, value: e.target.value})}
                      style={{ width: '180px' }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', flex: '1', marginRight: '16px' }}>
                    <span style={{ marginRight: '8px', whiteSpace: 'nowrap' }}>描述:</span>
                    <Input
                      placeholder="请输入描述信息（选填）"
                      value={newOption.description}
                      onChange={(e) => setNewOption({...newOption, description: e.target.value})}
                      style={{ flex: '1' }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', flex: '0 0 auto' }}>
                    <span style={{ marginRight: '8px', whiteSpace: 'nowrap' }}>是否启用:</span>
                    <Switch
                      checked={newOption.enabled}
                      onChange={(checked) => setNewOption({...newOption, enabled: checked})}
                    />
                  </div>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  marginTop: '16px',
                  position: 'static'
                }}>
                  <Space style={{ position: 'static' }}>
                    <Button 
                      type="primary" 
                      className="form-button"
                      icon={<CheckOutlined />} 
                      onClick={() => saveInlineEdit(editingItemId)}
                      disabled={editLoadingId === editingItemId}
                    >
                      确认
                    </Button>
                    <Button 
                      className="form-button"
                      icon={<CloseOutlined />} 
                      onClick={cancelInlineEdit}
                      disabled={editLoadingId === editingItemId}
                    >
                      取消
                    </Button>
                  </Space>
                </div>
              </Form>
            </Spin>
          </div>
        )}
        {/* 新增表单也放在上方，风格统一 */}
        {isAddingNew && (
          <div className="adding-card" style={{ width: '100%', marginBottom: '24px', background: '#f8faff', border: '1px dashed #1677FF', borderRadius: '8px', padding: '16px', position: 'relative' }}>
            <Spin spinning={addLoading} tip="添加中..." wrapperClassName="local-spin">
            <Form layout="horizontal">
              <Row gutter={[16, 8]} align="middle">
                <Col xs={24} sm={8} md={6} lg={6}>
                  <Form.Item style={{ marginBottom: 8 }} label="显示文本">
                    {type === 'VALIDITY_PERIOD' ? (
                      <InputNumber
                        placeholder="请输入大于等于1的整数"
                        min={1}
                        precision={0}
                        value={newOption.name === '' ? undefined : Number(newOption.name)}
                        onChange={(value) => setNewOption({...newOption, name: value ? value.toString() : ''})}
                        style={{ width: '100%' }}
                      />
                    ) : (
                      <Input
                        placeholder="请输入显示文本"
                        value={newOption.name}
                        onChange={(e) => setNewOption({...newOption, name: e.target.value})}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8} md={6} lg={6}>
                  <Form.Item style={{ marginBottom: 8 }} label="枚举值">
                    <Input
                      placeholder="请输入枚举值"
                      value={newOption.value}
                      onChange={(e) => setNewOption({...newOption, value: e.target.value})}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={16} md={8} lg={9}>
                  <Form.Item style={{ marginBottom: 8 }} label="描述">
                    <Input
                      placeholder="请输入描述信息（选填）"
                      value={newOption.description}
                      onChange={(e) => setNewOption({...newOption, description: e.target.value})}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={6} md={4} lg={3}>
                  <Form.Item style={{ marginBottom: 8 }} label="是否启用">
                    <Switch
                      checked={newOption.enabled}
                      onChange={(checked) => setNewOption({...newOption, enabled: checked})}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24} style={{ 
                  textAlign: 'center', 
                  marginTop: '8px',
                  position: 'static'
                }}>
                  <Space style={{ position: 'static' }}>
                    <Button 
                      type="primary" 
                      className="form-button"
                      icon={<CheckOutlined />} 
                      onClick={saveNewOption}
                      disabled={addLoading}
                    >
                      确认
                    </Button>
                    <Button 
                      className="form-button"
                      icon={<CloseOutlined />} 
                      onClick={cancelAddingNew}
                      disabled={addLoading}
                    >
                      取消
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Form>
            </Spin>
          </div>
        )}
        {/* 卡片列表内容保持不变 */}
        {safeOptions.length === 0 && !loading && !isAddingNew && !isInlineEditing ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<span>暂无数据，请点击添加按钮创建</span>}
            style={{ margin: '32px 0' }}
          />
        ) : (
          <Row gutter={[16, 16]} style={{ width: '100%', margin: '0' }}>
            {safeOptions.map((item) => (
              <Col xs={24} sm={12} md={8} lg={6} key={item.id} style={{ padding: '0 8px 16px 8px' }}>
                <Spin spinning={editLoadingId === item.id || deleteLoadingId === item.id} tip={editLoadingId === item.id ? "更新中..." : "删除中..."}>
                  <div style={{ 
                    position: 'relative', 
                    borderRadius: '10px', 
                    border: '1px solid #e8edf3', 
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                  }}>
                    {/* 启用状态标签 - 右上角 */}
                    <div style={{
                      position: 'absolute',
                      top: '0',
                      right: '0',
                      zIndex: 5,
                      fontSize: '13px',
                      fontWeight: '400',
                      padding: '3px 10px',
                      borderRadius: '0 0 0 4px',
                      backgroundColor: item.enabled ? 'rgba(26, 127, 55, 0.08)' : 'rgba(175, 184, 193, 0.2)',
                      color: item.enabled ? '#1a7f37' : '#57606a'
                    }}>
                      {item.enabled ? '启用' : '禁用'}
                    </div>
                    
                    <div style={{ display: 'flex' }}>
                      {/* 主要内容区域 */}
                      <div style={{ 
                        flex: 1,
                        borderRadius: '8px',
                        backgroundColor: '#fff'
                      }}>
                        <div>
                          {/* 内容区域：标题、枚举值和描述 */}
                          <div style={{ 
                            background: '#f9fafc',
                            padding: '14px',
                            position: 'relative'
                          }}>
                            <div style={{
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              height: '30px',
                              width: '4px',
                              backgroundColor: getIndicatorColor(type),
                              borderRadius: 0
                            }}></div>
                            
                            {/* 标题行 */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              marginBottom: '12px',
                              paddingBottom: '10px',
                              borderBottom: '1px solid #eaecef',
                              position: 'relative',
                              paddingLeft: '10px'
                            }}>
                              <div style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#18232c',
                                textAlign: 'left'
                              }}>
                                {item.name}
                              </div>
                            </div>
                            
                            {/* 枚举值 */}
                            <div style={{ 
                              display: 'flex', 
                              marginBottom: item.description ? '12px' : '0',
                              paddingBottom: item.description ? '12px' : '0',
                              borderBottom: item.description ? '1px solid rgba(234, 236, 239, 0.6)' : 'none'
                            }}>
                              <div style={{ 
                                fontSize: '13px', 
                                color: '#57606a', 
                                marginRight: '8px',
                                fontWeight: '500',
                                minWidth: '50px'
                              }}>枚举值</div>
                              <div style={{ 
                                fontSize: '13px', 
                                color: '#0969da',
                                fontFamily: "'SF Mono', Monaco, monospace",
                                wordBreak: 'break-all'
                              }}>
                                {item.value}
                              </div>
                            </div>
                            
                            {/* 描述 */}
                            {item.description && (
                              <div style={{ display: 'flex' }}>
                                <div style={{ 
                                  fontSize: '13px', 
                                  color: '#57606a', 
                                  marginRight: '8px',
                                  fontWeight: '500',
                                  minWidth: '50px'
                                }}>描述</div>
                                <div style={{ 
                                  fontSize: '13px', 
                                  color: '#57606a', 
                                  lineHeight: '1.5',
                                  wordBreak: 'break-word'
                                }}>
                                  {item.description.length > 80 ? `${item.description.slice(0, 80)}...` : item.description}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 右侧按钮区域 */}
                      <div style={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        gap: '14px',
                        padding: '0 12px',
                        borderLeft: '1px solid rgba(234, 236, 239, 0.5)',
                        background: '#f9fafc',
                        paddingTop: '45px' // 增加顶部内边距，使按钮往下移
                      }}>
                        <Button
                          type="text"
                          className="action-button"
                          icon={<EditOutlined />}
                          onClick={() => startInlineEditing(item)}
                          disabled={loading || isInlineEditing || deleteLoadingId !== null}
                        />
                        <Button
                          type="text"
                          className="action-button"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleDeleteOption(item.id, item.name)}
                          disabled={loading || isInlineEditing || item.enabled || deleteLoadingId !== null}
                          title={item.enabled ? "已启用的选项不能删除" : "删除"}
                        />
                      </div>
                    </div>
                  </div>
                </Spin>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};

export default OptionListComponent;