import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import App from '@/App';
import '@/assets/styles/index.css';
import '@/assets/styles/darkTheme.css';
import '@/assets/styles/sidebar-fix.css'; // 修复侧边栏样式
import '@/assets/styles/dropdown.css'; // 下拉菜单样式
import '@/assets/styles/globalModal.css'; // 全局模态框样式

// 配置dayjs
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import 'dayjs/locale/zh-cn';

// 导入stagewise工具栏
import { initStagewiseToolbar } from '@/utils/stagewise';

// 扩展dayjs插件
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(localeData);
dayjs.extend(weekday);

// 设置locale
dayjs.locale('zh-cn');

// 使用 Ant Design 图标库代替 Font Awesome
// 如果需要使用 Font Awesome，建议通过 npm 安装或使用最新的 CDN 链接

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// 初始化stagewise工具栏（仅在开发模式下）
initStagewiseToolbar();