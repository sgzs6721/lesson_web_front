import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import App from '@/App';
import '@/assets/styles/index.css';
import '@/assets/styles/darkTheme.css';
import '@/assets/styles/sidebar-fix.css'; // 修复侧边栏样式
import '@/assets/styles/dropdown.css'; // 下拉菜单样式

// 使用 Ant Design 图标库代替 Font Awesome
// 如果需要使用 Font Awesome，建议通过 npm 安装或使用最新的 CDN 链接

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);