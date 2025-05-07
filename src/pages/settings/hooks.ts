import { useState, useCallback, useEffect } from 'react';
import { TabKey } from './types';

/**
 * 选项卡可见性管理Hook
 * 用于优化Tab性能，只渲染当前活动的Tab和之前访问过的Tab
 */
export const useTabVisible = () => {
  const [visitedTabs, setVisitedTabs] = useState<TabKey[]>(['basic']);

  /**
   * 判断选项卡是否应该渲染
   * @param tab 选项卡键名
   * @param activeTab 当前激活的选项卡
   * @returns 是否应该渲染
   */
  const isTabVisible = useCallback(
    (tab: TabKey, activeTab: TabKey): boolean => {
      // 如果是当前激活的Tab，或者之前访问过的Tab，那么就渲染它
      return tab === activeTab || visitedTabs.includes(tab);
    },
    [visitedTabs]
  );

  /**
   * 记录Tab访问历史
   * @param tab 被访问的Tab键名
   */
  const markTabAsVisited = useCallback((tab: TabKey) => {
    setVisitedTabs((prev) => {
      if (!prev.includes(tab)) {
        return [...prev, tab];
      }
      return prev;
    });
  }, []);

  return {
    isTabVisible,
    markTabAsVisited,
    visitedTabs,
  };
};

/**
 * 表单数据保存状态管理Hook
 */
export const useFormSaveState = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);

  const startSaving = useCallback(() => {
    setIsSaving(true);
  }, []);

  const finishSaving = useCallback((success: boolean = true) => {
    setIsSaving(false);
    if (success) {
      setLastSavedTime(new Date());
    }
  }, []);

  return {
    isSaving,
    lastSavedTime,
    startSaving,
    finishSaving,
  };
};
