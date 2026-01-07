import { View, Text, StyleSheet, Button, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useWorkout } from '../../context/WorkoutContext';

type WorkoutSet = { reps: string; weight: string };
type WorkoutExercise = { name: string; sets: WorkoutSet[] };

export default function ActiveWorkout() {
  const router = useRouter();
  const { recordWorkout } = useWorkout();
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState<WorkoutSet[]>([{ reps: '', weight: '' }]);
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([]);

  const updateSet = (index: number, field: 'reps' | 'weight', value: string) => {
    setSets((prev) =>
      prev.map((set, i) => (i === index ? { ...set, [field]: value } : set))
    );
  };

  const addSet = () => {
    setSets((prev) => [...prev, { reps: '', weight: '' }]);
  };

  const normalizeSets = (source: WorkoutSet[]) =>
    source
      .map((set) => ({
        reps: set.reps.trim(),
        weight: set.weight.trim(),
      }))
      .filter((set) => set.reps || set.weight);

  const addExercise = () => {
    const trimmedName = exerciseName.trim();
    const normalizedSets = normalizeSets(sets);

    if (!trimmedName || normalizedSets.length === 0) {
      return;
    }

    setWorkoutExercises((prev) => [...prev, { name: trimmedName, sets: normalizedSets }]);
    setExerciseName('');
    setSets([{ reps: '', weight: '' }]);
  };

  const saveWorkout = () => {
    const trimmedName = exerciseName.trim();
    const normalizedSets = normalizeSets(sets);
    const exercisesToSave =
      trimmedName && normalizedSets.length > 0
        ? [...workoutExercises, { name: trimmedName, sets: normalizedSets }]
        : workoutExercises;

    if (exercisesToSave.length === 0) {
      return;
    }

    recordWorkout({
      date: new Date().toISOString(),
      exercises: exercisesToSave,
    });
    setWorkoutExercises([]);
    setExerciseName('');
    setSets([{ reps: '', weight: '' }]);
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.timer}>Czas: 12:45</Text>

      <Text style={styles.label}>Cwiczenie</Text>
      <TextInput
        style={styles.input}
        placeholder="np. Wyciskanie hantli"
        value={exerciseName}
        onChangeText={setExerciseName}
      />

      <Text style={styles.label}>Serie</Text>
      <View style={styles.exerciseBox}>
        {sets.map((set, index) => (
          <View key={`${index}`} style={styles.setRow}>
            <Text style={styles.setLabel}>Seria {index + 1}</Text>
            <TextInput
              style={styles.setInput}
              placeholder="powt."
              keyboardType="number-pad"
              value={set.reps}
              onChangeText={(value) => updateSet(index, 'reps', value)}
            />
            <TextInput
              style={styles.setInput}
              placeholder="kg"
              keyboardType="decimal-pad"
              value={set.weight}
              onChangeText={(value) => updateSet(index, 'weight', value)}
            />
          </View>
        ))}
        <TouchableOpacity style={styles.addSetButton} onPress={addSet}>
          <Text style={styles.addSetText}>+ Dodaj serie</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.addExerciseButton} onPress={addExercise}>
        <Text style={styles.addExerciseText}>Dodaj cwiczenie do treningu</Text>
      </TouchableOpacity>

      {workoutExercises.length > 0 && (
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Cwiczenia w treningu</Text>
          {workoutExercises.map((exercise, index) => (
            <View key={`${exercise.name}-${index}`} style={styles.summaryItem}>
              <Text style={styles.summaryName}>{exercise.name}</Text>
              {exercise.sets.map((set, setIndex) => (
                <Text key={`${exercise.name}-${index}-${setIndex}`} style={styles.summarySet}>
                  Seria {setIndex + 1}: {set.reps || '-'} x {set.weight || '-'} kg
                </Text>
              ))}
            </View>
          ))}
        </View>
      )}

      <Button title="Zapisz trening" onPress={saveWorkout} color="green" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  timer: { fontSize: 24, textAlign: 'center', fontWeight: 'bold', marginVertical: 20 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  exerciseBox: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 20 },
  setRow: {
    borderTopWidth: 1,
    borderColor: '#f0f0f0',
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  setLabel: { width: 70, fontWeight: '600' },
  setInput: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    textAlign: 'center',
  },
  addSetButton: {
    marginTop: 12,
    alignItems: 'center',
    paddingVertical: 8,
  },
  addSetText: { color: '#007AFF', fontWeight: '600' },
  addExerciseButton: {
    backgroundColor: '#eef4ff',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  addExerciseText: { color: '#1f5fbf', fontWeight: '600' },
  summaryBox: { backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 16 },
  summaryTitle: { fontWeight: '600', marginBottom: 8 },
  summaryItem: { marginBottom: 10 },
  summaryName: { fontWeight: '600' },
  summarySet: { marginTop: 4 },
});
