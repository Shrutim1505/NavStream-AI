import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { MapPin, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react-native';
import { getPorts, Port } from '@/services/api';

interface PortSelectorProps {
  label: string;
  icon: React.ReactNode;
  selectedPort: Port | null;
  onPortSelect: (port: Port) => void;
  placeholder: string;
}

export default function PortSelector({ 
  label, 
  icon, 
  selectedPort, 
  onPortSelect, 
  placeholder 
}: PortSelectorProps) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [ports, setPorts] = useState<Port[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch ports with proper error handling
  const fetchPorts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPorts();
      if (!data || !Array.isArray(data)) {
        throw new Error('Invalid data format received');
      }
      const normalizedPorts = data.map((port, index) => ({
        ...port,
        id: port.id || port._id || `port-${index}`,
        name: port.name || 'Unknown Port',
        country: port.country || 'Unknown Country'
      }));
      setPorts(normalizedPorts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load ports');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPorts();
  }, [fetchPorts]);

  const handleSelect = (port: Port) => {
    onPortSelect(port);
    setDropdownVisible(false);
  };

  const renderDropdown = () => {
    if (loading) {
      return (
        <View style={styles.dropdown}>
          <ActivityIndicator size="small" color="#0891B2" />
        </View>
      );
    }
    if (error) {
      return (
        <View style={styles.dropdown}>
          <AlertCircle size={20} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }
    return (
      <View style={styles.dropdown}>
        <FlatList
          data={ports}
          keyExtractor={item => item.id?.toString() || Math.random().toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => handleSelect(item)}
              activeOpacity={0.7}
            >
              <MapPin size={18} color="#64748B" />
              <View style={styles.portInfo}>
                <Text style={styles.portName}>{item.name}</Text>
                <Text style={styles.portCountry}>{item.country}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity 
        style={styles.selector}
        onPress={() => setDropdownVisible(v => !v)}
        activeOpacity={0.7}
      >
        <View style={styles.selectorLeft}>
          {icon}
          <Text style={[
            styles.selectorText,
            !selectedPort && styles.placeholderText
          ]}>
            {selectedPort ? selectedPort.name : placeholder}
          </Text>
        </View>
        {dropdownVisible ? (
          <ChevronUp size={20} color="#64748B" />
        ) : (
          <ChevronDown size={20} color="#64748B" />
        )}
      </TouchableOpacity>
      {dropdownVisible && (
        <View>
          <TouchableOpacity onPress={fetchPorts} style={{ alignSelf: 'flex-end', margin: 8 }}>
            <Text style={{ color: '#0891B2', fontSize: 13 }}>Refresh</Text>
          </TouchableOpacity>
          {renderDropdown()}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    zIndex: 10, // Ensure dropdown overlays other elements
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  selectorText: {
    fontSize: 16,
    color: '#1E293B',
    flex: 1,
  },
  placeholderText: {
    color: '#94A3B8',
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 4,
    maxHeight: 220,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    zIndex: 100,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
    gap: 12,
  },
  portInfo: {
    flex: 1,
  },
  portName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
  },
  portCountry: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    marginLeft: 8,
  },
});