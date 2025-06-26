import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Navigation, RotateCcw } from 'lucide-react-native';
import MapView from '@/components/MapView';

export default function MapScreen() {
  const [showRoute, setShowRoute] = useState(true);

  // Sample route coordinates (Sydney to Tokyo)
  const routeCoordinates = [
    { latitude: -33.8688, longitude: 151.2093 }, // Sydney
    { latitude: -20.0, longitude: 160.0 }, // Waypoint 1
    { latitude: 10.0, longitude: 150.0 }, // Waypoint 2
    { latitude: 35.6762, longitude: 139.6503 }, // Tokyo
  ];

  const markers = [
    {
      coordinate: { latitude: -33.8688, longitude: 151.2093 },
      title: 'Departure Port',
      description: 'Sydney, Australia',
      color: '#059669'
    },
    {
      coordinate: { latitude: 35.6762, longitude: 139.6503 },
      title: 'Destination Port',
      description: 'Tokyo, Japan',
      color: '#DC2626'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Route Visualization</Text>
        <Text style={styles.subtitle}>Sydney → Tokyo</Text>
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
            <Text style={styles.statValue}>2,847</Text>
            <Text style={styles.statLabel}>Nautical Miles</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>6.2</Text>
            <Text style={styles.statLabel}>Days</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>$12,450</Text>
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