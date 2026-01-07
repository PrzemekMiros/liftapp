import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const ACCENT = '#D7FB00';
const BG = '#171E2E';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: ACCENT,
        tabBarInactiveTintColor: '#666',
        tabBarStyle: { backgroundColor: BG, borderTopColor: '#0c0f18' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Dziennik', tabBarIcon: ({ color }) => <Ionicons name="book" size={24} color={color} /> }}
      />
      <Tabs.Screen
        name="library"
        options={{ title: 'Cwiczenia', tabBarIcon: ({ color }) => <Ionicons name="barbell" size={24} color={color} /> }}
      />
      <Tabs.Screen
        name="stats"
        options={{ title: 'Statystyki', tabBarIcon: ({ color }) => <Ionicons name="stats-chart" size={24} color={color} /> }}
      />
    </Tabs>
  );
}
