import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Bell, Globe, Shield, CircleHelp as HelpCircle, LogOut, ChevronRight, Settings as SettingsIcon } from 'lucide-react-native';

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [trackLocation, setTrackLocation] = useState(false);
  const [autoOptimize, setAutoOptimize] = useState(true);

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: <User size={20} color="#64748B" />, title: 'Profile Settings', hasArrow: true },
        { icon: <Shield size={20} color="#64748B" />, title: 'Privacy & Security', hasArrow: true },
        { icon: <Bell size={20} color="#64748B" />, title: 'Notifications', hasSwitch: true, value: notifications, onChange: setNotifications },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: <Globe size={20} color="#64748B" />, title: 'Language & Region', hasArrow: true, subtitle: 'English (US)' },
        { icon: <SettingsIcon size={20} color="#64748B" />, title: 'Auto-Optimize Routes', hasSwitch: true, value: autoOptimize, onChange: setAutoOptimize },
        { icon: <Shield size={20} color="#64748B" />, title: 'Location Tracking', hasSwitch: true, value: trackLocation, onChange: setTrackLocation },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: <HelpCircle size={20} color="#64748B" />, title: 'Help Center', hasArrow: true },
        { icon: <User size={20} color="#64748B" />, title: 'Contact Support', hasArrow: true },
      ],
    },
  ];

  const renderSettingItem = (item, index) => (
    <TouchableOpacity key={index} style={styles.settingItem}>
      <View style={styles.settingLeft}>
        {item.icon}
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          {item.subtitle && (
            <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
          )}
        </View>
      </View>
      <View style={styles.settingRight}>
        {item.hasSwitch && (
          <Switch
            value={item.value}
            onValueChange={item.onChange}
            trackColor={{ false: '#E2E8F0', true: '#0891B2' }}
            thumbColor={item.value ? '#FFFFFF' : '#FFFFFF'}
          />
        )}
        {item.hasArrow && (
          <ChevronRight size={20} color="#94A3B8" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <SettingsIcon size={32} color="#0891B2" />
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Manage your app preferences</Text>
        </View>

        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <User size={32} color="#FFFFFF" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Captain Smith</Text>
            <Text style={styles.profileEmail}>captain.smith@maritime.com</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => 
                renderSettingItem(item, itemIndex)
              )}
            </View>
          </View>
        ))}

        {/* App Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.sectionContent}>
            <View style={styles.appInfo}>
              <Text style={styles.appName}> NavStream-AI</Text>
              <Text style={styles.appVersion}>Version 1.0.0</Text>
              <Text style={styles.appDescription}>
                Optimize your shipping routes for maximum efficiency, cost savings, and safety.
              </Text>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <LogOut size={20} color="#DC2626" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2025 NavStream-AI. All rights reserved.
          </Text>
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0891B2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 15,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  profileEmail: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  editButton: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#0891B2',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 10,
    marginLeft: 5,
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 15,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  settingRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  appInfo: {
    padding: 20,
    alignItems: 'center',
  },
  appName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  appVersion: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 5,
  },
  appDescription: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginVertical: 20,
    gap: 10,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
});