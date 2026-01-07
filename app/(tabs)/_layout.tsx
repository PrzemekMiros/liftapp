import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#007AFF' }}>
      <Tabs.Screen 
        name="index" 
        options={{ title: 'Dziennik', tabBarIcon: ({color}) => <Ionicons name="journal" size={24} color={color} /> }} 
      />
      <Tabs.Screen 
        name="library" 
        options={{ title: 'Ćwiczenia', tabBarIcon: ({color}) => <Ionicons name="barbell" size={24} color={color} /> }} 
      />
      <Tabs.Screen 
        name="stats" 
        options={{ title: 'Statystyki', tabBarIcon: ({color}) => <Ionicons name="stats-chart" size={24} color={color} /> }} 
      />
    </Tabs>
  );
}