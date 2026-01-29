import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  error?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  error,
}) => {
  const [visible, setVisible] = useState(false);

  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={[
          styles.dropdown,
          error && styles.dropdownError,
        ]}
        onPress={() => setVisible(true)}
      >
        <Text style={[styles.dropdownText, !value && styles.placeholder]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#6C757D" />
      </TouchableOpacity>
      {error && <Text style={styles.error}>{error}</Text>}

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || 'Select'}</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Ionicons name="close" size={24} color="#2C3E50" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    item.value === value && styles.selectedOption,
                  ]}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      item.value === value && styles.selectedOptionText,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {item.value === value && (
                    <Ionicons name="checkmark" size={20} color="#4A90E2" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
  dropdown: {
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
  dropdownError: {
    borderColor: '#E74C3C',
  },
  dropdownText: {
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  selectedOption: {
    backgroundColor: '#EBF5FF',
  },
  optionText: {
    fontSize: 16,
    color: '#2C3E50',
  },
  selectedOptionText: {
    color: '#4A90E2',
    fontWeight: '600',
  },
});