import type { Plugin } from 'vite';

/**
 * Vite plugin to suppress specific React warnings
 */
export function suppressReactWarnings(): Plugin {
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
