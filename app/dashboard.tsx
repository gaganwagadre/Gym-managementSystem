import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Header, Card, Sidebar } from '../src/components';
import { useAuthStore } from '../src/store/authStore';
import { staticData } from '../src/utils/staticData';
import { ROUTES } from '../src/utils/routes';
import { Ionicons } from '@expo/vector-icons';

interface DashboardStats {
  activeMemberships: number;
  activeMembers: number;
  todayExpiry: number;
  todayCollection: number;
  weekCollection: number;
  pendingCollection: number;
  monthCollection: number;
  monthExpenses: number;
}

export default function DashboardScreen() {
  const router = useRouter();
  const { staff, logout } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({
    activeMemberships: 0,
    activeMembers: 0,
    todayExpiry: 0,
    todayCollection: 0,
    weekCollection: 0,
    pendingCollection: 0,
    monthCollection: 0,
    monthExpenses: 0,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const loadStats = async () => {
    try {
      const data = await staticData.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleLogout = async () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const confirmed = window.confirm('Are you sure you want to logout?');
      if (confirmed) {
        try {
          await logout();
          router.replace(ROUTES.ROOT);
        } catch (error) {
          console.error('Logout error:', error);
          router.replace(ROUTES.ROOT);
        }
      }
    } else {
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          { 
            text: 'Cancel', 
            style: 'cancel',
            onPress: () => {}
          },
          {
            text: 'Logout',
            style: 'destructive',
            onPress: async () => {
              try {
                await logout();
                router.replace(ROUTES.ROOT);
              } catch (error) {
                console.error('Logout error:', error);
                router.replace(ROUTES.ROOT);
              }
            },
          },
        ],
        { cancelable: true }
      );
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setSidebarVisible(true)}>
          <Ionicons name="menu" size={28} color="#FFF" />
        </TouchableOpacity>

          <Image
              source={require('@/assets/images/logo.png')}
                    style={styles.logo}
            />

        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={26} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Image
          source={require('@/assets/images/gym-banner.jpg')}
          style={styles.banner}
        />

        <View style={styles.grid}>
          <Card
            title="Active Memberships"
            value={stats.activeMemberships}
            icon="checkmark-circle"
            color="#27AE60"
          />
          <Card
            title="Active Members"
            value={stats.activeMembers}
            icon="checkmark-circle"
            color="#27AE60"
          />
          <Card
            title="Today plan expiry"
            value={stats.todayExpiry}
            icon="card"
            color="#E74C3C"
          />
          <Card
            title="Today collection"
            value={formatCurrency(stats.todayCollection)}
            icon="wallet"
            color="#3498DB"
          />
          <Card
            title="Week collection"
            value={formatCurrency(stats.weekCollection)}
            icon="wallet"
            color="#27AE60"
          />
          <Card
            title="Pending collection"
            value={formatCurrency(stats.pendingCollection)}
            icon="alert-circle"
            color="#E74C3C"
          />
          <Card
            title="Month collection"
            value={formatCurrency(stats.monthCollection)}
            icon="trending-up"
            color="#27AE60"
          />
          <Card
            title="Month expenses"
            value={formatCurrency(stats.monthExpenses)}
            icon="trending-down"
            color="#E74C3C"
          />
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push(ROUTES.DASHBOARD)}>
          <Ionicons name="home" size={24} color="#4A90E2" />
          <Text style={[styles.navText, styles.navTextActive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push(ROUTES.MEMBERS)}>
          <Ionicons name="people-outline" size={24} color="#6C757D" />
          <Text style={styles.navText}>Members</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push(ROUTES.COLLECTIONS)}>
          <Ionicons name="wallet-outline" size={24} color="#6C757D" />
          <Text style={styles.navText}>Collections</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push(ROUTES.EXPENSES)}>
          <Ionicons name="receipt-outline" size={24} color="#6C757D" />
          <Text style={styles.navText}>Expenses</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push(ROUTES.PROFILE)}>
          <Ionicons name="person-outline" size={24} color="#6C757D" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push(ROUTES.MEMBERS_ADD)}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

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
  header: {
    height: 60,
    backgroundColor: '#1E88E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },

  logo: {
    width: 130,
    height: 40,
    resizeMode: 'contain',
  },
banner: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 100,
  },
  heroImage: {
    height: 200,
    backgroundColor: '#2C3E50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroEmoji: {
    fontSize: 80,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navText: {
    fontSize: 12,
    color: '#6C757D',
    marginTop: 4,
  },
  navTextActive: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    justifyContent: 'space-between',
    gap:'13px',
  },

  card: {
    width: '48%',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    marginBottom:0,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },

  cardValue: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 6,
  },

  cardTitle: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },

});