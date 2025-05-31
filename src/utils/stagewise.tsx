import React from 'react';
import ReactDOM from 'react-dom/client';
import { StagewiseToolbar } from '@stagewise/toolbar-react';

// stagewise配置
const stagewiseConfig = {
  plugins: []
};

// 初始化stagewise工具栏（仅在开发模式下）
export const initStagewiseToolbar = () => {
  if (process.env.NODE_ENV === 'development') {
    // 创建工具栏容器
    const toolbarContainer = document.createElement('div');
    toolbarContainer.id = 'stagewise-toolbar-container';
    toolbarContainer.style.position = 'fixed';
    toolbarContainer.style.top = '0';
    toolbarContainer.style.left = '0';
    toolbarContainer.style.zIndex = '9999';
    toolbarContainer.style.pointerEvents = 'none';
    
    // 添加到页面
    document.body.appendChild(toolbarContainer);
    
    // 创建独立的React根来渲染工具栏
    const toolbarRoot = ReactDOM.createRoot(toolbarContainer);
    toolbarRoot.render(<StagewiseToolbar config={stagewiseConfig} />);
    
    console.log('🚀 Stagewise toolbar initialized in development mode');
  }
}; 