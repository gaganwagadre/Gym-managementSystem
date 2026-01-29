import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

interface ImagePickerComponentProps {
  label?: string;
  value: string | null;
  onChange: (base64: string) => void;
  error?: string;
}

export const ImagePickerComponent: React.FC<ImagePickerComponentProps> = ({
  label,
  value,
  onChange,
  error,
}) => {
  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera roll permissions to upload images.');
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        onChange(`data:image/jpeg;base64,${result.assets[0].base64}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera permissions to take photos.');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        onChange(`data:image/jpeg;base64,${result.assets[0].base64}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const showOptions = () => {
    Alert.alert(
      'Choose Photo',
      'Select an option',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Library', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={[
          styles.imageContainer,
          error && styles.imageContainerError,
        ]}
        onPress={showOptions}
      >
        {value ? (
          <Image source={{ uri: value }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="camera-outline" size={40} color="#6C757D" />
            <Text style={styles.placeholderText}>Tap to add photo</Text>
          </View>
        )}
      </TouchableOpacity>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C3E50',
    marginBottom: 8,
  },
  imageContainer: {
    width: 150,
    height: 150,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#DDD',
    borderStyle: 'dashed',
    overflow: 'hidden',
    alignSelf: 'center',
  },
  imageContainerError: {
    borderColor: '#E74C3C',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  placeholderText: {
    fontSize: 14,
    color: '#6C757D',
    marginTop: 8,
  },
  error: {
    fontSize: 12,
    color: '#E74C3C',
    marginTop: 4,
    textAlign: 'center',
  },
});