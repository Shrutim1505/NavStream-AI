import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ship, MapPin, Clock, Fuel, Shield, ArrowRight } from 'lucide-react-native';
import PortSelector from '@/components/PortSelector';
import OptimizationForm from '@/components/OptimizationForm';
import { optimizeRoute, Voyage } from '@/services/api';
import { useRouter } from 'expo-router';

export default function RouteOptimizer() {
  const [departurePort, setDeparturePort] = useState(null);
  const [destinationPort, setDestinationPort] = useState(null);
  const [optimizationParams, setOptimizationParams] = useState({
    fuelEfficiency: 50,
    travelTime: 50,
    routeSafety: 50,
  });
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [result, setResult] = useState<Voyage | null>(null);
  const router = useRouter();

  const handleOptimizeRoute = async () => {
    if (!departurePort || !destinationPort) {
      Alert.alert('Missing Information', 'Please select both departure and destination ports.');
      return;
    }

    setIsOptimizing(true);
    setResult(null);
    try {
      const routeData = await optimizeRoute({
        departurePort: departurePort.name,
        destinationPort: destinationPort.name,
        parameters: optimizationParams,
      });
      setResult(routeData);
      Alert.alert('Route Optimized', 'Your route has been calculated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to optimize route. Please try again.');
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Ship size={32} color="#0891B2" />
          <Text style={styles.title}>Route Optimizer</Text>
          <Text style={styles.subtitle}>Plan your optimal shipping route</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Ports</Text>
          <PortSelector
            label="Departure Port"
            icon={<MapPin size={20} color="#059669" />}
            selectedPort={departurePort}
            onPortSelect={setDeparturePort}
            placeholder="Select departure port"
          />
          <PortSelector
            label="Destination Port"
            icon={<MapPin size={20} color="#DC2626" />}
            selectedPort={destinationPort}
            onPortSelect={setDestinationPort}
            placeholder="Select destination port"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Optimization Parameters</Text>
          <OptimizationForm
            params={optimizationParams}
            onParamsChange={setOptimizationParams}
          />
        </View>

        <TouchableOpacity
          style={[styles.optimizeButton, isOptimizing && styles.optimizeButtonDisabled]}
          onPress={handleOptimizeRoute}
          disabled={isOptimizing}
        >
          <Text style={styles.optimizeButtonText}>
            {isOptimizing ? 'Optimizing Route...' : 'Optimize Route'}
          </Text>
          <ArrowRight size={20} color="#FFFFFF" />
        </TouchableOpacity>

        {result && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>Optimized Route Summary</Text>
            <Text style={styles.resultLabel}>Route:</Text>
            <Text style={styles.resultValue}>{result.departurePort} → {result.destinationPort}</Text>
            <Text style={styles.resultLabel}>Distance:</Text>
            <Text style={styles.resultValue}>{result.distance} nm</Text>
            <Text style={styles.resultLabel}>Estimated Time:</Text>
            <Text style={styles.resultValue}>{result.estimatedTime} hours</Text>
            <Text style={styles.resultLabel}>Fuel Consumption:</Text>
            <Text style={styles.resultValue}>{result.fuelConsumption} tons</Text>
            <TouchableOpacity
              style={styles.viewVoyageButton}
              onPress={() => router.push(`/voyage/${result._id}`)}
            >
              <Text style={styles.viewVoyageButtonText}>View Voyage</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.infoCards}>
          <View style={styles.infoCard}>
            <Fuel size={24} color="#EA580C" />
            <Text style={styles.infoCardTitle}>Fuel Efficiency</Text>
            <Text style={styles.infoCardDescription}>
              Optimize for fuel consumption and cost savings
            </Text>
          </View>
          <View style={styles.infoCard}>
            <Clock size={24} color="#7C3AED" />
            <Text style={styles.infoCardTitle}>Travel Time</Text>
            <Text style={styles.infoCardDescription}>
              Minimize journey duration for faster delivery
            </Text>
          </View>
          <View style={styles.infoCard}>
            <Shield size={24} color="#059669" />
            <Text style={styles.infoCardTitle}>Route Safety</Text>
            <Text style={styles.infoCardDescription}>
              Avoid dangerous weather and high-risk areas
            </Text>
          </View>
        </View>
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
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 5,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 15,
  },
  optimizeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0891B2',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginVertical: 20,
    gap: 10,
  },
  optimizeButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  optimizeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  resultCard: {
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
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0891B2',
    marginBottom: 10,
  },
  resultLabel: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 10,
    fontWeight: '600',
  },
  resultValue: {
    fontSize: 16,
    color: '#0891B2',
    fontWeight: '500',
  },
  viewVoyageButton: {
    marginTop: 20,
    backgroundColor: '#0891B2',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewVoyageButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  infoCards: {
    gap: 15,
    marginBottom: 30,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 10,
  },
  infoCardDescription: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 5,
    lineHeight: 20,
  },
});