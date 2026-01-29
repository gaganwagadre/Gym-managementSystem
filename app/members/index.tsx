import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Header } from '../../src/components';
import { staticData } from '../../src/utils/staticData';
import { ROUTES, navigationHelpers } from '../../src/utils/routes';
import { Ionicons } from '@expo/vector-icons';

interface Member {
  _id: string;
  name: string;
  contact: string;
  photo: string;
  group: string;
  gender: string;
}

export default function MembersScreen() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadMembers = async () => {
    try {
      const data = await staticData.getMembers();
      setMembers(data);
      setFilteredMembers(data);
    } catch (error) {
      console.error('Failed to load members:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMembers();
    setRefreshing(false);
  };

  useEffect(() => {
    loadMembers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = members.filter(
        (member) =>
          member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.contact.includes(searchQuery)
      );
      setFilteredMembers(filtered);
    } else {
      setFilteredMembers(members);
    }
  }, [searchQuery, members]);

  const renderMemberItem = ({ item }: { item: Member }) => (
    <TouchableOpacity
      style={styles.memberCard}
      onPress={() => router.push(navigationHelpers.getMemberDetailRoute(item._id))}
    >
      <Image
        source={
          item.photo
            ? { uri: item.photo }
            : require('../../assets/images/app-image.png')
        }
        style={styles.memberPhoto}
      />
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.name}</Text>
        <Text style={styles.memberDetail}>
          <Ionicons name="call-outline" size={14} /> {item.contact}
        </Text>
        <Text style={styles.memberDetail}>
          <Ionicons name="fitness-outline" size={14} /> {item.group}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#6C757D" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Header
        title="Members"
        showBack
        onBackPress={() => router.back()}
        rightComponent={
          <TouchableOpacity onPress={() => router.push(ROUTES.MEMBERS_ADD)}>
            <Ionicons name="add-circle-outline" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        }
      />

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#6C757D" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search members by name or contact..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#A0A0A0"
        />
      </View>

      <FlatList
        data={filteredMembers}
        renderItem={renderMemberItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={80} color="#DDD" />
            <Text style={styles.emptyText}>No members found</Text>
            <Text style={styles.emptySubtext}>Add your first member to get started</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2C3E50',
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  memberPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    backgroundColor: '#E0E0E0',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  memberDetail: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 2,
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
  emptySubtext: {
    fontSize: 14,
    color: '#95A5A6',
    marginTop: 8,
  },
});