import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ship, MapPin, ArrowRight } from 'lucide-react-native';
import PortSelector from '@/components/PortSelector';
import OptimizationForm from '@/components/OptimizationForm';
import { optimizeRoute, Voyage, Port } from '@/services/api';

export default function RouteOptimizer() {
  const [departurePort, setDeparturePort] = useState<Port | null>(null);
  const [destinationPort, setDestinationPort] = useState<Port | null>(null);
  const [optimizationParams, setOptimizationParams] = useState({
    fuelEfficiency: 50,
    travelTime: 50,
    routeSafety: 50,
  });
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [result, setResult] = useState<Voyage | null>(null);

  // Prevent selecting the same port for both fields
  const handleDepartureSelect = useCallback((port: Port) => {
    if (destinationPort && port.id === destinationPort.id) {
      Alert.alert('Invalid Selection', 'Departure and destination ports must be different.');
      return;
    }
    setDeparturePort(port);
  }, [destinationPort]);

  const handleDestinationSelect = useCallback((port: Port) => {
    if (departurePort && port.id === departurePort.id) {
      Alert.alert('Invalid Selection', 'Departure and destination ports must be different.');
      return;
    }
    setDestinationPort(port);
  }, [departurePort]);

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
          <Text style={styles.title}>NavStream-AI</Text>
          <Text style={styles.subtitle}>Plan your optimal shipping route</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Ports</Text>
          <PortSelector
            label="Departure Port"
            icon={<MapPin size={20} color="#059669" />}
            selectedPort={departurePort}
            onPortSelect={handleDepartureSelect}
            placeholder="Select departure port"
          />
          <PortSelector
            label="Destination Port"
            icon={<MapPin size={20} color="#DC2626" />}
            selectedPort={destinationPort}
            onPortSelect={handleDestinationSelect}
            placeholder="Select destination port"
          />
          <View style={styles.selectedSummary}>
            <Text style={styles.selectedText}>
              Departure: <Text style={styles.selectedPort}>{departurePort?.name || '-'}</Text>
            </Text>
            <Text style={styles.selectedText}>
              Destination: <Text style={styles.selectedPort}>{destinationPort?.name || '-'}</Text>
            </Text>
          </View>
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
  selectedSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 5,
    paddingHorizontal: 4,
  },
  selectedText: {
    fontSize: 15,
    color: '#64748B',
  },
  selectedPort: {
    color: '#0891B2',
    fontWeight: '600',
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
});