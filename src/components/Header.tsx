import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  backgroundColor?: string;
  showMenu?: boolean;
  onMenuPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBackPress,
  rightComponent,
  backgroundColor = '#4A90E2',
  showMenu = false,
  onMenuPress,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor }]}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          {showBack && onBackPress && (
            <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          )}
          {showMenu && onMenuPress && !showBack && (
            <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
              <Ionicons name="menu" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          )}
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
        </View>
        {rightComponent && (
          <View style={styles.rightSection}>
            {rightComponent}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  menuButton: {
    padding: 4,
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  rightSection: {
    marginLeft: 16,
  },
});