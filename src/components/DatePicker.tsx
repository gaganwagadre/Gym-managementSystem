import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

interface DatePickerProps {
  label?: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  error?: string;
  minDate?: Date;
  maxDate?: Date;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Select date',
  error,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  // Simple date picker - for production, use a proper date picker library
  const handlePress = () => {
    // For now, just set today's date
    // In a real app, you'd show a native date picker modal
    onChange(new Date());
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={[
          styles.dateButton,
          error && styles.dateButtonError,
        ]}
        onPress={handlePress}
      >
        <Text style={[styles.dateText, !value && styles.placeholder]}>
          {value ? format(value, 'dd-MMM-yyyy') : placeholder}
        </Text>
        <Ionicons name="calendar-outline" size={20} color="#6C757D" />
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
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
  dateButtonError: {
    borderColor: '#E74C3C',
  },
  dateText: {
    fontSize: 16,
    color: '#2C3E50',
  },
  placeholder: {
    color: '#A0A0A0',
  },
  error: {
    fontSize: 12,
    color: '#E74C3C',
    marginTop: 4,
    marginLeft: 4,
  },
});