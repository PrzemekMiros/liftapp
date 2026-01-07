import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function ActiveWorkout() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.timer}>Czas: 12:45</Text>
      
      {/* Tu docelowo będzie FlatList z dodanymi ćwiczeniami */}
      <View style={styles.exerciseBox}>
        <Text style={styles.exerciseName}>Wyciskanie hantli</Text>
        <View style={styles.setRow}>
          <Text>Seria 1: 10 x 25kg</Text>
        </View>
      </View>

      <Button title="Zakończ trening" onPress={() => router.back()} color="green" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  timer: { fontSize: 24, textAlign: 'center', fontWeight: 'bold', marginVertical: 20 },
  exerciseBox: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 20 },
  exerciseName: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  setRow: { paddingVertical: 5, borderTopWidth: 1, borderColor: '#f0f0f0' }
});