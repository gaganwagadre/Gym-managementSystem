import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Button } from './Button';
import { Ionicons } from '@expo/vector-icons';

interface PopupProps {
  visible: boolean;
  title: string;
  message?: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  children?: React.ReactNode;
  showCancel?: boolean;
}

export const Popup: React.FC<PopupProps> = ({
  visible,
  title,
  message,
  onClose,
  onConfirm,
  confirmText = 'OK',
  cancelText = 'Cancel',
  type = 'info',
  children,
  showCancel = true,
}) => {
  const getIconName = () => {
    switch (type) {
      case 'success': return 'checkmark-circle';
      case 'error': return 'close-circle';
      case 'warning': return 'warning';
      default: return 'information-circle';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success': return '#27AE60';
      case 'error': return '#E74C3C';
      case 'warning': return '#F39C12';
      default: return '#4A90E2';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.popup}>
              <View style={styles.header}>
                <Ionicons name={getIconName()} size={48} color={getIconColor()} />
              </View>
              
              <Text style={styles.title}>{title}</Text>
              
              {message && <Text style={styles.message}>{message}</Text>}
              
              {children && <View style={styles.content}>{children}</View>}
              
              <View style={styles.buttonContainer}>
                {showCancel && (
                  <Button
                    title={cancelText}
                    onPress={onClose}
                    variant="outline"
                    style={styles.button}
                  />
                )}
                <Button
                  title={confirmText}
                  onPress={onConfirm || onClose}
                  style={[styles.button, !showCancel && styles.fullWidthButton]}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  popup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
  },
  content: {
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
  },
  fullWidthButton: {
    width: '100%',
  },
});