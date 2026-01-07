import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useWorkout } from '../../context/WorkoutContext';

const ACCENT = '#D7FB00';
const BG = '#171E2E';
const CARD = '#0E121C';
const TEXT = '#FFFFFF';

export default function LibraryScreen() {
  const { exerciseDb, addExerciseToDb, removeExerciseFromDb } = useWorkout();
  const [newExercise, setNewExercise] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Baza cwiczen</Text>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Nowe cwiczenie..."
          placeholderTextColor="#666"
          value={newExercise}
          onChangeText={setNewExercise}
        />
        <TouchableOpacity
          style={styles.addSmall}
          onPress={() => {
            addExerciseToDb(newExercise);
            setNewExercise('');
          }}
        >
          <Text style={{ fontWeight: 'bold' }}>+</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={exerciseDb}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.dbItem}
            onLongPress={() => removeExerciseFromDb(item)}
          >
            <Text style={styles.dbItemText}>{item}</Text>
          </TouchableOpacity>
        )}
      />
      <Text style={styles.hint}>Przytrzymaj, aby usunac wlasne cwiczenie.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG, padding: 20 },
  header: { fontSize: 24, fontWeight: '600', color: TEXT, marginBottom: 15 },
  row: { flexDirection: 'row', marginBottom: 20 },
  input: { backgroundColor: CARD, color: TEXT, padding: 15, borderRadius: 12 },
  addSmall: {
    backgroundColor: ACCENT,
    width: 50,
    height: 50,
    marginLeft: 10,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dbItem: { padding: 18, borderBottomWidth: 1, borderBottomColor: '#222' },
  dbItemText: { color: TEXT, fontSize: 16 },
  hint: { color: '#666', marginTop: 10, fontSize: 12 },
});
