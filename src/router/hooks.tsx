import {
  useNavigate as useOriginalNavigate,
  useLocation as useOriginalLocation,
  useParams as useOriginalParams,
  UNSAFE_NavigationContext,
  useRoutes as useOriginalRoutes,
  useSearchParams as useOriginalSearchParams,
  useMatch as useOriginalMatch
} from 'react-router-dom';
import { useContext, useMemo, useCallback } from 'react';
import { startTransition } from 'react';

// 包装 useNavigate 钩子，添加 startTransition
export function useNavigate() {
  const navigate = useOriginalNavigate();

  // 返回原始的 navigate 函数，不做任何包装
  // 因为我们已经在 createBrowserRouter 和 RouterProvider 中启用了未来标志
  return navigate;
}

// 包装 useLocation 钩子
export function useLocation() {
  return useOriginalLocation();
}

// 包装 useParams 钩子
export function useParams<T extends Record<string, string | undefined> = Record<string, string | undefined>>() {
  return useOriginalParams<T>();
}

// 包装 useRoutes 钩子
export function useRoutes(routes: Parameters<typeof useOriginalRoutes>[0], locationArg?: Parameters<typeof useOriginalRoutes>[1]) {
  return useOriginalRoutes(routes, locationArg);
}

// 包装 useSearchParams 钩子
export function useSearchParams(defaultInit?: Parameters<typeof useOriginalSearchParams>[0]) {
  // 直接返回原始的 useSearchParams 结果
  // 因为我们已经在 createBrowserRouter 和 RouterProvider 中启用了未来标志
  return useOriginalSearchParams(defaultInit);
}

// 包装 useMatch 钩子
export function useMatch<ParamKey extends string = string>(pattern: Parameters<typeof useOriginalMatch>[0]) {
  return useOriginalMatch<ParamKey>(pattern);
}

// 导出其他可能需要的钩子
export { useContext, UNSAFE_NavigationContext };
