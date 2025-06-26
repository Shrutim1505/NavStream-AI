import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, TrendingDown, DollarSign, Clock, Fuel, Ship } from 'lucide-react-native';
import { getAnalytics, AnalyticsData } from '@/services/api';

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getAnalytics()
      .then(data => {
        setAnalytics(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load analytics');
        setLoading(false);
      });
  }, []);

  const periods = [
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
    { key: 'quarter', label: 'Quarter' },
    { key: 'year', label: 'Year' },
  ];

  const kpiData = analytics ? [
    {
      title: 'Total Savings',
      value: `$${analytics.totalSavings.toLocaleString()}`,
      change: '+0%', // Placeholder, can be calculated if you want
      trend: 'up',
      icon: <DollarSign size={24} color="#059669" />,
      color: '#059669',
    },
    {
      title: 'Average Fuel Efficiency',
      value: `${analytics.averageFuelEfficiency}%`,
      change: '+0%',
      trend: 'up',
      icon: <Fuel size={24} color="#EA580C" />,
      color: '#EA580C',
    },
    {
      title: 'On-Time Deliveries',
      value: `${analytics.onTimeDeliveries}%`,
      change: '+0%',
      trend: 'up',
      icon: <Clock size={24} color="#7C3AED" />,
      color: '#7C3AED',
    },
    {
      title: 'Routes Optimized',
      value: `${analytics.routesOptimized}`,
      change: '+0%',
      trend: 'up',
      icon: <Ship size={24} color="#0891B2" />,
      color: '#0891B2',
    },
  ] : [];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Analytics</Text>
          <Text style={styles.subtitle}>Performance insights and metrics</Text>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.key}
              style={[
                styles.periodButton,
                selectedPeriod === period.key && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period.key)}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === period.key && styles.periodButtonTextActive,
                ]}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0891B2" style={{ marginVertical: 40 }} />
        ) : error ? (
          <Text style={{ color: 'red', textAlign: 'center', marginVertical: 40 }}>{error}</Text>
        ) : analytics && (
          <>
            {/* KPI Cards */}
            <View style={styles.kpiGrid}>
              {kpiData.map((kpi, index) => (
                <View key={index} style={styles.kpiCard}>
                  <View style={styles.kpiHeader}>
                    {kpi.icon}
                    <View style={[styles.trendIndicator, { backgroundColor: kpi.color + '20' }]}> 
                      {kpi.trend === 'up' ? (
                        <TrendingUp size={14} color={kpi.color} />
                      ) : (
                        <TrendingDown size={14} color={kpi.color} />
                      )}
                      <Text style={[styles.trendText, { color: kpi.color }]}> {kpi.change} </Text>
                    </View>
                  </View>
                  <Text style={styles.kpiValue}>{kpi.value}</Text>
                  <Text style={styles.kpiTitle}>{kpi.title}</Text>
                </View>
              ))}
            </View>

            {/* Recent Voyages */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Voyages</Text>
              <View style={styles.voyagesList}>
                {analytics.recentVoyages.map((voyage) => (
                  <View key={voyage.id} style={styles.voyageCard}>
                    <View style={styles.voyageHeader}>
                      <Text style={styles.voyageRoute}>{voyage.route}</Text>
                      <View style={[
                        styles.statusBadge,
                        voyage.status === 'completed' ? styles.statusCompleted : styles.statusInProgress
                      ]}>
                        <Text style={[
                          styles.statusText,
                          voyage.status === 'completed' ? styles.statusTextCompleted : styles.statusTextInProgress
                        ]}>
                          {voyage.status === 'completed' ? 'Completed' : 'In Progress'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.voyageStats}>
                      <View style={styles.voyageStat}>
                        <Text style={styles.voyageStatValue}>${voyage.savings?.toLocaleString()}</Text>
                        <Text style={styles.voyageStatLabel}>Savings</Text>
                      </View>
                      <View style={styles.voyageStat}>
                        <Text style={styles.voyageStatValue}>{voyage.efficiency}%</Text>
                        <Text style={styles.voyageStatLabel}>Efficiency</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}

        {/* Performance Chart Placeholder */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Trends</Text>
          <View style={styles.chartPlaceholder}>
            <TrendingUp size={48} color="#64748B" />
            <Text style={styles.chartPlaceholderText}>
              Interactive charts coming soon
            </Text>
            <Text style={styles.chartPlaceholderSubtext}>
              Detailed performance analytics and trends visualization
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
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 5,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: '#0891B2',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  periodButtonTextActive: {
    color: '#FFFFFF',
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 30,
  },
  kpiCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  kpiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 5,
  },
  kpiTitle: {
    fontSize: 14,
    color: '#64748B',
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
  voyagesList: {
    gap: 15,
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
    marginBottom: 15,
  },
  voyageRoute: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusCompleted: {
    backgroundColor: '#DCFCE7',
  },
  statusInProgress: {
    backgroundColor: '#FEF3C7',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusTextCompleted: {
    color: '#059669',
  },
  statusTextInProgress: {
    color: '#D97706',
  },
  voyageStats: {
    flexDirection: 'row',
    gap: 30,
  },
  voyageStat: {
    alignItems: 'center',
  },
  voyageStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0891B2',
  },
  voyageStatLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  chartPlaceholder: {
    backgroundColor: '#FFFFFF',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  chartPlaceholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 15,
  },
  chartPlaceholderSubtext: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 5,
    textAlign: 'center',
  },
});