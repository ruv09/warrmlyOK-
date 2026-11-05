import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { SafeAreaView, Edge } from "react-native-safe-area-context";
import { useTheme } from "../../theme";
import { useTabBarMetrics } from "../../hooks/useTabBarMetrics";

interface KeyboardScreenProps {
  children: React.ReactNode;
  edges?: Edge[];
  style?: ViewStyle;
  /**
   * Если экран открыт внутри вкладки (таб-бар виден), передайте true —
   * добавится нижний отступ, чтобы контент и кнопка «Сохранить»
   * не перекрывались нижней навигацией.
   */
  insideTab?: boolean;
}

/**
 * Экран с формой ввода: поднимает контент над клавиатурой
 * (сильная сторона UX из Warmly v1) и даёт keyboardShouldPersistTaps.
 *
 * Фон задаётся на SafeAreaView, поэтому при Android immersive /
 * edge-to-edge (status bar hidden) нет белых полос сверху — цвет
 * фона идёт от самого края экрана, а insets применяются только
 * к внутреннему отступу контента.
 *
 * keyboardVerticalOffset = 0: ни один экран с формой не показывает
 * навигационный header, так что компенсировать нечего — смещение
 * только оставляло бы лишний зазор между клавиатурой и контентом.
 */
export function KeyboardScreen({
  children,
  edges,
  style,
  insideTab = false,
}: KeyboardScreenProps) {
  const theme = useTheme();
  const tabBar = useTabBarMetrics();
  const paddingHorizontal = theme.spacing("md");
  const paddingVertical = theme.spacing("md");
  const bottomClearance = insideTab ? tabBar.clearance : 0;

  return (
    <SafeAreaView
      edges={edges}
      style={[styles.flexFill, { backgroundColor: theme.colors.background }]}
    >
      <KeyboardAvoidingView
        style={styles.flexFill}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingHorizontal,
              paddingTop: paddingVertical,
              paddingBottom: paddingVertical + bottomClearance,
            },
            style,
          ]}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flexFill: { flex: 1 },
  scrollContent: { flexGrow: 1 },
});
