// 侧边栏样式修复脚本 - 简化版
(function() {
  // 在页面加载后执行
  window.addEventListener('DOMContentLoaded', function() {
    // 等待一段时间确保 React 组件已经渲染
    setTimeout(function() {
      console.log('应用侧边栏样式修复...');

      // 处理移动端特殊情况
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        const sidebarCollapsed = document.querySelector('.sidebar.collapsed');
        if (sidebarCollapsed) {
          const menuItems = document.querySelectorAll('.sidebar.collapsed .sidebar-menu a');
          menuItems.forEach(function(item) {
            const icon = item.querySelector('span[role="img"]');
            if (icon) {
              icon.style.marginRight = '6px';
              icon.style.marginLeft = '0';
            }

            const text = item.querySelector('span:not([role="img"])');
            if (text) {
              text.style.left = '0';
              text.style.marginLeft = '0';
            }
          });
        }
      }

      console.log('侧边栏样式修复已应用');
    }, 1000); // 等待 1 秒确保组件已渲染
  });

  // 监听窗口大小变化
  window.addEventListener('resize', function() {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      const sidebarCollapsed = document.querySelector('.sidebar.collapsed');
      if (sidebarCollapsed) {
        const menuItems = document.querySelectorAll('.sidebar.collapsed .sidebar-menu a');
        menuItems.forEach(function(item) {
          const icon = item.querySelector('span[role="img"]');
          if (icon) {
            icon.style.marginRight = '6px';
            icon.style.marginLeft = '0';
          }

          const text = item.querySelector('span:not([role="img"])');
          if (text) {
            text.style.left = '0';
            text.style.marginLeft = '0';
          }
        });
      }
    }
  });
})();
