import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getVoyages, Voyage } from '@/services/api';
import { useRouter } from 'expo-router';

export default function VoyageHistory() {
  const [voyages, setVoyages] = useState<Voyage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    getVoyages()
      .then(data => {
        setVoyages(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load voyages');
        setLoading(false);
      });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Voyage History</Text>
          <Text style={styles.subtitle}>All optimized voyages</Text>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="#0891B2" style={{ marginVertical: 40 }} />
        ) : error ? (
          <Text style={{ color: 'red', textAlign: 'center', marginVertical: 40 }}>{error}</Text>
        ) : voyages.length === 0 ? (
          <Text style={{ textAlign: 'center', marginVertical: 40 }}>No voyages found.</Text>
        ) : (
          <View style={styles.voyagesList}>
            {voyages.map((voyage) => (
              <TouchableOpacity key={voyage._id} style={styles.voyageCard} onPress={() => router.push(`/voyage/${voyage._id}`)}>
                <View style={styles.voyageHeader}>
                  <Text style={styles.voyageRoute}>{voyage.departurePort} → {voyage.destinationPort}</Text>
                  <Text style={styles.voyageDate}>{voyage.createdAt ? new Date(voyage.createdAt).toLocaleString() : ''}</Text>
                </View>
                <View style={styles.voyageStats}>
                  <View style={styles.voyageStat}>
                    <Text style={styles.voyageStatValue}>{voyage.distance} nm</Text>
                    <Text style={styles.voyageStatLabel}>Distance</Text>
                  </View>
                  <View style={styles.voyageStat}>
                    <Text style={styles.voyageStatValue}>{voyage.estimatedTime} h</Text>
                    <Text style={styles.voyageStatLabel}>Est. Time</Text>
                  </View>
                  <View style={styles.voyageStat}>
                    <Text style={styles.voyageStatValue}>${voyage.savings?.toLocaleString()}</Text>
                    <Text style={styles.voyageStatLabel}>Savings</Text>
                  </View>
                  <View style={styles.voyageStat}>
                    <Text style={styles.voyageStatValue}>{voyage.efficiency}%</Text>
                    <Text style={styles.voyageStatLabel}>Efficiency</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 5,
  },
  voyagesList: {
    gap: 15,
    marginBottom: 30,
  },
  voyageCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  voyageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  voyageRoute: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  voyageDate: {
    fontSize: 12,
    color: '#64748B',
  },
  voyageStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
  },
  voyageStat: {
    alignItems: 'center',
    flex: 1,
  },
  voyageStatValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0891B2',
  },
  voyageStatLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
}); 