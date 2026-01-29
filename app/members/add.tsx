import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Button,
  Input,
  Header,
  DatePicker,
  Dropdown,
  ImagePickerComponent,
} from '../../src/components';
import { staticData } from '../../src/utils/staticData';
import { GROUPS, GENDERS } from '../../src/utils/constants';

export default function AddMemberScreen() {
  const router = useRouter();
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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.contact.trim() || !formData.gender || !formData.group) {
      Alert.alert('Error', 'Please fill in all required fields (Name, Gender, Contact, Group)');
      return;
    }

    if (formData.contact.length < 10) {
      Alert.alert('Error', 'Please enter a valid contact number');
      return;
    }

    setLoading(true);

    try {
      await staticData.addMember({
        name: formData.name.trim(),
        gender: formData.gender,
        dob: formData.dob ? formData.dob.toISOString() : null,
        anniversary: formData.anniversary ? formData.anniversary.toISOString() : null,
        contact: formData.contact.trim(),
        address: formData.address.trim(),
        group: formData.group,
        photo: formData.photo,
      });

      Alert.alert('Success', 'Member added successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.detail || 'Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Header
        title="Add Member"
        showBack
        onBackPress={() => router.back()}
        rightComponent={
          <Button
            title="Save"
            onPress={handleSubmit}
            loading={loading}
            style={styles.saveButton}
            textStyle={styles.saveButtonText}
          />
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
            title="Add Member"
            onPress={handleSubmit}
            loading={loading}
            fullWidth
            style={styles.submitButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
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
  submitButton: {
    marginTop: 8,
    marginBottom: 24,
  },
});