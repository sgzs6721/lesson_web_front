import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

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
  plugins: [react()],
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