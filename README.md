# Warmly

Спокойное приложение поддержки настроения: чек-ины, личный лес,
поддерживающие фразы и мягкие напоминания.

Expo SDK 54 / React Native 0.81 / Expo Router 6.

## Что внутри

- **Главная** — мысль дня из палитры Warmly, приветствие, записи сегодня.
- **Дневник** — настроение, заметка, посадка дерева.
- **Лес** — каталог деревьев по месяцам. Тап открывает акварельную поляну с деревом и табличкой.
- **Календарь** — дни с записями.
- **Профиль** — тема, аватар, уведомления, избранное, экспорт.
- **Онбординг** с именем.
- Локальные тихие напоминания утром и вечером (работают без интернета).
- На Android приложение на весь экран: системные панели скрыты, нижняя навигация Warmly остаётся.

## Запуск

```bash
pnpm install
pnpm typecheck
pnpm start
```

## Сборка APK (Android)

### EAS Build

```bash
npm i -g eas-cli && eas login
pnpm install
eas build -p android --profile preview
```

Профиль `preview` в `eas.json` собирает APK.

### Локально

```bash
pnpm install
pnpm exec expo prebuild --platform android --clean
bash scripts/setup-android.sh
cd android && ./gradlew assembleDebug
```

## Структура

```text
app/          маршруты Expo Router
src/          экраны, тема, сторы, сервисы, лес
assets/       бренд, деревья, поляны, аватары
scripts/      подготовка локальной Android-сборки
```

Архитектурные заметки: `ARCHITECTURE.md`, `FOREST.md`, `DATA_LAYER.md`, `THEME.md`, `NAVIGATION.md`, `ANIMATION.md`, `RESPONSIVE.md`.
