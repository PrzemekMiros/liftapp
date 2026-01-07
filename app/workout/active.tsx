import { View, Text, StyleSheet, Button, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { useWorkout } from '../../context/WorkoutContext';

type WorkoutSet = { reps: string; weight: string };
type WorkoutExercise = { name: string; sets: WorkoutSet[] };

export default function ActiveWorkout() {
  const router = useRouter();
  const { recordWorkout, exercises, addExercise } = useWorkout();
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [customExercise, setCustomExercise] = useState('');
  const [sets, setSets] = useState<WorkoutSet[]>([{ reps: '', weight: '' }]);
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([]);

  const bodyParts = useMemo(
    () => Array.from(new Set(exercises.map((item) => item.bodyPart))).sort(),
    [exercises]
  );

  const filteredExercises = useMemo(
    () => exercises.filter((item) => item.bodyPart === selectedBodyPart),
    [exercises, selectedBodyPart]
  );

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

  const addExerciseToWorkout = () => {
    if (!selectedExercise) {
      return;
    }
    const normalizedSets = normalizeSets(sets);
    if (normalizedSets.length === 0) {
      return;
    }
    setWorkoutExercises((prev) => [
      ...prev,
      { name: selectedExercise, sets: normalizedSets },
    ]);
    setSelectedExercise(null);
    setSets([{ reps: '', weight: '' }]);
  };

  const addCustomExerciseToBase = () => {
    const trimmedName = customExercise.trim();
    if (!trimmedName || !selectedBodyPart) {
      return;
    }
    addExercise({ name: trimmedName, bodyPart: selectedBodyPart });
    setSelectedExercise(trimmedName);
    setCustomExercise('');
  };

  const saveWorkout = () => {
    const normalizedSets = normalizeSets(sets);
    const currentExercise =
      selectedExercise && normalizedSets.length > 0
        ? { name: selectedExercise, sets: normalizedSets }
        : null;
    const exercisesToSave = currentExercise
      ? [...workoutExercises, currentExercise]
      : workoutExercises;
    if (exercisesToSave.length === 0) {
      return;
    }
    recordWorkout({
      date: new Date().toISOString(),
      exercises: exercisesToSave,
    });
    setWorkoutExercises([]);
    setSelectedExercise(null);
    setSets([{ reps: '', weight: '' }]);
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.timer}>Czas: 12:45</Text>

      <Text style={styles.sectionTitle}>Wybierz partie ciala</Text>
      <View style={styles.choiceWrap}>
        {bodyParts.map((part) => (
          <TouchableOpacity
            key={part}
            style={[styles.choiceButton, selectedBodyPart === part && styles.choiceButtonActive]}
            onPress={() => {
              setSelectedBodyPart(part);
              setSelectedExercise(null);
            }}
          >
            <Text style={[styles.choiceText, selectedBodyPart === part && styles.choiceTextActive]}>
              {part}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedBodyPart && (
        <>
          <Text style={styles.sectionTitle}>Wybierz cwiczenie</Text>
          <View style={styles.choiceWrap}>
            {filteredExercises.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.choiceButton,
                  selectedExercise === item.name && styles.choiceButtonActive,
                ]}
                onPress={() => setSelectedExercise(item.name)}
              >
                <Text
                  style={[
                    styles.choiceText,
                    selectedExercise === item.name && styles.choiceTextActive,
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.customBox}>
            <Text style={styles.label}>Dodaj wlasne cwiczenie</Text>
            <TextInput
              style={styles.input}
              placeholder="Nazwa cwiczenia"
              value={customExercise}
              onChangeText={setCustomExercise}
            />
            <TouchableOpacity style={styles.addExerciseButton} onPress={addCustomExerciseToBase}>
              <Text style={styles.addExerciseText}>Dodaj do bazy</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {selectedExercise && (
        <>
          <Text style={styles.sectionTitle}>Serie</Text>
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

          <TouchableOpacity style={styles.addToWorkoutButton} onPress={addExerciseToWorkout}>
            <Text style={styles.addToWorkoutText}>Dodaj cwiczenie do treningu</Text>
          </TouchableOpacity>
        </>
      )}

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
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  choiceWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  choiceButton: {
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  choiceButtonActive: { backgroundColor: '#007AFF' },
  choiceText: { color: '#333' },
  choiceTextActive: { color: '#fff', fontWeight: '600' },
  customBox: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  exerciseBox: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 12 },
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
  addSetButton: { marginTop: 12, alignItems: 'center', paddingVertical: 8 },
  addSetText: { color: '#007AFF', fontWeight: '600' },
  addExerciseButton: {
    backgroundColor: '#eef4ff',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  addExerciseText: { color: '#1f5fbf', fontWeight: '600' },
  addToWorkoutButton: {
    backgroundColor: '#eef4ff',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  addToWorkoutText: { color: '#1f5fbf', fontWeight: '600' },
  summaryBox: { backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 16 },
  summaryTitle: { fontWeight: '600', marginBottom: 8 },
  summaryItem: { marginBottom: 10 },
  summaryName: { fontWeight: '600' },
  summarySet: { marginTop: 4 },
});
