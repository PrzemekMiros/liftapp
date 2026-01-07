import { View, Text, StyleSheet, Button, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useWorkout } from '../../context/WorkoutContext';

export default function ActiveWorkout() {
  const router = useRouter();
  const { recordWorkout } = useWorkout();
  const [exercise, setExercise] = useState('');
  const [sets, setSets] = useState([{ reps: '', weight: '' }]);

  const updateSet = (index: number, field: 'reps' | 'weight', value: string) => {
    setSets((prev) =>
      prev.map((set, i) => (i === index ? { ...set, [field]: value } : set))
    );
  };

  const addSet = () => {
    setSets((prev) => [...prev, { reps: '', weight: '' }]);
  };

  const saveWorkout = () => {
    const trimmedExercise = exercise.trim();
    const normalizedSets = sets
      .map((set) => ({
        reps: set.reps.trim(),
        weight: set.weight.trim(),
      }))
      .filter((set) => set.reps || set.weight);

    if (!trimmedExercise || normalizedSets.length === 0) {
      return;
    }

    recordWorkout({
      date: new Date().toISOString(),
      exercise: trimmedExercise,
      sets: normalizedSets,
    });
    setExercise('');
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
        value={exercise}
        onChangeText={setExercise}
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
});
