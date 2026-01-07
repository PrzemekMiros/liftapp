import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useWorkout } from '../../context/WorkoutContext';

export default function LibraryScreen() {
  const { exercises } = useWorkout();

  return (
    <View style={styles.container}>
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.part}>{item.bodyPart}</Text>
            </View>
            <TouchableOpacity style={styles.addButton}>
              <Text style={{ color: 'white' }}>+</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  item: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderColor: '#eee', alignItems: 'center' },
  name: { fontSize: 16, fontWeight: 'bold' },
  part: { color: '#666' },
  addButton: { backgroundColor: '#007AFF', width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' }
});