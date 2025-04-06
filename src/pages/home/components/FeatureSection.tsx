import React from 'react';

const FeatureSection: React.FC = () => {
  return (
    <section className="features" id="features">
      <div className="section-title">
        <h3>核心功能</h3>
        <p>我们的系统提供全方位的培训机构管理功能</p>
      </div>
      <div className="features-container">
        <div className="features-grid">
          <div className="feature-card" style={{ borderBottom: '4px solid #4CAF50', background: 'linear-gradient(145deg, #ffffff, #f0f7f2)' }}>
            <div className="feature-icon">
              <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4Ij48cmVjdCB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIGZpbGw9Im5vbmUiLz48ZyBmaWxsPSJub25lIiBzdHJva2U9IiM0Q0FGNTAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cmVjdCB4PSI0IiB5PSI0IiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHJ4PSIyIi8+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iOCIgaGVpZ2h0PSIyOCIgZmlsbD0icmdiYSg3NiwgMTc1LCA4MCwgMC4yKSIvPjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjgiIGhlaWdodD0iMTgiIGZpbGw9InJnYmEoNzYsIDE3NSwgODAsIDAuNikiLz48cmVjdCB4PSIzMCIgeT0iMTUiIHdpZHRoPSI4IiBoZWlnaHQ9IjIzIiBmaWxsPSJyZ2JhKDc2LCAxNzUsIDgwLCAxKSIvPjwvZz48L3N2Zz4=" alt="学员管理" style={{ width: '48px', height: '48px' }} />
            </div>
            <h4>学员管理</h4>
            <p>全面记录学员信息、学习进度和成绩，实现个性化教学跟踪</p>
          </div>
          <div className="feature-card" style={{ borderBottom: '4px solid #FF5722', background: 'linear-gradient(145deg, #ffffff, #fff5f2)' }}>
            <div className="feature-icon">
              <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4Ij48cmVjdCB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIGZpbGw9Im5vbmUiLz48ZyBmaWxsPSJub25lIiBzdHJva2U9IiNGRjU3MjIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cmVjdCB4PSI2IiB5PSI4IiB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHJ4PSIyIi8+PHJlY3QgeD0iMTIiIHk9IjQiIHdpZHRoPSIyNCIgaGVpZ2h0PSI4IiByeD0iMiIgZmlsbD0icmdiYSgyNTUsIDg3LCAzNCwgMC4yKSIvPjxsaW5lIHgxPSIxMiIgeTE9IjIwIiB4Mj0iMzYiIHkyPSIyMCIvPjxsaW5lIHgxPSIxMiIgeTE9IjI4IiB4Mj0iMzYiIHkyPSIyOCIvPjxsaW5lIHgxPSIxMiIgeTE9IjM2IiB4Mj0iMzYiIHkyPSIzNiIvPjx0ZXh0IHg9IjI0IiB5PSIxNyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSI4IiBmaWxsPSIjRkY1NzIyIiBzdHJva2U9Im5vbmUiPjE3PC90ZXh0PjwvZz48L3N2Zz4=" alt="课程排班" style={{ width: '48px', height: '48px' }} />
            </div>
            <h4>课程排班</h4>
            <p>智能排课系统，自动处理教师、教室和时间的冲突</p>
          </div>
          <div className="feature-card" style={{ borderBottom: '4px solid #FFC107', background: 'linear-gradient(145deg, #ffffff, #fffbf0)' }}>
            <div className="feature-icon">
              <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4Ij48cmVjdCB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIGZpbGw9Im5vbmUiLz48ZyBmaWxsPSJub25lIiBzdHJva2U9IiNGRkMxMDciIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMzQgMjJjMCA5Ljk0LTEwIDE4LTEwIDE4cy0xMC04LjA2LTEwLTE4YTEwIDEwIDAgMCAxIDIwIDB6IiBmaWxsPSJyZ2JhKDI1NSwgMTkzLCA3LCAwLjIpIi8+PHRleHQgeD0iMjQiIHk9IjI1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjEyIiBmaWxsPSIjRkZDMTA3IiBzdHJva2U9Im5vbmUiPiQ8L3RleHQ+PC9nPjwvc3ZnPg==" alt="财务管理" style={{ width: '48px', height: '48px' }} />
            </div>
            <h4>财务管理</h4>
            <p>自动生成财务报表，清晰记录每一笔收入和支出</p>
          </div>
          <div className="feature-card" style={{ borderBottom: '4px solid #2196F3', background: 'linear-gradient(145deg, #ffffff, #f0f7ff)' }}>
            <div className="feature-icon">
              <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4Ij48cmVjdCB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIGZpbGw9Im5vbmUiLz48ZyBmaWxsPSJub25lIiBzdHJva2U9IiMyMTk2RjMiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIyNCIgY3k9IjE2IiByPSI4IiBmaWxsPSJyZ2JhKDMzLCAxNTAsIDI0MywgMC4yKSIvPjxwYXRoIGQ9Ik04IDQwYzAtOCA4LTEyIDE2LTEyczE2IDQgMTYgMTIiLz48cmVjdCB4PSIyMCIgeT0iMTQiIHdpZHRoPSI4IiBoZWlnaHQ9IjQiIGZpbGw9InJnYmEoMzMsIDE1MCwgMjQzLCAwLjYpIi8+PC9nPjwvc3ZnPg==" alt="教师管理" style={{ width: '48px', height: '48px' }} />
            </div>
            <h4>教师管理</h4>
            <p>管理教师信息、课程安排和教学评估</p>
          </div>
          <div className="feature-card" style={{ borderBottom: '4px solid #9C27B0', background: 'linear-gradient(145deg, #ffffff, #f7f0ff)' }}>
            <div className="feature-icon">
              <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4Ij48cmVjdCB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIGZpbGw9Im5vbmUiLz48ZyBmaWxsPSJub25lIiBzdHJva2U9IiM5QzI3QjAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cmVjdCB4PSIxMiIgeT0iNiIgd2lkdGg9IjI0IiBoZWlnaHQ9IjM2IiByeD0iMiIvPjxyZWN0IHg9IjE2IiB5PSIxMCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjI0IiByeD0iMSIgZmlsbD0icmdiYSgxNTYsIDM5LCAxNzYsIDAuMikiLz48Y2lyY2xlIGN4PSIyNCIgY3k9IjM2IiByPSIyIiBmaWxsPSJyZ2JhKDE1NiwgMzksIDE3NiwgMC44KSIvPjwvZz48L3N2Zz4=" alt="小程序支持" style={{ width: '48px', height: '48px' }} />
            </div>
            <h4>小程序支持</h4>
            <p>配套小程序让家长随时查看学员进度和课程安排</p>
          </div>
          <div className="feature-card" style={{ borderBottom: '4px solid #E91E63', background: 'linear-gradient(145deg, #ffffff, #fff0f5)' }}>
            <div className="feature-icon">
              <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4Ij48cmVjdCB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIGZpbGw9Im5vbmUiLz48ZyBmaWxsPSJub25lIiBzdHJva2U9IiNFOTFFNjMiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cmVjdCB4PSI0IiB5PSI0IiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHJ4PSIyIi8+PHBhdGggZD0iTTQgMTZoNDBNNCAxNmwxMiAxMk0yMCAyOGwxMCAtMTJNMzAgMTZsMTAgMTIiIHN0cm9rZT0iI0U5MUU2MyIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMzAgMTZsNCAxMiIgc3Ryb2tlPSIjRTkxRTYzIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgZmlsbD0icmdiYSgyMzMsIDMwLCA5OSwgMC4yKSIvPjwvZz48L3N2Zz4=" alt="数据分析" style={{ width: '48px', height: '48px' }} />
            </div>
            <h4>数据分析</h4>
            <p>多维度数据分析，帮助机构优化运营策略</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection; 