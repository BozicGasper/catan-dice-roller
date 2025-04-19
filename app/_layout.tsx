import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useThemeStore } from '@/store/themeStore';
import { Slot } from 'expo-router';

export default function RootLayout() {
  useFrameworkReady();
  const isDark = useThemeStore((state) => state.isDark);

  return (
    <View style={{ flex: 1 }}>
      <Slot />
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}