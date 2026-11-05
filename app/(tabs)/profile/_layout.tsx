import React from "react";
import { Platform } from "react-native";
import { Stack } from "expo-router";
import { useTheme } from "../../../src/theme";

/**
 * Вложенный Stack внутри вкладки "Профиль".
 *
 * headerShown: false — без системного белого header.
 * statusBarTranslucent — контент и фон идут от физического края экрана;
 * safe-area отступ добавляет уже KeyboardScreen, а не пустая полоса стека.
 * Так устроен экран настройки времени на Android 16 / edge-to-edge.
 */
export default function ProfileLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        statusBarTranslucent: true,
        navigationBarTranslucent: true,
        statusBarHidden: Platform.OS === "android",
        statusBarStyle: theme.mode === "dark" ? "light" : "dark",
        contentStyle: { backgroundColor: theme.colors.background },
        headerStyle: { backgroundColor: theme.colors.background },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="notifications" />
    </Stack>
  );
}
