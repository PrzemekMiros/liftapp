import React, { useState } from 'react';
import { Text, View, StyleSheet, FlatList, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useWorkout } from '../../../context/WorkoutContext';

const ACCENT = '#D7FB00';
const BG = '#171E2E';
const CARD = '#0E121C';
const TEXT = '#FFFFFF';

export default function ExerciseScreen() {
  const router = useRouter();
  const { id, workoutId } = useLocalSearchParams();
  const exerciseId = Array.isArray(id) ? id[0] : id;
  const workoutKey = Array.isArray(workoutId) ? workoutId[0] : workoutId;
  const { workouts, addSetToExercise, removeSetFromExercise } = useWorkout();
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');

  const activeWorkout = workouts.find((workout) => workout.id === workoutKey);
  const activeExercise = activeWorkout?.exercises.find((exercise) => exercise.id === exerciseId);

  if (!activeWorkout || !activeExercise) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.header}>Nie znaleziono cwiczenia</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButtonContainer}>
          <Text style={styles.backLink}>← Lista cwiczen</Text>
        </TouchableOpacity>
        <Text style={styles.header}>{activeExercise.name}</Text>
        <View style={styles.row}>
          <TextInput
            style={styles.inputSmall}
            placeholder="Powt"
            keyboardType="numeric"
            value={reps}
            onChangeText={setReps}
            placeholderTextColor="#666"
          />
          <TextInput
            style={styles.inputSmall}
            placeholder="kg"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
            placeholderTextColor="#666"
          />
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => {
              if (!reps || !weight) {
                return;
              }
              addSetToExercise(activeWorkout.id, activeExercise.id, reps, weight);
              setReps('');
              setWeight('');
            }}
          >
            <Text style={styles.addBtnText}>DODAJ</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={activeExercise.sets}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.setRow}
              onPress={() => removeSetFromExercise(activeWorkout.id, activeExercise.id, item.id)}
            >
              <Text style={styles.setText}>SERIA {index + 1}</Text>
              <Text style={styles.setVal}>
                {item.weight} kg × {item.reps}
              </Text>
              <Text style={{ color: 'red', fontSize: 10 }}>USUN</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  innerContainer: { flex: 1, paddingHorizontal: 20 },
  header: { fontSize: 28, fontWeight: '600', color: TEXT, marginBottom: 15 },
  backButtonContainer: { marginTop: 35, marginBottom: 10, paddingVertical: 15 },
  backLink: { color: ACCENT, fontWeight: '600', fontSize: 16 },
  inputSmall: {
    backgroundColor: CARD,
    color: TEXT,
    padding: 15,
    borderRadius: 12,
    width: 75,
    marginRight: 10,
    textAlign: 'center',
  },
  row: { flexDirection: 'row', marginBottom: 20 },
  addBtn: { flex: 1, backgroundColor: ACCENT, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  addBtnText: { fontWeight: '600', color: BG },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 18,
    backgroundColor: CARD,
    borderRadius: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  setText: { color: '#666', fontWeight: '600' },
  setVal: { color: TEXT, fontWeight: '600', fontSize: 16 },
});
