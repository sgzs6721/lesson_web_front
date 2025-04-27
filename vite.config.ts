import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
// 直接在这里定义插件，避免导入
import type { Plugin } from 'vite';

// 抑制 React Router 警告的插件
function suppressReactRouterWarnings(): Plugin {
  return {
    name: 'suppress-react-router-warnings',
    transform(code, id) {
      // 只处理 react-router-dom 相关文件
      if (id.includes('react-router') || id.includes('react-router-dom')) {
        // 替换警告代码
        let modifiedCode = code;
        // 替换所有包含 v7_startTransition 的警告
        modifiedCode = modifiedCode.replace(
          /console\.warn\([^)]*v7_startTransition[^)]*\);/g,
          '/* Warning suppressed */ false;'
        );
        // 替换所有包含 'future flag' 的警告
        modifiedCode = modifiedCode.replace(
          /console\.warn\([^)]*future flag[^)]*\);/g,
          '/* Warning suppressed */ false;'
        );
        // 替换所有包含 'UNSAFE_' 的警告
        modifiedCode = modifiedCode.replace(
          /console\.warn\([^)]*UNSAFE_[^)]*\);/g,
          '/* Warning suppressed */ false;'
        );
        return {
          code: modifiedCode,
          map: null
        };
      }
      return null;
    }
  };
}

// 抑制 React 警告的插件
function suppressReactWarnings(): Plugin {
  return {
    name: 'suppress-react-warnings',
    transform(code, id) {
      // 只处理 React 相关文件
      if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
        // 替换警告代码
        let modifiedCode = code;
        // 替换所有包含 'deprecated' 的警告
        modifiedCode = modifiedCode.replace(
          /console\.warn\([^)]*deprecated[^)]*\);/g,
          '/* Warning suppressed */ false;'
        );
        // 替换所有包含 'legacy' 的警告
        modifiedCode = modifiedCode.replace(
          /console\.warn\([^)]*legacy[^)]*\);/g,
          '/* Warning suppressed */ false;'
        );
        return {
          code: modifiedCode,
          map: null
        };
      }
      return null;
    }
  };
}

// 定义API主机常量
const LESSON_API_HOST = 'http://lesson.devtesting.top';
const LOCAL_API_HOST = 'http://localhost:8080';

// 配置代理日志记录函数
const configureProxyLogs = (proxy) => {
  proxy.on('error', (err, req, res) => {
    console.error('代理错误:', err);
  });
  proxy.on('proxyReq', (proxyReq, req, res) => {
    console.log('代理请求:', req.method, req.url);
  });
  proxy.on('proxyRes', (proxyRes, req, res) => {
    console.log('代理响应:', proxyRes.statusCode, req.url);
  });
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    suppressReactRouterWarnings(),
    suppressReactWarnings(),
  ],
  define: {
    // 禁用 React Router 的 v7_startTransition 警告
    '__REACT_ROUTER_FUTURE_FLAG.v7_startTransition': 'true',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    cors: true,
    proxy: {
      '/api': {
        target: LOCAL_API_HOST,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: configureProxyLogs
      },
      '/lesson': {
        target: LESSON_API_HOST,
        changeOrigin: true,
        secure: false,
        headers: {
          'Referer': LESSON_API_HOST,
          'Origin': LESSON_API_HOST
        },
        configure: configureProxyLogs
      },
    },
  },
});