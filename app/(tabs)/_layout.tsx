import { Tabs } from 'expo-router';
import { Dice1 as Dice, History } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';

export default function TabLayout() {
  const { colors } = useThemeStore();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: colors.subtext,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dice',
          tabBarIcon: ({ size, color }) => (
            <Dice size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ size, color }) => (
            <History size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}