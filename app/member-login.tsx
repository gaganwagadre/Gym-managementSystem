import { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { FitLogo, FormField, PrimaryButton } from '../src/components';
import { ROUTES } from '../src/utils/routes';

export default function MemberLoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <FitLogo size="lg" />
        <View style={styles.card}>
          <Text style={styles.title}>Member Sign in and Start your Session</Text>
          <FormField label="Email" placeholder="Email" required keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
          <View>
            <View style={styles.passwordRow}>
              <Text style={styles.passwordLabel}>
                Password <Text style={styles.star}>*</Text>
              </Text>
              <Pressable onPress={() => router.push(ROUTES.FORGOT_PASSWORD)}>
                <Text style={styles.link}>Forgot Password</Text>
              </Pressable>
            </View>
            <FormField label="" placeholder="Password" required enableToggle value={password} onChangeText={setPassword} secureTextEntry />
          </View>
          <Pressable onPress={() => router.push(ROUTES.MEMBER_SIGNUP)} style={styles.memberHint}>
            <Text style={styles.link}>Not a Member? Register here</Text>
          </Pressable>
          <PrimaryButton label="Sign in" onPress={() => router.push(ROUTES.DASHBOARD)} />

          <Pressable onPress={() => router.push(ROUTES.LOGIN)} style={styles.bottomLink}>
            <Text style={styles.link}>Admin Login</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f8fbff',
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
    textAlign: 'center',
    marginBottom: 24,
  },
  passwordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  passwordLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1c2b4f',
  },
  star: {
    color: '#008cff',
  },
  link: {
    color: '#008cff',
    fontWeight: '600',
  },
  memberHint: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  bottomLink: {
    marginTop: 14,
    alignItems: 'center',
  },
});

