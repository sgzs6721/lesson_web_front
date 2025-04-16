import type { Plugin } from 'vite';

/**
 * Vite plugin to suppress specific React Router warnings
 */
export function suppressReactRouterWarnings(): Plugin {
  return {
    name: 'suppress-react-router-warnings',
    transform(code, id) {
      // 只处理 react-router-dom 相关文件
      if (id.includes('react-router') || id.includes('react-router-dom')) {
        // 替换警告代码
        // 查找包含 v7_startTransition 警告的代码并禁用它
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
