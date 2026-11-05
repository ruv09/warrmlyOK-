import { useMemo } from "react";
import { Platform, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TAB_BAR_BASE_HEIGHT, TAB_BAR_CLEARANCE } from "../constants/layout";
import { Theme } from "../theme/types";

export interface TabBarMetrics {
  /** Нижний системный inset, который таб-бар добавляет к своей высоте. */
  bottomInset: number;
  /** Полная высота таб-бара на текущем устройстве. */
  height: number;
  /** Сколько места экран должен оставить снизу, чтобы контент не ушёл под таб-бар. */
  clearance: number;
}

/**
 * Размеры нижней навигации с учётом safe area.
 *
 * Таб-бар позиционирован absolute, поэтому React Navigation не
 * резервирует под него место сам — экраны делают это через `clearance`.
 * На Android системная навигационная панель скрыта (immersive), и её
 * inset в таб-бар не добавляется — иначе снизу остаётся пустая полоса.
 * На iOS inset home indicator добавляется, чтобы подписи вкладок не
 * оказались под индикатором.
 */
export function useTabBarMetrics(): TabBarMetrics {
  const insets = useSafeAreaInsets();
  const bottomInset = Platform.OS === "android" ? 0 : insets.bottom;

  return useMemo(() => {
    const height = TAB_BAR_BASE_HEIGHT + bottomInset;
    return {
      bottomInset,
      height,
      clearance: height + TAB_BAR_CLEARANCE,
    };
  }, [bottomInset]);
}

/**
 * Стиль таб-бара Warmly. Используется и в app/(tabs)/_layout.tsx, и там,
 * где экран временно скрывает/возвращает таб-бар (Лес) — чтобы высота
 * и отступы не расходились между копиями.
 */
export function buildTabBarStyle(theme: Theme, metrics: TabBarMetrics): ViewStyle {
  const isDark = theme.mode === "dark";
  return {
    backgroundColor: theme.colors.tabBar,
    borderTopWidth: 0,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    height: metrics.height,
    paddingTop: 6,
    paddingBottom: 6 + metrics.bottomInset,
    position: "absolute",
    shadowColor: "#000",
    shadowOpacity: isDark ? 0.3 : 0.07,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: -4 },
  };
}
