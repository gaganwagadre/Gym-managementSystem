import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Header, Sidebar, Card } from '../src/components';
import { staticData } from '../src/utils/staticData';

const { width } = Dimensions.get('window');

export default function ReportsScreen() {
  const router = useRouter();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalCollections: 0,
    totalExpenses: 0,
    netProfit: 0,
  });

  useEffect(() => {
    const loadReportData = async () => {
      try {
        const dashboardStats = await staticData.getDashboardStats();
        const collections = await staticData.getCollections();
        const expenses = await staticData.getExpenses();
        
        const totalCollections = collections.reduce((sum, c) => sum + c.amount, 0);
        const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
        
        setStats({
          totalMembers: dashboardStats.activeMembers,
          totalCollections,
          totalExpenses,
          netProfit: totalCollections - totalExpenses,
        });
      } catch (error) {
        console.error('Failed to load report data:', error);
      }
    };

    loadReportData();
  }, []);

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const reportCards = [
    {
      title: 'Monthly Revenue',
      value: formatCurrency(stats.totalCollections),
      icon: 'trending-up-outline' as keyof typeof Ionicons.glyphMap,
      color: '#27AE60',
    },
    {
      title: 'Monthly Expenses',
      value: formatCurrency(stats.totalExpenses),
      icon: 'trending-down-outline' as keyof typeof Ionicons.glyphMap,
      color: '#E74C3C',
    },
    {
      title: 'Net Profit',
      value: formatCurrency(stats.netProfit),
      icon: 'calculator-outline' as keyof typeof Ionicons.glyphMap,
      color: stats.netProfit >= 0 ? '#27AE60' : '#E74C3C',
    },
    {
      title: 'Total Members',
      value: stats.totalMembers,
      icon: 'people-outline' as keyof typeof Ionicons.glyphMap,
      color: '#4A90E2',
    },
  ];

  const quickReports = [
    {
      id: 'member-report',
      title: 'Member Report',
      description: 'Detailed member analytics',
      icon: 'people-outline',
    },
    {
      id: 'financial-report',
      title: 'Financial Report',
      description: 'Revenue and expense analysis',
      icon: 'bar-chart-outline',
    },
    {
      id: 'attendance-report',
      title: 'Attendance Report',
      description: 'Member attendance tracking',
      icon: 'calendar-outline',
    },
    {
      id: 'equipment-report',
      title: 'Equipment Report',
      description: 'Equipment usage and maintenance',
      icon: 'fitness-outline',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Header
        title="Reports"
        showMenu
        onMenuPress={() => setSidebarVisible(true)}
        showBack
        onBackPress={() => router.back()}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Summary Cards */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <View style={styles.cardsGrid}>
            {reportCards.map((card, index) => (
              <View key={index} style={styles.cardWrapper}>
                <Card
                  title={card.title}
                  value={card.value}
                  icon={card.icon}
                  iconColor={card.color}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Quick Reports */}
        <View style={styles.reportsSection}>
          <Text style={styles.sectionTitle}>Quick Reports</Text>
          <View style={styles.reportsContainer}>
            {quickReports.map((report) => (
              <TouchableOpacity key={report.id} style={styles.reportItem}>
                <View style={styles.reportIcon}>
                  <Ionicons name={report.icon as any} size={24} color="#4A90E2" />
                </View>
                <View style={styles.reportContent}>
                  <Text style={styles.reportTitle}>{report.title}</Text>
                  <Text style={styles.reportDescription}>{report.description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#6C757D" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Export Options */}
        <View style={styles.exportSection}>
          <Text style={styles.sectionTitle}>Export Data</Text>
          <View style={styles.exportContainer}>
            <TouchableOpacity style={styles.exportButton}>
              <Ionicons name="document-text-outline" size={24} color="#4A90E2" />
              <Text style={styles.exportText}>Export to PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.exportButton}>
              <Ionicons name="grid-outline" size={24} color="#27AE60" />
              <Text style={styles.exportText}>Export to Excel</Text>
            </TouchableOpacity>
          </View>
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
  summarySection: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  cardWrapper: {
    width: (width - 48) / 2,
  },
  reportsSection: {
    margin: 16,
    marginTop: 0,
  },
  reportsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  reportIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  reportContent: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  reportDescription: {
    fontSize: 14,
    color: '#6C757D',
  },
  exportSection: {
    margin: 16,
    marginTop: 0,
  },
  exportContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  exportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exportText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
});