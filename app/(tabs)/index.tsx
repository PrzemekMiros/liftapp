import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useWorkout } from '../../context/WorkoutContext';

export default function Dashboard() {
  const router = useRouter();
  const { history } = useWorkout();
  const latest = history[history.length - 1];

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: 'Twoj Dziennik' }} />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Ostatni trening</Text>
        {latest ? (
          <>
            <Text style={styles.cardSubtitle}>{latest.exercise}</Text>
            <Text style={styles.cardSubtitle}>
              {new Date(latest.date).toLocaleDateString()}
            </Text>
          </>
        ) : (
          <Text style={styles.cardSubtitle}>Brak zapisow</Text>
        )}
      </View>

      <TouchableOpacity style={styles.startButton} onPress={() => router.push('/workout/active')}>
        <Text style={styles.startButtonText}>ROZPOCZNIJ NOWY TRENING</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Zapisane treningi</Text>
        {history.length === 0 ? (
          <View style={styles.card}>
            <Text>Brak zapisanych treningow</Text>
          </View>
        ) : (
          history
            .slice(-5)
            .reverse()
            .map((entry) => (
              <View key={entry.id} style={styles.card}>
                <Text style={styles.cardTitle}>{entry.exercise}</Text>
                <Text style={styles.cardSubtitle}>
                  {new Date(entry.date).toLocaleDateString()}
                </Text>
                {entry.sets.map((set, index) => (
                  <Text key={`${entry.id}-${index}`} style={styles.historySet}>
                    Seria {index + 1}: {set.reps || '-'} x {set.weight || '-'} kg
                  </Text>
                ))}
              </View>
            ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4', padding: 15 },
  section: { marginTop: 20 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  cardSubtitle: { color: '#666', marginTop: 4 },
  startButton: { backgroundColor: '#007AFF', padding: 18, borderRadius: 12, alignItems: 'center' },
  startButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  historySet: { marginTop: 6 },
});
