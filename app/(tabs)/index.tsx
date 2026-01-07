import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useWorkout } from '../../context/WorkoutContext';

const ACCENT = '#D7FB00';
const BG = '#171E2E';
const CARD = '#0E121C';
const TEXT = '#FFFFFF';

export default function HistoryScreen() {
  const router = useRouter();
  const { workouts, addWorkout, removeWorkout } = useWorkout();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.navBar}>
          <Text style={styles.logoText}>
            LIFT<Text style={{ color: ACCENT }}>NOTE</Text>
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={[styles.navBtnText, { color: ACCENT }]}>TRENINGI</Text>
            <Text
              style={styles.navBtnText}
              onPress={() => router.push('/(tabs)/stats')}
            >
              PROGRES
            </Text>
          </View>
        </View>

        <View style={styles.historyIntro}>
          <Text style={styles.historyDescription}>
            Zapisuj sesje treningowe, ciezar, ilosc serii oraz powtorzen.
            Sledz regularnosc i postepy.
          </Text>
        </View>
        <Text style={styles.header}>Treningi</Text>
        <FlatList
          data={workouts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/workout/${item.id}`)}
              onLongPress={() => removeWorkout(item.id)}
            >
              <View>
                <Text style={styles.cardTitle}>{item.date}</Text>
                <Text style={styles.cardSub}>{item.exercises.length} cwiczen</Text>
              </View>
              <Text style={{ color: ACCENT }}>❯</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          const workout = addWorkout();
          router.push(`/workout/${workout.id}`);
        }}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  innerContainer: { flex: 1, paddingHorizontal: 20 },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 30,
    paddingBottom: 10,
  },
  logoText: { color: TEXT, fontSize: 24, fontWeight: '600', letterSpacing: -1 },
  navBtnText: { color: '#666', fontWeight: '600', fontSize: 13, marginLeft: 15 },
  historyIntro: { marginBottom: 15, paddingRight: 40 },
  historyDescription: { color: '#ddd', fontSize: 16, lineHeight: 21 },
  header: { fontSize: 28, fontWeight: '600', color: TEXT, marginBottom: 15 },
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
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    backgroundColor: ACCENT,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabText: { fontSize: 35, color: BG, fontWeight: '600' },
});
