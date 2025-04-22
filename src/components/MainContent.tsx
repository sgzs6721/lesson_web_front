import { Outlet } from 'react-router-dom';

interface MainContentProps {
  sidebarCollapsed: boolean;
}

const MainContent: React.FC<MainContentProps> = ({ sidebarCollapsed }) => {
  return (
    <div className="main-content">
      <div className="content" style={{
        marginTop: '70px', // 为顶部导航条留出空间
        padding: '20px',
        height: 'calc(100% - 70px)',
        overflowY: 'auto'
      }}>
        <Outlet />
      </div>
    </div>
  );
};

export default MainContent; 