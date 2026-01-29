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
import { PAYMENT_MODES } from '../../src/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

interface Collection {
  _id: string;
  memberName: string;
  amount: number;
  mode: string;
  date: string;
}

export default function CollectionsScreen() {
  const router = useRouter();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    memberName: '',
    amount: '',
    mode: 'cash',
  });
  const [loading, setLoading] = useState(false);

  const loadCollections = async () => {
    try {
      const data = await staticData.getCollections();
      setCollections(data);
    } catch (error) {
      console.error('Failed to load collections:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCollections();
    setRefreshing(false);
  };

  useEffect(() => {
    loadCollections();
  }, []);

  const handleAddCollection = async () => {
    if (!formData.memberName.trim() || !formData.amount) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      await staticData.addCollection({
        memberName: formData.memberName.trim(),
        amount: parseFloat(formData.amount),
        mode: formData.mode,
      });

      setShowAddModal(false);
      setFormData({ memberName: '', amount: '', mode: 'cash' });
      await loadCollections();
      Alert.alert('Success', 'Payment recorded successfully!');
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.detail || 'Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const renderCollectionItem = ({ item }: { item: Collection }) => (
    <View style={styles.collectionCard}>
      <View style={styles.collectionHeader}>
        <Text style={styles.memberName}>{item.memberName}</Text>
        <Text style={styles.amount}>{formatCurrency(item.amount)}</Text>
      </View>
      <View style={styles.collectionFooter}>
        <Text style={styles.detail}>
          <Ionicons name="card-outline" size={14} /> {item.mode.toUpperCase()}
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
        title="Collections"
        showBack
        onBackPress={() => router.back()}
        rightComponent={
          <TouchableOpacity onPress={() => setShowAddModal(true)}>
            <Ionicons name="add-circle-outline" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        }
      />

      <FlatList
        data={collections}
        renderItem={renderCollectionItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="wallet-outline" size={80} color="#DDD" />
            <Text style={styles.emptyText}>No collections recorded</Text>
          </View>
        }
      />

      <Popup
        visible={showAddModal}
        title="Record Payment"
        onClose={() => setShowAddModal(false)}
        confirmText="Save"
        onConfirm={handleAddCollection}
      >
        <View style={styles.modalContent}>
          <Input
            label="Member Name"
            placeholder="Enter member name"
            value={formData.memberName}
            onChangeText={(text) => setFormData({ ...formData, memberName: text })}
          />
          <Input
            label="Amount"
            placeholder="Enter amount"
            value={formData.amount}
            onChangeText={(text) => setFormData({ ...formData, amount: text })}
            keyboardType="numeric"
          />
          <Dropdown
            label="Payment Mode"
            value={formData.mode}
            onChange={(value) => setFormData({ ...formData, mode: value })}
            options={PAYMENT_MODES}
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
  collectionCard: {
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
  collectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  memberName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  amount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#27AE60',
  },
  collectionFooter: {
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