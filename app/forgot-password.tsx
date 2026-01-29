import { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { FitLogo, FormField, PrimaryButton } from '../src/components';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <FitLogo size="lg" />
        <View style={styles.card}>
          <Text style={styles.title}>Forgot Member Password ?</Text>
          <Text style={styles.subtitle}>Enter your email to reset your password.</Text>

          <FormField label="Email" placeholder="Enter your email" required keyboardType="email-address" value={email} onChangeText={setEmail} />

          <View style={styles.actions}>
            <PrimaryButton label="Submit" onPress={() => router.back()} style={{ flex: 1 }} />
            <Pressable onPress={() => router.back()} style={styles.cancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f6f9ff',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
    gap: 28,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    shadowColor: '#0c2c45',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1b2948',
  },
  subtitle: {
    color: '#7a859c',
    marginBottom: 24,
    marginTop: 6,
  },
  actions: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 8,
    alignItems: 'center',
  },
  cancel: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#ebf4ff',
  },
  cancelText: {
    color: '#008cff',
    fontWeight: '600',
  },
});

