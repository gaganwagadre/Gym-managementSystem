import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Button,
  Input,
  Header,
  DatePicker,
  Dropdown,
  ImagePickerComponent,
  Popup,
} from '../../src/components';
import { staticData } from '../../src/utils/staticData';
import { GROUPS, GENDERS } from '../../src/utils/constants';

export default function MemberDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    dob: null as Date | null,
    anniversary: null as Date | null,
    contact: '',
    address: '',
    group: '',
    photo: '',
  });

  useEffect(() => {
    loadMember();
  }, []);

  const loadMember = async () => {
    try {
      const member = await staticData.getMemberById(String(id));
      setFormData({
        name: member.name,
        gender: member.gender,
        dob: member.dob ? new Date(member.dob) : null,
        anniversary: member.anniversary ? new Date(member.anniversary) : null,
        contact: member.contact,
        address: member.address,
        group: member.group,
        photo: member.photo,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to load member details');
      router.back();
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.contact.trim() || !formData.gender || !formData.group) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      await staticData.updateMember(String(id), {
        name: formData.name.trim(),
        gender: formData.gender,
        dob: formData.dob ? formData.dob.toISOString() : null,
        anniversary: formData.anniversary ? formData.anniversary.toISOString() : null,
        contact: formData.contact.trim(),
        address: formData.address.trim(),
        group: formData.group,
        photo: formData.photo,
      });

      Alert.alert('Success', 'Member updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.detail || 'Failed to update member');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);

    try {
      await staticData.deleteMember(String(id));
      Alert.alert('Success', 'Member deleted successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.detail || 'Failed to delete member');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Header
        title={isEditing ? 'Edit Member' : 'Member Details'}
        showBack
        onBackPress={() => router.back()}
        rightComponent={
          isEditing ? (
            <Button
              title="Save"
              onPress={handleSave}
              loading={loading}
              style={styles.saveButton}
              textStyle={styles.saveButtonText}
            />
          ) : (
            <Button
              title="Edit"
              onPress={() => setIsEditing(true)}
              variant="outline"
              style={styles.editButton}
              textStyle={styles.editButtonText}
            />
          )
        }
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {isEditing ? (
            <>
              <ImagePickerComponent
                label="Member Photo"
                value={formData.photo}
                onChange={(photo) => setFormData({ ...formData, photo })}
              />

              <Input
                label="Name *"
                placeholder="Enter name"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />

              <Dropdown
                label="Gender *"
                value={formData.gender}
                onChange={(value) => setFormData({ ...formData, gender: value })}
                options={GENDERS}
                placeholder="Select gender"
              />

              <DatePicker
                label="Date of Birth"
                value={formData.dob}
                onChange={(date) => setFormData({ ...formData, dob: date })}
                placeholder="Select date of birth"
              />

              <DatePicker
                label="Anniversary"
                value={formData.anniversary}
                onChange={(date) => setFormData({ ...formData, anniversary: date })}
                placeholder="Select anniversary date"
              />

              <Input
                label="Contact *"
                placeholder="9999999999"
                value={formData.contact}
                onChangeText={(text) => setFormData({ ...formData, contact: text })}
                keyboardType="phone-pad"
                maxLength={10}
              />

              <Input
                label="Address"
                placeholder="Enter address"
                value={formData.address}
                onChangeText={(text) => setFormData({ ...formData, address: text })}
                multiline
                numberOfLines={3}
              />

              <Dropdown
                label="Group *"
                value={formData.group}
                onChange={(value) => setFormData({ ...formData, group: value })}
                options={GROUPS}
                placeholder="Select group"
              />

              <Button
                title="Delete Member"
                onPress={() => setShowDeleteConfirm(true)}
                variant="danger"
                fullWidth
                style={styles.deleteButton}
              />
            </>
          ) : (
            <>
              <View style={styles.photoSection}>
                {formData.photo ? (
                  <Image source={{ uri: formData.photo }} style={styles.photo} />
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <Text style={styles.photoPlaceholderText}>No Photo</Text>
                  </View>
                )}
              </View>

              <View style={styles.detailCard}>
                <Text style={styles.label}>Name</Text>
                <Text style={styles.value}>{formData.name}</Text>
              </View>

              <View style={styles.detailCard}>
                <Text style={styles.label}>Gender</Text>
                <Text style={styles.value}>{formData.gender}</Text>
              </View>

              {formData.dob && (
                <View style={styles.detailCard}>
                  <Text style={styles.label}>Date of Birth</Text>
                  <Text style={styles.value}>
                    {formData.dob.toLocaleDateString('en-GB')}
                  </Text>
                </View>
              )}

{/* check Ci CD pipeline  */}
              {formData.anniversary && (
                <View style={styles.detailCard}>
                  <Text style={styles.label}>Anniversary</Text>
                  <Text style={styles.value}>
                    {formData.anniversary.toLocaleDateString('en-GB')}
                  </Text>
                </View>
              )}

              <View style={styles.detailCard}>
                <Text style={styles.label}>Contact</Text>
                <Text style={styles.value}>{formData.contact}</Text>
              </View>

              {formData.address && (
                <View style={styles.detailCard}>
                  <Text style={styles.label}>Address</Text>
                  <Text style={styles.value}>{formData.address}</Text>
                </View>
              )}

              <View style={styles.detailCard}>
                <Text style={styles.label}>Group</Text>
                <Text style={styles.value}>{formData.group}</Text>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <Popup
        visible={showDeleteConfirm}
        title="Delete Member"
        message="Are you sure you want to delete this member? This action cannot be undone."
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        confirmText="Delete"
        type="error"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
  },
  saveButtonText: {
    fontSize: 14,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  editButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  deleteButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  photoPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPlaceholderText: {
    color: '#6C757D',
    fontSize: 16,
  },
  detailCard: {
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
  label: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
});
