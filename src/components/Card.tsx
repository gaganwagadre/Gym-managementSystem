import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CardProps {
  title: string;
  value: string | number;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;                    
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
  title,
  value,
  icon,
  color = '#4A90E2',              
  onPress,
}) => {
  const Content = () => (
    <View style={styles.card}>
      <View style={styles.row}>
        {icon && (
          <View style={[styles.iconBox, { backgroundColor: color + '20' }]}>
            <Ionicons name={icon} size={22} color={color} />
          </View>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>

      <Text style={[styles.value, { color }]}>{value}</Text>
    </View>
  );

  return onPress ? (
    <TouchableOpacity activeOpacity={0.7} style={styles.container} onPress={onPress}>
      <Content />
    </TouchableOpacity>
  ) : (
    <View style={styles.container}>
      <Content />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  title: {
    color: '#6C757D',
    fontSize: 13,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 4,
  },
});
