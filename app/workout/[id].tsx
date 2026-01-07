import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useWorkout } from '../../context/WorkoutContext';

const ACCENT = '#D7FB00';
const BG = '#171E2E';
const CARD = '#0E121C';
const TEXT = '#FFFFFF';

export default function WorkoutScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const workoutId = Array.isArray(id) ? id[0] : id;
  const {
    workouts,
    exerciseDb,
    addExerciseToDb,
    removeExerciseFromDb,
    addExerciseToWorkout,
    removeExerciseFromWorkout,
  } = useWorkout();
  const [showDbModal, setShowDbModal] = useState(false);
  const [newDbEx, setNewDbEx] = useState('');

  const activeWorkout = workouts.find((workout) => workout.id === workoutId);

  if (!activeWorkout) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.header}>Nie znaleziono treningu</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButtonContainer}>
          <Text style={styles.backLink}>← Lista treningow</Text>
        </TouchableOpacity>
        <Text style={styles.header}>{activeWorkout.date}</Text>
        <TouchableOpacity style={styles.outlineBtn} onPress={() => setShowDbModal(true)}>
          <Text style={styles.outlineBtnText}>+ DODAJ CWICZENIE</Text>
        </TouchableOpacity>
        <FlatList
          data={activeWorkout.exercises}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push({ pathname: '/workout/exercise/[id]', params: { id: item.id, workoutId } })}
              onLongPress={() => removeExerciseFromWorkout(activeWorkout.id, item.id)}
            >
              <View>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardSub}>{item.sets.length} serii</Text>
              </View>
              <Text style={{ color: ACCENT }}>❯</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <Modal visible={showDbModal} animationType="slide" transparent={true}>
        <View style={styles.modalContent}>
          <Text style={[styles.header, { marginTop: 40, paddingHorizontal: 20 }]}>
            Baza cwiczen
          </Text>
          <View style={[styles.row, { paddingHorizontal: 20 }]}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Nowe..."
              placeholderTextColor="#666"
              value={newDbEx}
              onChangeText={setNewDbEx}
            />
            <TouchableOpacity
              style={styles.addSmall}
              onPress={() => {
                if (newDbEx) {
                  addExerciseToDb(newDbEx);
                  setNewDbEx('');
                }
              }}
            >
              <Text style={{ fontWeight: 'bold' }}>+</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
            {exerciseDb.map((ex) => (
              <TouchableOpacity
                key={ex}
                style={styles.dbItem}
                onPress={() => {
                  addExerciseToWorkout(activeWorkout.id, ex);
                  setShowDbModal(false);
                }}
                onLongPress={() => removeExerciseFromDb(ex)}
              >
                <Text style={styles.dbItemText}>{ex}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={[styles.closeBtn, { margin: 20 }]}
            onPress={() => setShowDbModal(false)}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>ZAMKNIJ</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  innerContainer: { flex: 1, paddingHorizontal: 20 },
  header: { fontSize: 28, fontWeight: '600', color: TEXT, marginBottom: 15 },
  backButtonContainer: { marginTop: 35, marginBottom: 10, paddingVertical: 15 },
  backLink: { color: ACCENT, fontWeight: '600', fontSize: 16 },
  card: {
    backgroundColor: CARD,
    padding: 18,
    borderRadius: 15,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: ACCENT,
  },
  cardTitle: { color: TEXT, fontSize: 18, fontWeight: '600' },
  cardSub: { color: '#777', fontSize: 12 },
  outlineBtn: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: ACCENT,
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  outlineBtnText: { color: ACCENT, fontWeight: '600' },
  input: { backgroundColor: CARD, color: TEXT, padding: 15, borderRadius: 12 },
  row: { flexDirection: 'row', marginBottom: 20 },
  modalContent: { flex: 1, backgroundColor: BG },
  dbItem: { padding: 18, borderBottomWidth: 1, borderBottomColor: '#222' },
  dbItemText: { color: TEXT, fontSize: 16 },
  addSmall: {
    backgroundColor: ACCENT,
    width: 50,
    height: 50,
    marginLeft: 10,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtn: { backgroundColor: '#222', padding: 15, borderRadius: 15, alignItems: 'center' },
});
