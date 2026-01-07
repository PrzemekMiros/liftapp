import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Dashboard() {
  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: 'Twój Dziennik' }} />
      
      {/* Sekcja Podsumowania */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Ostatni trening</Text>
        <Text style={styles.cardSubtitle}>Klatka + Triceps - Poniedziałek</Text>
        <View style={styles.statsRow}>
          <Text style={styles.statItem}>🔥 450 kcal</Text>
          <Text style={styles.statItem}>⏱️ 65 min</Text>
          <Text style={styles.statItem}>💪 12 ton</Text>
        </View>
      </View>

      {/* Szybkie Akcje */}
      <TouchableOpacity style={styles.startButton}>
        <Text style={styles.startButtonText}>ROZPOCZNIJ NOWY TRENING</Text>
      </TouchableOpacity>

      {/* Metryki Ciała - Podgląd */}
      <View style={styles.metricsContainer}>
        <Text style={styles.sectionTitle}>Postępy sylwetkowe</Text>
        <View style={styles.metricBox}>
          <Text>Waga: 82.5 kg</Text>
          <Text style={styles.trendUp}>+0.5 kg (tydz.)</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4', padding: 15 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 15, marginBottom: 20, elevation: 3 },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
  cardSubtitle: { color: '#666', marginVertical: 5 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  statItem: { fontWeight: '600' },
  startButton: { backgroundColor: '#007AFF', padding: 18, borderRadius: 12, alignItems: 'center' },
  startButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginVertical: 15 },
  metricsContainer: { marginBottom: 30 },
  metricBox: { backgroundColor: '#fff', padding: 15, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between' },
  trendUp: { color: 'green', fontWeight: 'bold' }
});