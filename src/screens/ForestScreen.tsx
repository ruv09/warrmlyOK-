import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BackHandler, StyleSheet, View } from "react-native";
import { useNavigation } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { ForestCatalog, TreeGroveScene } from "../components/forest";
import { buildTabBarStyle, useEntries, useForest, useTabBarMetrics } from "../hooks";
import { useTheme } from "../theme";
import { resolveSceneMode, sceneModeFromTheme } from "../constants/sceneMode";
import { CatalogItem } from "../services/forest/catalog";

/**
 * Лес — вертикальный каталог деревьев пользователя, сгруппированный по месяцам.
 * Тап открывает статичную сцену дерева; каталог остаётся смонтированным, чтобы сохранить скролл.
 */
export function ForestScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const tabBar = useTabBarMetrics();
  const { trees, isLoading: treesLoading } = useForest();
  const { entries, isLoading: entriesLoading } = useEntries();
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const sceneMode = resolveSceneMode(sceneModeFromTheme(theme.mode));

  const selectedItem = useMemo(() => {
    if (!selectedEntryId) return null;
    const entry = entries.find((item) => item.id === selectedEntryId);
    if (!entry) return null;
    const tree = trees.find((item) => item.id === entry.treeId);
    if (!tree) return null;
    return { tree, entry } satisfies CatalogItem;
  }, [entries, selectedEntryId, trees]);

  useEffect(() => {
    if (selectedEntryId && !selectedItem) setSelectedEntryId(null);
  }, [selectedEntryId, selectedItem]);

  useEffect(() => {
    if (!selectedItem) return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      setSelectedEntryId(null);
      return true;
    });
    return () => sub.remove();
  }, [selectedItem]);

  useEffect(() => {
    navigation.setOptions({
      tabBarStyle: selectedItem
        ? { display: "none", height: 0, overflow: "hidden", position: "absolute" }
        : buildTabBarStyle(theme, tabBar),
    });
  }, [navigation, selectedItem, tabBar, theme]);

  const onSelectItem = useCallback((item: CatalogItem) => {
    setSelectedEntryId(item.entry.id);
  }, []);

  return (
    <View style={[styles.fill, { backgroundColor: theme.colors.background }]}>
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={styles.fill}
        importantForAccessibility={selectedItem ? "no-hide-descendants" : "auto"}
      >
        <ForestCatalog
          entries={entries}
          trees={trees}
          onSelectItem={onSelectItem}
          bottomInset={Math.max(insets.bottom, tabBar.clearance)}
          isLoading={treesLoading || entriesLoading}
          sceneMode={sceneMode}
        />
      </SafeAreaView>

      {selectedItem ? (
        <View style={[StyleSheet.absoluteFill, styles.groveLayer]} pointerEvents="auto">
          <TreeGroveScene
            item={selectedItem}
            sceneMode={sceneMode}
            onClose={() => setSelectedEntryId(null)}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  groveLayer: {
    zIndex: 40,
    elevation: 40,
  },
});
