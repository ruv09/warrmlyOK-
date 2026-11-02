import React, { useState } from "react";
import { Pressable, Switch, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { KeyboardScreen } from "../components/layout";
import { Button, Text, TextInput } from "../components/ui";
import { useSettings } from "../hooks";
import { canScheduleLocalNotifications } from "../services";
import { useTheme } from "../theme";

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

/**
 * Время и раздельные тумблеры утро/вечер.
 * Оба сразу — это потолок, не обязанность.
 *
 * Кастомный back + title вместо Stack header — единый фон от верхнего
 * края (важно для Android 16 edge-to-edge и immersive mode).
 */
export function NotificationsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { settings, updateSettings } = useSettings();

  const [morningEnabled, setMorningEnabled] = useState(settings.notifications.morningEnabled !== false);
  const [eveningEnabled, setEveningEnabled] = useState(settings.notifications.eveningEnabled !== false);
  const [morningTime, setMorningTime] = useState(settings.notifications.morningTime);
  const [eveningTime, setEveningTime] = useState(settings.notifications.eveningTime);

  const isValid = TIME_PATTERN.test(morningTime) && TIME_PATTERN.test(eveningTime);

  async function handleSave() {
    if (!isValid) return;
    await updateSettings({
      notifications: {
        ...settings.notifications,
        morningEnabled,
        eveningEnabled,
        morningTime,
        eveningTime,
      },
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
    router.back();
  }

  const inputStyle = {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing("md"),
    color: theme.colors.textPrimary,
    fontSize: theme.typography.sizes.body,
  };

  const row = (label: string, value: boolean, onValueChange: (next: boolean) => void) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: theme.spacing("lg"),
        marginBottom: theme.spacing("sm"),
      }}
    >
      <Text style={{ color: theme.colors.textPrimary, flex: 1, paddingRight: 12 }}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );

  return (
    <KeyboardScreen insideTab>
      <Pressable
        onPress={() => router.back()}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel="Назад"
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.border,
          marginBottom: theme.spacing("sm"),
        }}
      >
        <Ionicons name="chevron-back" size={20} color={theme.colors.textPrimary} />
      </Pressable>

      <Text
        style={{
          fontSize: theme.typography.sizes.title,
          fontWeight: theme.typography.weights.semibold,
          color: theme.colors.textPrimary,
          marginBottom: theme.spacing("sm"),
        }}
      >
        Уведомления
      </Text>

      <Text style={{ color: theme.colors.textSecondary, lineHeight: 22 }}>
        Самое большее два тихих напоминания в день, без звука. Вечернее не придёт, если день уже
        записан.
      </Text>
      {!canScheduleLocalNotifications ? (
        <Text
          style={{
            color: theme.colors.textSecondary,
            lineHeight: 22,
            marginTop: theme.spacing("md"),
          }}
        >
          В Expo Go на Android системные напоминания недоступны. Они заработают в собранном
          приложении (APK).
        </Text>
      ) : null}

      {row("Утром", morningEnabled, setMorningEnabled)}
      <TextInput
        value={morningTime}
        onChangeText={setMorningTime}
        placeholder="09:00"
        placeholderTextColor={theme.colors.textSecondary}
        keyboardType="numbers-and-punctuation"
        editable={morningEnabled}
        style={[inputStyle, { opacity: morningEnabled ? 1 : 0.45 }]}
      />

      {row("Вечером", eveningEnabled, setEveningEnabled)}
      <TextInput
        value={eveningTime}
        onChangeText={setEveningTime}
        placeholder="21:00"
        placeholderTextColor={theme.colors.textSecondary}
        keyboardType="numbers-and-punctuation"
        editable={eveningEnabled}
        style={[inputStyle, { opacity: eveningEnabled ? 1 : 0.45 }]}
      />

      <View style={{ height: theme.spacing("xl") }} />
      <Button label="Сохранить" onPress={handleSave} disabled={!isValid} />
    </KeyboardScreen>
  );
}
