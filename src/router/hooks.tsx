// 从 React 导出 useContext
import { useContext } from 'react';

// 从 React Router 导出钩子
export {
  useNavigate,
  useLocation,
  useParams,
  useRoutes,
  useSearchParams,
  useMatch,
  UNSAFE_NavigationContext
} from 'react-router-dom';

// 重新导出 useContext
export { useContext };
