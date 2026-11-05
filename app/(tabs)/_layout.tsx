import React from "react";
import { Platform } from "react-native";
import { Tabs } from "expo-router";
import { useTheme } from "../../src/theme";
import { TabBarIcon } from "../../src/components/ui";
import { buildTabBarStyle, useTabBarMetrics } from "../../src/hooks/useTabBarMetrics";

/**
 * В Expo Router начальный экран задаётся через unstable_settings.
 * «index» — главная с поддерживающей фразой.
 */
export const unstable_settings = {
  anchor: "index",
};

/**
 * Главная с поддерживающей фразой — первый экран.
 * Дальше: Дневник / Лес / Календарь / Профиль. Без «Дыши».
 */
export default function TabsLayout() {
  const theme = useTheme();
  const isDark = theme.mode === "dark";
  const tabBar = useTabBarMetrics();

  return (
    <Tabs
      // На Android системный Navigation Bar скрыт — не добавляем его inset
      // к таб-бару приложения, иначе снизу появляется пустая полоса.
      safeAreaInsets={Platform.OS === "android" ? { bottom: 0 } : undefined}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        // Подписи живут в таб-баре фиксированной высоты: системное
        // масштабирование шрифта здесь выключено, иначе при крупном
        // шрифте они наезжают на иконки и обрезаются.
        tabBarAllowFontScaling: false,
        tabBarActiveTintColor: isDark ? theme.colors.accentWarm : theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: theme.typography.sizes.caption - 1,
          fontFamily: theme.typography.fonts.medium,
        },
        tabBarStyle: buildTabBarStyle(theme, tabBar),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Главная",
          tabBarIcon: ({ focused }) => <TabBarIcon name={focused ? "home" : "home-outline"} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: "Дневник",
          tabBarIcon: ({ focused }) => <TabBarIcon name={focused ? "book" : "book-outline"} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="forest"
        options={{
          title: "Лес",
          tabBarIcon: ({ focused }) => <TabBarIcon name={focused ? "leaf" : "leaf-outline"} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Календарь",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name={focused ? "calendar" : "calendar-outline"} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Профиль",
          tabBarIcon: ({ focused }) => <TabBarIcon name={focused ? "person" : "person-outline"} focused={focused} />,
        }}
      />
    </Tabs>
  );
}
