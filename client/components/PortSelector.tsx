import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, TextInput, ActivityIndicator } from 'react-native';
import { Search, MapPin, ChevronDown } from 'lucide-react-native';
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
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [ports, setPorts] = useState<Port[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getPorts()
      .then(data => {
        setPorts(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load ports');
        setLoading(false);
      });
  }, []);

  const filteredPorts = ports.filter(port =>
    port.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    port.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePortSelect = (port: Port) => {
    onPortSelect(port);
    setModalVisible(false);
    setSearchQuery('');
  };

  const renderPortItem = ({ item }: { item: Port }) => (
    <TouchableOpacity 
      style={styles.portItem}
      onPress={() => handlePortSelect(item)}
    >
      <MapPin size={20} color="#64748B" />
      <View style={styles.portInfo}>
        <Text style={styles.portName}>{item.name}</Text>
        <Text style={styles.portCountry}>{item.country}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity 
        style={styles.selector}
        onPress={() => setModalVisible(true)}
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
        <ChevronDown size={20} color="#64748B" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Port</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Search size={20} color="#64748B" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search ports..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#94A3B8"
              />
            </View>

            {loading ? (
              <ActivityIndicator size="large" color="#0891B2" style={{ marginVertical: 40 }} />
            ) : error ? (
              <Text style={{ color: 'red', textAlign: 'center', marginVertical: 40 }}>{error}</Text>
            ) : (
              <FlatList
                data={filteredPorts}
                renderItem={renderPortItem}
                keyExtractor={(item) => item.id.toString()}
                style={styles.portsList}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
  },
  closeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  closeButtonText: {
    color: '#0891B2',
    fontSize: 16,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    margin: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
  },
  portsList: {
    flex: 1,
  },
  portItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
    gap: 15,
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
});