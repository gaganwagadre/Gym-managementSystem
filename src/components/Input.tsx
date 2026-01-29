import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: any;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  secureTextEntry,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.inputContainer,
        isFocused && styles.inputContainerFocused,
        error && styles.inputContainerError,
      ]}>
        {leftIcon && (
          <Ionicons name={leftIcon} size={20} color="#6C757D" style={styles.leftIcon} />
        )}
        <TextInput
          style={[styles.input, leftIcon && styles.inputWithLeftIcon]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor="#A0A0A0"
          secureTextEntry={isSecure}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsSecure(!isSecure)}
            style={styles.rightIcon}
          >
            <Ionicons
              name={isSecure ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#6C757D"
            />
          </TouchableOpacity>
        )}
        {rightIcon && !secureTextEntry && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
            <Ionicons name={rightIcon} size={20} color="#6C757D" />
          </TouchableOpacity>
        )}
      </View>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    minHeight: 48,
  },
  inputContainerFocused: {
    borderColor: '#4A90E2',
    borderWidth: 2,
  },
  inputContainerError: {
    borderColor: '#E74C3C',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2C3E50',
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  leftIcon: {
    marginLeft: 12,
  },
  rightIcon: {
    padding: 12,
  },
  error: {
    fontSize: 12,
    color: '#E74C3C',
    marginTop: 4,
    marginLeft: 4,
  },
});