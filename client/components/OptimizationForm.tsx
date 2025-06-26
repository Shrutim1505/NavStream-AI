import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Fuel, Clock, Shield } from 'lucide-react-native';

interface OptimizationFormProps {
  params: {
    fuelEfficiency: number;
    travelTime: number;
    routeSafety: number;
  };
  onParamsChange: (params: any) => void;
}

export default function OptimizationForm({ params, onParamsChange }: OptimizationFormProps) {
  const updateParam = (key: string, value: number) => {
    onParamsChange({
      ...params,
      [key]: value,
    });
  };

  const parameterConfig = [
    {
      key: 'fuelEfficiency',
      label: 'Fuel Efficiency',
      icon: <Fuel size={20} color="#EA580C" />,
      description: 'Optimize for fuel consumption',
      color: '#EA580C',
    },
    {
      key: 'travelTime',
      label: 'Travel Time',
      icon: <Clock size={20} color="#7C3AED" />,
      description: 'Minimize journey duration',
      color: '#7C3AED',
    },
    {
      key: 'routeSafety',
      label: 'Route Safety',
      icon: <Shield size={20} color="#059669" />,
      description: 'Avoid dangerous areas',
      color: '#059669',
    },
  ];

  const renderSlider = (config: any) => {
    const value = params[config.key];
    
    return (
      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>Low</Text>
        <View style={styles.sliderWrapper}>
          <View style={styles.sliderTrack} />
          <View 
            style={[
              styles.sliderFill, 
              { 
                width: `${value}%`,
                backgroundColor: config.color,
              }
            ]} 
          />
          <View style={styles.sliderButtons}>
            {[0, 25, 50, 75, 100].map((buttonValue) => (
              <TouchableOpacity
                key={buttonValue}
                style={[
                  styles.sliderButton,
                  value === buttonValue && { backgroundColor: config.color }
                ]}
                onPress={() => updateParam(config.key, buttonValue)}
              >
                <Text style={[
                  styles.sliderButtonText,
                  value === buttonValue && { color: '#FFFFFF' }
                ]}>
                  {buttonValue}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <Text style={styles.sliderLabel}>High</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {parameterConfig.map((config) => (
        <View key={config.key} style={styles.parameterContainer}>
          <View style={styles.parameterHeader}>
            <View style={styles.parameterInfo}>
              {config.icon}
              <View style={styles.parameterText}>
                <Text style={styles.parameterLabel}>{config.label}</Text>
                <Text style={styles.parameterDescription}>{config.description}</Text>
              </View>
            </View>
            <Text style={[styles.parameterValue, { color: config.color }]}>
              {params[config.key]}%
            </Text>
          </View>
          
          {renderSlider(config)}
        </View>
      ))}

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Optimization Summary</Text>
        <Text style={styles.summaryText}>
          Your route will be optimized with {params.fuelEfficiency}% focus on fuel efficiency, 
          {params.travelTime}% on travel time, and {params.routeSafety}% on safety considerations.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  parameterContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  parameterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  parameterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  parameterText: {
    flex: 1,
  },
  parameterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  parameterDescription: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  parameterValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  sliderLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  sliderWrapper: {
    flex: 1,
    height: 40,
    position: 'relative',
    justifyContent: 'center',
  },
  sliderTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
  },
  sliderFill: {
    position: 'absolute',
    height: 6,
    borderRadius: 3,
  },
  sliderButtons: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    top: -10,
  },
  sliderButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sliderButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  summaryCard: {
    backgroundColor: '#F8FAFC',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
});