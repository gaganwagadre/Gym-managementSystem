import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Header, Button, Input, Dropdown, Popup } from '../../src/components';
import { staticData } from '../../src/utils/staticData';
import { EXPENSE_CATEGORIES } from '../../src/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

interface Expense {
  _id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export default function ExpensesScreen() {
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'other',
  });
  const [loading, setLoading] = useState(false);

  const loadExpenses = async () => {
    try {
      const data = await staticData.getExpenses();
      setExpenses(data);
    } catch (error) {
      console.error('Failed to load expenses:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadExpenses();
    setRefreshing(false);
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const handleAddExpense = async () => {
    if (!formData.description.trim() || !formData.amount) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      await staticData.addExpense({
        description: formData.description.trim(),
        amount: parseFloat(formData.amount),
        category: formData.category,
      });

      setShowAddModal(false);
      setFormData({ description: '', amount: '', category: 'other' });
      await loadExpenses();
      Alert.alert('Success', 'Expense recorded successfully!');
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.detail || 'Failed to record expense');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const renderExpenseItem = ({ item }: { item: Expense }) => (
    <View style={styles.expenseCard}>
      <View style={styles.expenseHeader}>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.amount}>{formatCurrency(item.amount)}</Text>
      </View>
      <View style={styles.expenseFooter}>
        <Text style={styles.detail}>
          <Ionicons name="pricetag-outline" size={14} /> {item.category.toUpperCase()}
        </Text>
        <Text style={styles.detail}>
          <Ionicons name="calendar-outline" size={14} /> {format(new Date(item.date), 'dd MMM yyyy')}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Header
        title="Expenses"
        showBack
        onBackPress={() => router.back()}
        rightComponent={
          <TouchableOpacity onPress={() => setShowAddModal(true)}>
            <Ionicons name="add-circle-outline" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        }
      />

      <FlatList
        data={expenses}
        renderItem={renderExpenseItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={80} color="#DDD" />
            <Text style={styles.emptyText}>No expenses recorded</Text>
          </View>
        }
      />

      <Popup
        visible={showAddModal}
        title="Add Expense"
        onClose={() => setShowAddModal(false)}
        confirmText="Save"
        onConfirm={handleAddExpense}
      >
        <View style={styles.modalContent}>
          <Input
            label="Description"
            placeholder="Enter description"
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
          />
          <Input
            label="Amount"
            placeholder="Enter amount"
            value={formData.amount}
            onChangeText={(text) => setFormData({ ...formData, amount: text })}
            keyboardType="numeric"
          />
          <Dropdown
            label="Category"
            value={formData.category}
            onChange={(value) => setFormData({ ...formData, category: value })}
            options={EXPENSE_CATEGORIES}
          />
        </View>
      </Popup>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContent: {
    padding: 16,
  },
  expenseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    flex: 1,
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E74C3C',
  },
  expenseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detail: {
    fontSize: 14,
    color: '#6C757D',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6C757D',
    marginTop: 16,
  },
  modalContent: {
    width: '100%',
  },
});