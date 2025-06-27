import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Navigation, RotateCcw } from 'lucide-react-native';
import MapView from '@/components/MapView';

export default function MapScreen() {
  const [showRoute, setShowRoute] = useState(true);
  const [loading, setLoading] = useState(true);
  const [routeData, setRouteData] = useState<any>(null);

  useEffect(() => {
    // Replace with your actual backend endpoint
    fetch('http://localhost:3001/api/route/latest')
      .then(res => res.json())
      .then(data => {
        setRouteData(data);
        setLoading(false);
      })
      .catch(err => {
        Alert.alert('Error', 'Failed to load route data from backend.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0891B2" style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  if (!routeData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ color: '#EF4444', textAlign: 'center', marginTop: 40 }}>
          No route data available.
        </Text>
      </SafeAreaView>
    );
  }

  const { routeCoordinates, markers, stats, routeName } = routeData;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Route Visualization</Text>
        <Text style={styles.subtitle}>{routeName}</Text>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          coordinates={showRoute ? routeCoordinates : []}
          markers={markers}
          showRoute={showRoute}
          style={styles.map}
        />
      </View>

      {/* Route Information */}
      <View style={styles.routeInfo}>
        <View style={styles.routeStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.distance}</Text>
            <Text style={styles.statLabel}>Nautical Miles</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.days}</Text>
            <Text style={styles.statLabel}>Days</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>${stats.fuelCost.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Fuel Cost</Text>
          </View>
        </View>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.toggleButton, showRoute && styles.toggleButtonActive]} 
            onPress={() => setShowRoute(!showRoute)}
          >
            <Navigation size={16} color={showRoute ? "#FFFFFF" : "#0891B2"} />
            <Text style={[styles.toggleButtonText, showRoute && styles.toggleButtonTextActive]}>
              {showRoute ? 'Hide Route' : 'Show Route'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.trackButton}>
            <RotateCcw size={16} color="#FFFFFF" />
            <Text style={styles.trackButtonText}>Start Tracking</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 5,
  },
  mapContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  map: {
    flex: 1,
  },
  routeInfo: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  routeStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0891B2',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  toggleButtonActive: {
    backgroundColor: '#0891B2',
    borderColor: '#0891B2',
  },
  toggleButtonText: {
    color: '#0891B2',
    fontSize: 14,
    fontWeight: '600',
  },
  toggleButtonTextActive: {
    color: '#FFFFFF',
  },
  trackButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  trackButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});