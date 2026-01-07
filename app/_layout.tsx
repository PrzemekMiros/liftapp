import { Stack } from 'expo-router';
import { WorkoutProvider } from '../context/WorkoutContext';

export default function RootLayout() {
  return (
    <WorkoutProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="workout/[id]" options={{ title: 'Trening' }} />
        <Stack.Screen name="workout/exercise/[id]" options={{ title: 'Cwiczenie' }} />
      </Stack>
    </WorkoutProvider>
  );
}
