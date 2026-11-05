import React from "react";
import { StyleSheet, Text as RNText, TextProps } from "react-native";
import {
  FONT_SCALE_LIMITS,
  mapFontWeight,
  resolveTypeface,
  TypefaceKind,
} from "../../theme/tokens/typography";

type Props = TextProps & {
  /** ui — Nunito, serif — Literata (цитаты, записи, дощечка). */
  face?: TypefaceKind;
};

/**
 * Текст Warmly: сам подставляет файл шрифта по fontWeight / italic,
 * чтобы Android не синтезировал жирность поверх Nunito_400.
 *
 * По умолчанию системное масштабирование шрифта ограничено лимитом
 * `ui` (см. FONT_SCALE_LIMITS): заголовки, подписи и кнопки живут в
 * контейнерах конечного размера, и без потолка при крупном системном
 * шрифте текст выходит за карточки и наезжает на соседей. Для
 * длинного читаемого текста экраны передают `scaleLimits.content`.
 */
export function Text({
  style,
  face = "ui",
  maxFontSizeMultiplier = FONT_SCALE_LIMITS.ui,
  ...rest
}: Props) {
  const flat = StyleSheet.flatten(style);
  const italic = flat?.fontStyle === "italic";
  const weight = mapFontWeight(flat?.fontWeight);
  return (
    <RNText
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      {...rest}
      style={[style, { fontFamily: resolveTypeface(face, weight, italic), fontWeight: "400", fontStyle: "normal" }]}
    />
  );
}
