import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Header, Sidebar } from '../src/components';

export default function SettingsScreen() {
  const router = useRouter();
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const settingsOptions = [
    {
      id: 'notifications',
      title: 'Notifications',
      icon: 'notifications-outline',
      description: 'Manage notification preferences',
    },
    {
      id: 'backup',
      title: 'Backup & Sync',
      icon: 'cloud-outline',
      description: 'Data backup and synchronization',
    },
    {
      id: 'security',
      title: 'Security',
      icon: 'shield-outline',
      description: 'Password and security settings',
    },
    {
      id: 'about',
      title: 'About',
      icon: 'information-circle-outline',
      description: 'App version and information',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Header
        title="Settings"
        showMenu
        onMenuPress={() => setSidebarVisible(true)}
        showBack
        onBackPress={() => router.back()}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.settingsContainer}>
          {settingsOptions.map((option) => (
            <TouchableOpacity key={option.id} style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Ionicons name={option.icon as any} size={24} color="#4A90E2" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>{option.title}</Text>
                <Text style={styles.settingDescription}>{option.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6C757D" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>FitGymSoftware v1.0.0</Text>
          <Text style={styles.copyrightText}>© 2024 FitGym Solutions</Text>
        </View>
      </ScrollView>

      <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  settingsContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6C757D',
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 32,
    paddingHorizontal: 16,
  },
  versionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A90E2',
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 14,
    color: '#6C757D',
  },
});