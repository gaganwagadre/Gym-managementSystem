import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Header, Sidebar, FormField, PrimaryButton } from '../src/components';
import { useAuthStore } from '../src/store/authStore';
import { ROUTES } from '../src/utils/routes';

interface ProfileData {
  username: string;
  role: string;
  email: string;
  phone: string;
  fullName: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { staff, logout, updateProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    username: staff?.username || '',
    role: staff?.role || '',
    email: '',
    phone: '',
    fullName: '',
  });
  const [originalData, setOriginalData] = useState<ProfileData>({
    username: staff?.username || '',
    role: staff?.role || '',
    email: '',
    phone: '',
    fullName: '',
  });
  const [sidebarVisible, setSidebarVisible] = useState(false);

  useEffect(() => {
    // Load profile data from auth store and fill in defaults if needed
    const loadProfileData = () => {
      const data = {
        username: staff?.username || '',
        role: staff?.role || '',
        email: staff?.email || 'user@fitgym.com',
        phone: staff?.phone || '+91 9876543210',
        fullName: staff?.fullName || staff?.username || 'User',
      };
      setProfileData(data);
      setOriginalData(data);
    };

    loadProfileData();
  }, [staff]);

  const handleSave = async () => {
    try {
      // Update the profile in the auth store
      await updateProfile({
        username: profileData.username,
        email: profileData.email,
        phone: profileData.phone,
        fullName: profileData.fullName,
      });
      
      setOriginalData(profileData);
      setIsEditing(false);
      
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setProfileData(originalData);
    setIsEditing(false);
  };

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

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Header
        title="Profile"
        showMenu
        onMenuPress={() => setSidebarVisible(true)}
        rightComponent={
          <TouchableOpacity onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        }
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={100} color="#4A90E2" />
          </View>
          <Text style={styles.welcomeText}>Welcome back!</Text>
          <Text style={styles.usernameText}>{profileData.fullName || profileData.username}</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            {!isEditing && (
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => setIsEditing(true)}
              >
                <Ionicons name="pencil" size={20} color="#4A90E2" />
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>

          <FormField
            label="Full Name"
            value={profileData.fullName}
            onChangeText={(text) => setProfileData(prev => ({ ...prev, fullName: text }))}
            editable={isEditing}
            style={!isEditing && styles.disabledInput}
          />

          <FormField
            label="Username"
            value={profileData.username}
            onChangeText={(text) => setProfileData(prev => ({ ...prev, username: text }))}
            editable={isEditing}
            style={!isEditing && styles.disabledInput}
          />

          <FormField
            label="Email"
            value={profileData.email}
            onChangeText={(text) => setProfileData(prev => ({ ...prev, email: text }))}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={isEditing}
            style={!isEditing && styles.disabledInput}
          />

          <FormField
            label="Phone"
            value={profileData.phone}
            onChangeText={(text) => setProfileData(prev => ({ ...prev, phone: text }))}
            keyboardType="phone-pad"
            editable={isEditing}
            style={!isEditing && styles.disabledInput}
          />

          <FormField
            label="Role"
            value={profileData.role}
            editable={false}
            style={styles.disabledInput}
          />

          {isEditing && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <PrimaryButton
                label="Save Changes"
                onPress={handleSave}
                style={styles.saveButton}
              />
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push(ROUTES.DASHBOARD)}>
          <Ionicons name="home-outline" size={24} color="#6C757D" />
          <Text style={styles.navText}>Home</Text>
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
          <Ionicons name="person" size={24} color="#4A90E2" />
          <Text style={[styles.navText, styles.navTextActive]}>Profile</Text>
        </TouchableOpacity>
      </View>

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
    paddingBottom: 100,
  },
  profileHeader: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 16,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 16,
    color: '#6C757D',
    marginBottom: 4,
  },
  usernameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#F8F9FA',
  },
  editButtonText: {
    marginLeft: 4,
    color: '#4A90E2',
    fontWeight: '600',
  },
  disabledInput: {
    backgroundColor: '#F8F9FA',
    color: '#6C757D',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cancelButtonText: {
    color: '#6C757D',
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
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
});