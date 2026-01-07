import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function StatsScreen() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  const calculateBMI = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (w && h) return (w / (h * h)).toFixed(1);
    return '--';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Twoje Metryki</Text>
      <View style={styles.row}>
        <TextInput 
          placeholder="Waga (kg)" 
          style={styles.input} 
          keyboardType="numeric" 
          onChangeText={setWeight}
        />
        <TextInput 
          placeholder="Wzrost (cm)" 
          style={styles.input} 
          keyboardType="numeric" 
          onChangeText={setHeight}
        />
      </View>
      <View style={styles.bmiCircle}>
        <Text style={styles.bmiValue}>{calculateBMI()}</Text>
        <Text>Twoje BMI</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  row: { flexDirection: 'row', gap: 10, marginBottom: 30 },
  input: { borderBottomWidth: 1, borderColor: '#ccc', padding: 10, width: 100, textAlign: 'center' },
  bmiCircle: { width: 150, height: 150, borderRadius: 75, borderWeight: 5, borderColor: '#007AFF', borderWidth: 5, justifyContent: 'center', alignItems: 'center' },
  bmiValue: { fontSize: 32, fontWeight: 'bold', color: '#007AFF' }
});