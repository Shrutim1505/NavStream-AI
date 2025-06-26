import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getVoyageDetails, Voyage } from '@/services/api';

export default function VoyageDetails() {
  const { voyage } = useLocalSearchParams();
  const [data, setData] = useState<Voyage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!voyage) return;
    setLoading(true);
    getVoyageDetails(voyage as string)
      .then(setData)
      .catch(() => setError('Failed to load voyage details'))
      .finally(() => setLoading(false));
  }, [voyage]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Voyage Details</Text>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="#0891B2" style={{ marginVertical: 40 }} />
        ) : error ? (
          <Text style={{ color: 'red', textAlign: 'center', marginVertical: 40 }}>{error}</Text>
        ) : data ? (
          <View style={styles.detailsCard}>
            <Text style={styles.label}>Route:</Text>
            <Text style={styles.value}>{data.departurePort} → {data.destinationPort}</Text>
            <Text style={styles.label}>Distance:</Text>
            <Text style={styles.value}>{data.distance} nm</Text>
            <Text style={styles.label}>Estimated Time:</Text>
            <Text style={styles.value}>{data.estimatedTime} hours</Text>
            <Text style={styles.label}>Fuel Consumption:</Text>
            <Text style={styles.value}>{data.fuelConsumption} tons</Text>
            <Text style={styles.label}>Savings:</Text>
            <Text style={styles.value}>${data.savings?.toLocaleString()}</Text>
            <Text style={styles.label}>Efficiency:</Text>
            <Text style={styles.value}>{data.efficiency}%</Text>
            <Text style={styles.label}>Created At:</Text>
            <Text style={styles.value}>{data.createdAt ? new Date(data.createdAt).toLocaleString() : ''}</Text>
            {/* You can add a map or route visualization here */}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E293B',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 10,
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    color: '#0891B2',
    fontWeight: '500',
  },
}); 