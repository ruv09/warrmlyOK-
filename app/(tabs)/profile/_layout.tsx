import React from "react";
import { Stack } from "expo-router";
import { useTheme } from "../../../src/theme";

/**
 * Вложенный Stack внутри вкладки "Профиль".
 *
 * headerShown: false для всех экранов — единый фон от края до края,
 * кастомная кнопка «Назад» внутри экранов (как в Favorites / EntryDetail).
 * Это устраняет белую полосу сверху на Android 16 / edge-to-edge:
 * системный Stack header по умолчанию белый и не совпадает с палитрой Warmly.
 */
export default function ProfileLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="notifications" />
    </Stack>
  );
}
