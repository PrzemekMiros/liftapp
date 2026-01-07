import React, { useMemo } from 'react';
import { Text, View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useWorkout } from '../../context/WorkoutContext';

const ACCENT = '#D7FB00';
const BG = '#171E2E';
const CARD = '#0E121C';
const TEXT = '#FFFFFF';

export default function ProgressScreen() {
  const { workouts } = useWorkout();

  const stats = useMemo(() => {
    let totalVolume = 0;
    let totalSets = 0;
    let maxBench = 0;

    workouts.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        exercise.sets.forEach((set) => {
          const reps = parseFloat(set.reps) || 0;
          const weight = parseFloat(set.weight) || 0;
          const volume = reps * weight;
          totalVolume += volume;
          totalSets += 1;
          if (exercise.name.toLowerCase().includes('wyciskanie') && weight > maxBench) {
            maxBench = weight;
          }
        });
      });
    });

    return {
      volume: (totalVolume / 1000).toFixed(1),
      sets: totalSets,
      count: workouts.length,
      maxBench,
    };
  }, [workouts]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.header}>Twoje Wyniki</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>TRENINGI</Text>
              <Text style={styles.statValue}>{stats.count}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>OBJETOSC (t)</Text>
              <Text style={styles.statValue}>{stats.volume}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>SERIE</Text>
              <Text style={styles.statValue}>{stats.sets}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>MAX BENCH</Text>
              <Text style={styles.statValue}>
                {stats.maxBench} <Text style={{ fontSize: 12 }}>kg</Text>
              </Text>
            </View>
          </View>
          <View style={styles.motivationBox}>
            <Text style={styles.motivationTitle}>MOTYWACJA</Text>
            <Text style={styles.motivationText}>
              Przerzuciles juz {stats.volume} ton. To masa okolo{' '}
              {Math.round(parseFloat(stats.volume) / 1.5) || 0} aut osobowych!
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  innerContainer: { flex: 1, paddingHorizontal: 20 },
  header: { fontSize: 28, fontWeight: '600', color: TEXT, marginBottom: 15, marginTop: 30 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: {
    backgroundColor: CARD,
    width: '48%',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  statLabel: { color: '#666', fontSize: 10, fontWeight: '600' },
  statValue: { color: TEXT, fontSize: 22, fontWeight: '600' },
  motivationBox: { marginTop: 10, backgroundColor: CARD, padding: 20, borderRadius: 15 },
  motivationTitle: { color: ACCENT, fontWeight: '600', fontSize: 12, marginBottom: 5 },
  motivationText: { color: TEXT, fontSize: 15, lineHeight: 22 },
});
