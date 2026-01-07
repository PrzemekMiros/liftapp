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
            <Text style={styles.cardSubtitle}>
              {new Date(latest.date).toLocaleDateString()}
            </Text>
            <Text style={styles.cardSubtitle}>
              {latest.exercises.length} cwiczen
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
                <Text style={styles.cardTitle}>
                  {new Date(entry.date).toLocaleDateString()}
                </Text>
                {entry.exercises.map((exercise, exerciseIndex) => (
                  <View key={`${entry.id}-${exerciseIndex}`} style={styles.exerciseBlock}>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    {exercise.sets.map((set, setIndex) => (
                      <Text key={`${entry.id}-${exerciseIndex}-${setIndex}`} style={styles.historySet}>
                        Seria {setIndex + 1}: {set.reps || '-'} x {set.weight || '-'} kg
                      </Text>
                    ))}
                  </View>
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
  exerciseBlock: { marginTop: 10 },
  exerciseName: { fontWeight: '600' },
  historySet: { marginTop: 4 },
});
